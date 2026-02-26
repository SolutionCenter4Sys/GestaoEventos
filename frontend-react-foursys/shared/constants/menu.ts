export interface MenuItem {
  path: string;
  label: string;
  icon?: string;
  roles: string[];
  children?: MenuItem[];
}

export const MENU_ITEMS: MenuItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard', roles: ['admin', 'marketing', 'vendas', 'professor', 'participante', 'paciente_modelo'] },
  { path: '/fluxo-demonstracao', label: 'Fluxo End-to-End', icon: 'account_tree', roles: ['admin', 'marketing', 'vendas'] },
  { path: '/meus-dados-privacidade', label: 'Meus Dados e Privacidade', icon: 'privacy_tip', roles: ['admin', 'marketing', 'vendas', 'professor', 'participante', 'paciente_modelo'] },
  { path: '/dashboard-gerencial', label: 'Dashboard Gerencial', icon: 'analytics', roles: ['admin'] },
  { path: '/minha-area', label: 'Minha área', icon: 'person', roles: ['participante'] },
  { path: '/solicitacoes', label: 'Solicitações', icon: 'request_page', roles: ['admin', 'marketing', 'vendas'] },
  { path: '/eventos', label: 'Eventos', icon: 'event', roles: ['admin', 'marketing'] },
  { path: '/documentos', label: 'Documentos', icon: 'folder_shared', roles: ['admin', 'marketing', 'professor'] },
  { path: '/painel-sincronizacao', label: 'Integração Outlook', icon: 'sync_alt', roles: ['admin', 'marketing', 'professor'] },
  { path: '/logs-acesso', label: 'Auditoria e Logs', icon: 'security', roles: ['admin'] },
  { path: '/config-certificados', label: 'Configurar Certificados', icon: 'emoji_events', roles: ['admin', 'marketing'] },
  { path: '/templates-email', label: 'Templates de E-mail', icon: 'email', roles: ['admin', 'marketing'] },
  { path: '/relatorios', label: 'Relatórios', icon: 'assessment', roles: ['admin', 'marketing'] },
  { path: '/gestao-lgpd', label: 'Gestão LGPD', icon: 'shield', roles: ['admin'] },
  { path: '/gestao-perfis', label: 'Gestão de perfis', icon: 'people', roles: ['admin'] },
  { path: '/config-gatilhos', label: 'Gatilhos', icon: 'notifications_active', roles: ['admin', 'marketing'] },
  { path: '/config-2fa', label: 'Configurar 2FA', icon: 'security', roles: ['admin', 'marketing', 'vendas', 'professor', 'participante', 'paciente_modelo'] },
];

export function getMenuItemsForRoles(userRoles: string[]): MenuItem[] {
  if (!userRoles?.length) return [];
  return MENU_ITEMS.filter((item) => item.roles.some((r) => userRoles.includes(r)));
}
