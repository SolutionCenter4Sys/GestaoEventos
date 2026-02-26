import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PerfilUsuario } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obter os roles necessários do decorator @RequireRoles()
    const requiredRoles = this.reflector.getAllAndOverride<PerfilUsuario[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      // Se não há roles definidos, permite acesso
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    const hasRole = requiredRoles.includes(user.perfil);

    if (!hasRole) {
      throw new ForbiddenException(
        `Acesso negado. Perfis permitidos: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
