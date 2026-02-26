import { IsString, IsNotEmpty, Length } from 'class-validator';

export class HabilitarTwoFactorDto {
  // Nenhum campo necessário - apenas chama o endpoint para gerar o QR
}

export class HabilitarTwoFactorResponseDto {
  secret: string; // Secret para o usuário guardar
  qrCodeUrl: string; // Data URL do QR Code
  codigosRecuperacao: string[]; // 10 códigos de backup
  message: string;
}

export class ValidarTwoFactorDto {
  @IsString()
  @IsNotEmpty({ message: 'Código 2FA é obrigatório' })
  @Length(6, 6, { message: 'Código 2FA deve ter 6 dígitos' })
  codigo: string;
}

export class ValidarTwoFactorResponseDto {
  message: string;
  twoFactorHabilitado: boolean;
}

export class DesabilitarTwoFactorDto {
  @IsString()
  @IsNotEmpty({ message: 'Código 2FA é obrigatório para desabilitar' })
  @Length(6, 6, { message: 'Código 2FA deve ter 6 dígitos' })
  codigo: string;
}

export class TwoFactorStatusDto {
  habilitado: boolean;
  habilitadoEm?: Date;
}
