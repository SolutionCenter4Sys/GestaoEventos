import { SetMetadata } from '@nestjs/common';

/**
 * Decorator para marcar endpoints públicos (sem autenticação)
 * 
 * Uso:
 * @Post('login')
 * @Public()
 * login(@Body() loginDto: LoginDto) {
 *   return this.authService.login(loginDto);
 * }
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
