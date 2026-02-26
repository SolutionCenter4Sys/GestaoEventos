import { SetMetadata } from '@nestjs/common';
import { PerfilUsuario } from '@prisma/client';

/**
 * Decorator para definir quais perfis podem acessar uma rota
 * 
 * Uso:
 * @Get('admin-only')
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @RequireRoles(PerfilUsuario.ADMIN)
 * adminOnlyRoute() {
 *   return { message: 'Acesso exclusivo para Admin' };
 * }
 * 
 * @Get('admin-ou-marketing')
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @RequireRoles(PerfilUsuario.ADMIN, PerfilUsuario.MARKETING)
 * adminOrMarketingRoute() {
 *   return { message: 'Acesso para Admin ou Marketing' };
 * }
 */
export const RequireRoles = (...roles: PerfilUsuario[]) => SetMetadata('roles', roles);
