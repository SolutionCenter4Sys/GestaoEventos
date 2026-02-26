import { IsEnum, IsNotEmpty } from 'class-validator';
import { PerfilUsuario } from '@prisma/client';

export class AtualizarPerfilDto {
  @IsEnum(PerfilUsuario, { message: 'Perfil inválido' })
  @IsNotEmpty({ message: 'Perfil é obrigatório' })
  perfil: PerfilUsuario;
}

export class AtualizarPerfilResponseDto {
  message: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
    perfil: PerfilUsuario;
  };
}
