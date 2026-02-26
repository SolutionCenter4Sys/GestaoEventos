import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { RequireRoles } from '@/auth/decorators/require-roles.decorator';
import { CurrentUser, CurrentUserData } from '@/auth/decorators/current-user.decorator';
import { PerfilUsuario } from '@prisma/client';
import { ListarUsuariosDto, ListarUsuariosResponseDto } from './dto/listar-usuarios.dto';
import {
  AtualizarPerfilDto,
  AtualizarPerfilResponseDto,
} from './dto/atualizar-perfil.dto';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) {}

  /**
   * EP-08-F8.2-US-BE-03: Listar usuários
   * GET /usuarios
   * 
   * @RequireRoles - ADMIN only
   */
  @Get()
  @RequireRoles(PerfilUsuario.ADMIN)
  async listar(@Query() dto: ListarUsuariosDto): Promise<ListarUsuariosResponseDto> {
    return this.usuariosService.listar(dto);
  }

  /**
   * EP-08-F8.2-US-BE-03: Atualizar perfil de um usuário
   * PUT /usuarios/:id/perfil
   * 
   * @RequireRoles - ADMIN only
   */
  @Put(':id/perfil')
  @RequireRoles(PerfilUsuario.ADMIN)
  async atualizarPerfil(
    @Param('id') usuarioId: string,
    @Body() dto: AtualizarPerfilDto,
    @CurrentUser() admin: CurrentUserData,
  ): Promise<AtualizarPerfilResponseDto> {
    return this.usuariosService.atualizarPerfil(usuarioId, dto, admin.id);
  }

  /**
   * Buscar usuário por ID
   * GET /usuarios/:id
   * 
   * @RequireRoles - ADMIN only
   */
  @Get(':id')
  @RequireRoles(PerfilUsuario.ADMIN)
  async buscarPorId(@Param('id') usuarioId: string) {
    return this.usuariosService.buscarPorId(usuarioId);
  }
}
