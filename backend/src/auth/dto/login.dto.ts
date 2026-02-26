import { IsEmail, IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  senha: string;

  @IsOptional()
  @IsString()
  codigoTwoFactor?: string; // Código 2FA (se habilitado)
}

export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
    perfil: string;
    twoFactorHabilitado: boolean;
  };
}

export class TwoFactorRequiredResponseDto {
  requiresTwoFactor: true;
  message: string;
}
