import { IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PerfilUsuario } from '@prisma/client';

export class ListarUsuariosDto {
  @IsOptional()
  @IsEnum(PerfilUsuario)
  perfil?: PerfilUsuario;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}

export class ListarUsuariosResponseDto {
  usuarios: Array<{
    id: string;
    nome: string;
    email: string;
    perfil: PerfilUsuario;
    ativo: boolean;
    criadoEm: Date;
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
