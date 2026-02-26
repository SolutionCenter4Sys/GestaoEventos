import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class ResetarSenhaDto {
  @IsString()
  @IsNotEmpty({ message: 'Token é obrigatório' })
  token: string;

  @IsString()
  @IsNotEmpty({ message: 'Nova senha é obrigatória' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'Senha deve conter: maiúscula, minúscula, número e caractere especial',
    },
  )
  novaSenha: string;
}

export class ResetarSenhaResponseDto {
  message: string;
}
