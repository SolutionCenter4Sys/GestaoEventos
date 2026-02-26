import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { CurrentUser, CurrentUserData } from './decorators/current-user.decorator';
import {
  LoginDto,
  LoginResponseDto,
  TwoFactorRequiredResponseDto,
} from './dto/login.dto';
import { RefreshTokenDto, RefreshTokenResponseDto } from './dto/refresh-token.dto';
import {
  RecuperarSenhaDto,
  RecuperarSenhaResponseDto,
} from './dto/recuperar-senha.dto';
import { ResetarSenhaDto, ResetarSenhaResponseDto } from './dto/resetar-senha.dto';
import {
  HabilitarTwoFactorResponseDto,
  ValidarTwoFactorDto,
  ValidarTwoFactorResponseDto,
  DesabilitarTwoFactorDto,
  TwoFactorStatusDto,
} from './dto/two-factor.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * EP-08-F8.1-US-BE-01: Login
   * POST /auth/login
   * 
   * @Public - Não requer autenticação
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
  ): Promise<LoginResponseDto | TwoFactorRequiredResponseDto> {
    const ipOrigem = (req.ip || req.connection.remoteAddress || 'unknown').replace('::ffff:', '');
    const userAgent = req.headers['user-agent'] || 'unknown';

    return this.authService.login(loginDto, ipOrigem, userAgent);
  }

  /**
   * Refresh Token
   * POST /auth/refresh
   * 
   * @Public - Usa refresh token em vez de JWT
   */
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenResponseDto> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  /**
   * EP-08-F8.1-US-BE-02: Solicitar Recuperação de Senha
   * POST /auth/recuperar-senha
   * 
   * @Public
   */
  @Public()
  @Post('recuperar-senha')
  @HttpCode(HttpStatus.OK)
  async recuperarSenha(
    @Body() dto: RecuperarSenhaDto,
    @Req() req: Request,
  ): Promise<RecuperarSenhaResponseDto> {
    const ipOrigem = (req.ip || req.connection.remoteAddress || 'unknown').replace('::ffff:', '');
    return this.authService.recuperarSenha(dto, ipOrigem);
  }

  /**
   * EP-08-F8.1-US-BE-02: Resetar Senha
   * PUT /auth/resetar-senha
   * 
   * @Public
   */
  @Public()
  @Post('resetar-senha')
  @HttpCode(HttpStatus.OK)
  async resetarSenha(@Body() dto: ResetarSenhaDto): Promise<ResetarSenhaResponseDto> {
    return this.authService.resetarSenha(dto);
  }

  /**
   * EP-08-F8.1-US-BE-03: Status do 2FA
   * GET /auth/2fa/status
   * 
   * @Protected - Requer autenticação
   */
  @UseGuards(JwtAuthGuard)
  @Get('2fa/status')
  async getTwoFactorStatus(@CurrentUser() user: CurrentUserData): Promise<TwoFactorStatusDto> {
    return this.authService.getTwoFactorStatus(user.id);
  }

  /**
   * EP-08-F8.1-US-BE-03: Habilitar 2FA (Gerar QR Code)
   * POST /auth/2fa/habilitar
   * 
   * @Protected
   */
  @UseGuards(JwtAuthGuard)
  @Post('2fa/habilitar')
  async habilitarTwoFactor(
    @CurrentUser() user: CurrentUserData,
  ): Promise<HabilitarTwoFactorResponseDto> {
    return this.authService.habilitarTwoFactor(user.id);
  }

  /**
   * EP-08-F8.1-US-BE-03: Validar 2FA (Confirmar habilitação)
   * POST /auth/2fa/validar
   * 
   * @Protected
   */
  @UseGuards(JwtAuthGuard)
  @Post('2fa/validar')
  async validarTwoFactor(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: ValidarTwoFactorDto,
  ): Promise<ValidarTwoFactorResponseDto> {
    return this.authService.validarTwoFactor(user.id, dto);
  }

  /**
   * EP-08-F8.1-US-BE-03: Desabilitar 2FA
   * DELETE /auth/2fa
   * 
   * @Protected
   */
  @UseGuards(JwtAuthGuard)
  @Delete('2fa')
  async desabilitarTwoFactor(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: DesabilitarTwoFactorDto,
  ): Promise<{ message: string }> {
    return this.authService.desabilitarTwoFactor(user.id, dto.codigo);
  }

  /**
   * Perfil do usuário autenticado
   * GET /auth/me
   * 
   * @Protected
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user: CurrentUserData) {
    return user;
  }

  /**
   * Logout (Revogar refresh token)
   * POST /auth/logout
   * 
   * @Protected
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() dto: RefreshTokenDto): Promise<{ message: string }> {
    // Revogar o refresh token
    // TODO: Implementar revogação do refresh token específico
    return { message: 'Logout realizado com sucesso' };
  }
}
