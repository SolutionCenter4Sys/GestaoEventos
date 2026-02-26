import { IsEmail, IsNotEmpty } from 'class-validator';

export class RecuperarSenhaDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  email: string;
}

export class RecuperarSenhaResponseDto {
  message: string;
  // Por segurança, sempre retorna sucesso mesmo se email não existir
}
