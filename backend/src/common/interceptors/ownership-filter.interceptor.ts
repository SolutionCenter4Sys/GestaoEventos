import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PerfilUsuario } from '@prisma/client';

/**
 * EP-08-F8.2-US-BE-02: Ownership Filter Interceptor
 * 
 * Interceptor para automaticamente filtrar dados com base no perfil do usuário:
 * - ADMIN: Vê tudo
 * - VENDAS: Vê apenas suas próprias solicitações
 * - PROFESSOR: Vê apenas seus próprios eventos e pacientes modelo vinculados
 * - PARTICIPANTE: Vê apenas suas próprias inscrições
 * 
 * Uso:
 * @UseInterceptors(OwnershipFilterInterceptor)
 * @Get('minhas-solicitacoes')
 * async minhasSolicitacoes(@CurrentUser() user: CurrentUserData) {
 *   // O interceptor automaticamente adiciona filtro: { solicitanteId: user.id }
 *   return this.solicitacoesService.listar();
 * }
 * 
 * IMPORTANTE: Este interceptor apenas adiciona o contexto de ownership na requisição.
 * O Service deve implementar a lógica de filtro baseada neste contexto.
 */
@Injectable()
export class OwnershipFilterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      // Sem usuário autenticado - deixa passar (guards tratarão)
      return next.handle();
    }

    // Adiciona contexto de ownership na requisição
    request.ownershipContext = {
      userId: user.id,
      perfil: user.perfil,
      isAdmin: user.perfil === PerfilUsuario.ADMIN,
      filters: this.buildFilters(user),
    };

    return next.handle();
  }

  /**
   * Constrói filtros automáticos baseados no perfil
   */
  private buildFilters(user: any) {
    switch (user.perfil) {
      case PerfilUsuario.ADMIN:
        // Admin vê tudo - sem filtros
        return {};

      case PerfilUsuario.VENDAS:
        // Vendas vê apenas suas solicitações
        return {
          solicitacoes: { solicitanteId: user.id },
        };

      case PerfilUsuario.PROFESSOR:
        // Professor vê apenas seus eventos e pacientes vinculados
        return {
          eventos: { professorId: user.id },
          pacientesModelo: {
            evento: { professorId: user.id },
          },
        };

      case PerfilUsuario.PARTICIPANTE:
        // Participante vê apenas suas inscrições
        return {
          inscricoes: { participanteId: user.id },
        };

      default:
        // Outros perfis: sem dados por padrão
        return { id: 'NEVER_MATCH' };
    }
  }
}

/**
 * Interface para o contexto de ownership adicionado à requisição
 */
export interface OwnershipContext {
  userId: string;
  perfil: PerfilUsuario;
  isAdmin: boolean;
  filters: Record<string, any>;
}

/**
 * Decorator para obter o contexto de ownership
 */
import { createParamDecorator } from '@nestjs/common';

export const Ownership = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): OwnershipContext => {
    const request = ctx.switchToHttp().getRequest();
    return request.ownershipContext || null;
  },
);
