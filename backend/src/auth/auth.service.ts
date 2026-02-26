import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { addDays, addHours } from 'date-fns';
import {
  LoginDto,
  LoginResponseDto,
  TwoFactorRequiredResponseDto,
} from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RecuperarSenhaDto } from './dto/recuperar-senha.dto';
import { ResetarSenhaDto } from './dto/resetar-senha.dto';
import {
  HabilitarTwoFactorResponseDto,
  ValidarTwoFactorDto,
  TwoFactorStatusDto,
} from './dto/two-factor.dto';
import { TipoEventoAuth, PerfilUsuario } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * EP-08-F8.1-US-BE-01: Endpoint de Login
   * POST /auth/login
   */
  async login(
    loginDto: LoginDto,
    ipOrigem: string,
    userAgent: string,
  ): Promise<LoginResponseDto | TwoFactorRequiredResponseDto> {
    const { email, senha, codigoTwoFactor } = loginDto;

    // 1. Buscar usuário
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!usuario) {
      // Log falha
      await this.logAuthEvent({
        email,
        tipoEvento: TipoEventoAuth.LOGIN_FALHA,
        ipOrigem,
        userAgent,
        sucesso: false,
        motivoFalha: 'Usuário não encontrado',
      });
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    // 2. Verificar se conta está ativa
    if (!usuario.ativo) {
      await this.logAuthEvent({
        usuarioId: usuario.id,
        email,
        tipoEvento: TipoEventoAuth.ACESSO_NEGADO,
        ipOrigem,
        userAgent,
        sucesso: false,
        motivoFalha: 'Conta inativa',
      });
      throw new UnauthorizedException('Conta inativa');
    }

    // 3. Verificar se está bloqueado
    if (usuario.bloqueadoAte && usuario.bloqueadoAte > new Date()) {
      await this.logAuthEvent({
        usuarioId: usuario.id,
        email,
        tipoEvento: TipoEventoAuth.ACESSO_NEGADO,
        ipOrigem,
        userAgent,
        sucesso: false,
        motivoFalha: `Conta bloqueada até ${usuario.bloqueadoAte.toISOString()}`,
      });
      throw new UnauthorizedException(
        `Conta bloqueada até ${usuario.bloqueadoAte.toLocaleString('pt-BR')}`,
      );
    }

    // 4. Validar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);

    if (!senhaValida) {
      // Incrementar tentativas falhas
      const tentativas = usuario.tentativasLoginFalhas + 1;
      const bloqueadoAte = tentativas >= 5 ? addHours(new Date(), 1) : null;

      await this.prisma.usuario.update({
        where: { id: usuario.id },
        data: {
          tentativasLoginFalhas: tentativas,
          bloqueadoAte,
          ultimaTentativaLogin: new Date(),
        },
      });

      await this.logAuthEvent({
        usuarioId: usuario.id,
        email,
        tipoEvento: TipoEventoAuth.LOGIN_FALHA,
        ipOrigem,
        userAgent,
        sucesso: false,
        motivoFalha: 'Senha incorreta',
        metadados: { tentativas },
      });

      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    // 5. Verificar 2FA
    if (usuario.twoFactorHabilitado) {
      if (!codigoTwoFactor) {
        // Retorna indicando que 2FA é necessário
        return {
          requiresTwoFactor: true,
          message: 'Código de autenticação de dois fatores é necessário',
        };
      }

      // Validar código 2FA
      const valid = speakeasy.totp.verify({
        secret: usuario.twoFactorSecret,
        encoding: 'base32',
        token: codigoTwoFactor,
        window: 2, // Permite 2 códigos antes/depois (tolerância de tempo)
      });

      if (!valid) {
        // Verificar se é código de recuperação
        const codigoRecuperacaoValido = await this.validarCodigoRecuperacao(
          usuario.id,
          codigoTwoFactor,
        );

        if (!codigoRecuperacaoValido) {
          await this.logAuthEvent({
            usuarioId: usuario.id,
            email,
            tipoEvento: TipoEventoAuth.LOGIN_FALHA,
            ipOrigem,
            userAgent,
            sucesso: false,
            motivoFalha: 'Código 2FA inválido',
          });
          throw new UnauthorizedException('Código de autenticação inválido');
        }
      }
    }

    // 6. Login bem-sucedido - resetar tentativas falhas
    await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        tentativasLoginFalhas: 0,
        bloqueadoAte: null,
        ultimaTentativaLogin: new Date(),
      },
    });

    // 7. Gerar tokens
    const tokens = await this.generateTokens(usuario.id, usuario.email, usuario.perfil);

    // 8. Log sucesso
    await this.logAuthEvent({
      usuarioId: usuario.id,
      email,
      tipoEvento: TipoEventoAuth.LOGIN_SUCESSO,
      ipOrigem,
      userAgent,
      sucesso: true,
    });

    return {
      ...tokens,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
        twoFactorHabilitado: usuario.twoFactorHabilitado,
      },
    };
  }

  /**
   * Gerar Access Token e Refresh Token
   */
  private async generateTokens(
    usuarioId: string,
    email: string,
    perfil: PerfilUsuario,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: usuarioId, email, perfil };

    // Access Token (curta duração - 15 min)
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m'),
    });

    // Refresh Token (longa duração - 7 dias)
    const refreshToken = uuidv4();
    const expiraEm = addDays(new Date(), 7);

    await this.prisma.refreshToken.create({
      data: {
        usuarioId,
        token: refreshToken,
        expiraEm,
      },
    });

    return { accessToken, refreshToken };
  }

  /**
   * Refresh Token - Renovar Access Token
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { refreshToken } = refreshTokenDto;

    // Buscar refresh token
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { usuario: true },
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    if (tokenRecord.revogado) {
      throw new UnauthorizedException('Refresh token revogado');
    }

    if (tokenRecord.expiraEm < new Date()) {
      throw new UnauthorizedException('Refresh token expirado');
    }

    // Revogar o token antigo
    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revogado: true },
    });

    // Gerar novos tokens
    return this.generateTokens(
      tokenRecord.usuario.id,
      tokenRecord.usuario.email,
      tokenRecord.usuario.perfil,
    );
  }

  /**
   * EP-08-F8.1-US-BE-02: Recuperação de Senha
   * POST /auth/recuperar-senha
   */
  async recuperarSenha(
    dto: RecuperarSenhaDto,
    ipOrigem: string,
  ): Promise<{ message: string }> {
    const { email } = dto;

    // Por segurança, sempre retorna sucesso (mesmo se email não existir)
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (usuario) {
      // Gerar token único
      const token = uuidv4();
      const expiraEm = addHours(new Date(), 1); // 1 hora

      await this.prisma.tokenRecuperacaoSenha.create({
        data: {
          usuarioId: usuario.id,
          token,
          expiraEm,
          ipSolicitacao: ipOrigem,
        },
      });

      // TODO: Enviar e-mail com link de redefinição
      // const linkRedefinicao = `${this.configService.get('FRONTEND_URL')}/redefinir-senha?token=${token}`;
      // await this.emailService.enviarRecuperacaoSenha(usuario.email, linkRedefinicao);

      console.log(`[DEBUG] Token de recuperação para ${email}: ${token}`);
    }

    return {
      message: 'Se o e-mail existir, você receberá instruções para redefinir sua senha',
    };
  }

  /**
   * EP-08-F8.1-US-BE-02: Resetar Senha
   * PUT /auth/resetar-senha
   */
  async resetarSenha(dto: ResetarSenhaDto): Promise<{ message: string }> {
    const { token, novaSenha } = dto;

    // Buscar token
    const tokenRecord = await this.prisma.tokenRecuperacaoSenha.findUnique({
      where: { token },
    });

    if (!tokenRecord) {
      throw new BadRequestException('Token inválido');
    }

    if (tokenRecord.usado) {
      throw new BadRequestException('Token já foi utilizado');
    }

    if (tokenRecord.expiraEm < new Date()) {
      throw new BadRequestException('Token expirado');
    }

    // Hash da nova senha
    const senhaHash = await bcrypt.hash(novaSenha, 12);

    // Atualizar senha e marcar token como usado
    await this.prisma.$transaction([
      this.prisma.usuario.update({
        where: { id: tokenRecord.usuarioId },
        data: { senhaHash },
      }),
      this.prisma.tokenRecuperacaoSenha.update({
        where: { id: tokenRecord.id },
        data: { usado: true, usadoEm: new Date() },
      }),
      // Revogar todos os refresh tokens (logout de todos os dispositivos)
      this.prisma.refreshToken.updateMany({
        where: { usuarioId: tokenRecord.usuarioId },
        data: { revogado: true },
      }),
    ]);

    return { message: 'Senha redefinida com sucesso' };
  }

  /**
   * EP-08-F8.1-US-BE-03: Habilitar 2FA
   * POST /auth/2fa/habilitar
   */
  async habilitarTwoFactor(usuarioId: string): Promise<HabilitarTwoFactorResponseDto> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (usuario.twoFactorHabilitado) {
      throw new BadRequestException('2FA já está habilitado');
    }

    // Gerar secret
    const secret = speakeasy.generateSecret({
      name: `Plataforma Eventos (${usuario.email})`,
      length: 32,
    });

    // Gerar QR Code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // Gerar 10 códigos de recuperação
    const codigosRecuperacao: string[] = [];
    for (let i = 0; i < 10; i++) {
      const codigo = Math.random().toString(36).substring(2, 10).toUpperCase();
      codigosRecuperacao.push(codigo);

      // Salvar hash do código
      const codigoHash = await bcrypt.hash(codigo, 10);
      await this.prisma.codigoRecuperacao2FA.create({
        data: {
          usuarioId,
          codigo: codigoHash,
        },
      });
    }

    // Salvar secret (temporariamente - será confirmado na validação)
    await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { twoFactorSecret: secret.base32 },
    });

    return {
      secret: secret.base32,
      qrCodeUrl,
      codigosRecuperacao,
      message: 'Escaneie o QR Code no seu app autenticador e valide o código',
    };
  }

  /**
   * EP-08-F8.1-US-BE-03: Validar e confirmar 2FA
   * POST /auth/2fa/validar
   */
  async validarTwoFactor(
    usuarioId: string,
    dto: ValidarTwoFactorDto,
  ): Promise<{ message: string; twoFactorHabilitado: boolean }> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario.twoFactorSecret) {
      throw new BadRequestException('2FA não foi iniciado. Chame /auth/2fa/habilitar primeiro');
    }

    // Validar código
    const valid = speakeasy.totp.verify({
      secret: usuario.twoFactorSecret,
      encoding: 'base32',
      token: dto.codigo,
      window: 2,
    });

    if (!valid) {
      throw new BadRequestException('Código inválido');
    }

    // Confirmar habilitação do 2FA
    await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        twoFactorHabilitado: true,
        twoFactorHabilitadoEm: new Date(),
      },
    });

    return {
      message: '2FA habilitado com sucesso!',
      twoFactorHabilitado: true,
    };
  }

  /**
   * EP-08-F8.1-US-BE-03: Desabilitar 2FA
   * DELETE /auth/2fa
   */
  async desabilitarTwoFactor(
    usuarioId: string,
    codigo: string,
  ): Promise<{ message: string }> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario.twoFactorHabilitado) {
      throw new BadRequestException('2FA não está habilitado');
    }

    // Validar código antes de desabilitar
    const valid = speakeasy.totp.verify({
      secret: usuario.twoFactorSecret,
      encoding: 'base32',
      token: codigo,
      window: 2,
    });

    if (!valid) {
      throw new BadRequestException('Código inválido');
    }

    // Desabilitar 2FA
    await this.prisma.$transaction([
      this.prisma.usuario.update({
        where: { id: usuarioId },
        data: {
          twoFactorHabilitado: false,
          twoFactorSecret: null,
          twoFactorHabilitadoEm: null,
        },
      }),
      // Remover códigos de recuperação
      this.prisma.codigoRecuperacao2FA.deleteMany({
        where: { usuarioId },
      }),
    ]);

    return { message: '2FA desabilitado com sucesso' };
  }

  /**
   * Status do 2FA
   */
  async getTwoFactorStatus(usuarioId: string): Promise<TwoFactorStatusDto> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: {
        twoFactorHabilitado: true,
        twoFactorHabilitadoEm: true,
      },
    });

    return {
      habilitado: usuario.twoFactorHabilitado,
      habilitadoEm: usuario.twoFactorHabilitadoEm,
    };
  }

  /**
   * Validar código de recuperação 2FA
   */
  private async validarCodigoRecuperacao(
    usuarioId: string,
    codigo: string,
  ): Promise<boolean> {
    const codigosRecuperacao = await this.prisma.codigoRecuperacao2FA.findMany({
      where: {
        usuarioId,
        usado: false,
      },
    });

    for (const cr of codigosRecuperacao) {
      const match = await bcrypt.compare(codigo, cr.codigo);
      if (match) {
        // Marcar código como usado
        await this.prisma.codigoRecuperacao2FA.update({
          where: { id: cr.id },
          data: { usado: true, usadoEm: new Date() },
        });
        return true;
      }
    }

    return false;
  }

  /**
   * EP-08-F8.1-US-BE-04: Logging de autenticação
   */
  private async logAuthEvent(data: {
    usuarioId?: string;
    email: string;
    tipoEvento: TipoEventoAuth;
    ipOrigem: string;
    userAgent: string;
    sucesso: boolean;
    motivoFalha?: string;
    metadados?: any;
  }): Promise<void> {
    try {
      // TODO: Adicionar geolocalização (geoip-lite)
      await this.prisma.logAutenticacao.create({
        data: {
          usuarioId: data.usuarioId,
          email: data.email,
          tipoEvento: data.tipoEvento,
          ipOrigem: data.ipOrigem,
          userAgent: data.userAgent,
          sucesso: data.sucesso,
          motivoFalha: data.motivoFalha,
          metadados: data.metadados,
        },
      });
    } catch (error) {
      console.error('[AUTH] Erro ao registrar log:', error);
    }
  }
}
