import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserData {
  id: string;
  email: string;
  nome: string;
  perfil: string;
}

/**
 * Decorator para obter o usuário autenticado da requisição
 * 
 * Uso:
 * @Get('perfil')
 * @UseGuards(JwtAuthGuard)
 * getMeuPerfil(@CurrentUser() user: CurrentUserData) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserData => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
