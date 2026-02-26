import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { PerfilUsuario } from '@prisma/client';
import {
  ListarUsuariosDto,
  ListarUsuariosResponseDto,
} from './dto/listar-usuarios.dto';
import { AtualizarPerfilDto, AtualizarPerfilResponseDto } from './dto/atualizar-perfil.dto';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  /**
   * EP-08-F8.2-US-BE-03: Listar usuários (Admin only)
   * GET /usuarios
   */
  async listar(dto: ListarUsuariosDto): Promise<ListarUsuariosResponseDto> {
    const { perfil, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const where = perfil ? { perfil } : {};

    const [usuarios, total] = await Promise.all([
      this.prisma.usuario.findMany({
        where,
        select: {
          id: true,
          nome: true,
          email: true,
          perfil: true,
          ativo: true,
          criadoEm: true,
        },
        skip,
        take: limit,
        orderBy: { criadoEm: 'desc' },
      }),
      this.prisma.usuario.count({ where }),
    ]);

    return {
      usuarios,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * EP-08-F8.2-US-BE-03: Atualizar perfil do usuário (Admin only)
   * PUT /usuarios/:id/perfil
   */
  async atualizarPerfil(
    usuarioId: string,
    dto: AtualizarPerfilDto,
    adminId: string,
  ): Promise<AtualizarPerfilResponseDto> {
    // Buscar usuário
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // REGRA: Admin não pode remover seu próprio perfil de Admin
    if (usuarioId === adminId && dto.perfil !== PerfilUsuario.ADMIN) {
      throw new ForbiddenException(
        'Você não pode remover seu próprio perfil de administrador',
      );
    }

    // Atualizar perfil
    const usuarioAtualizado = await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { perfil: dto.perfil },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
      },
    });

    return {
      message: 'Perfil atualizado com sucesso',
      usuario: usuarioAtualizado,
    };
  }

  /**
   * Buscar usuário por ID
   */
  async buscarPorId(usuarioId: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        ativo: true,
        twoFactorHabilitado: true,
        criadoEm: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }
}
