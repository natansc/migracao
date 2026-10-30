export const UserRole = {
  ADMIN: 'ADMIN',
  EDIT: 'EDIT',
  VISUALIZACAO: 'VISUALIZACAO',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const USER_ROLES: UserRole[] = Object.values(UserRole);

export function isValidRole(role: string): role is UserRole {
  return USER_ROLES.includes(role as UserRole);
}

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  EDIT: 'Editor',
  VISUALIZACAO: 'Visualização',
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  ADMIN: 'Acesso total: criar, editar, excluir e consultar integrações e usuários.',
  EDIT: 'Consultar dados e baixar arquivos/reports. Não pode criar nem excluir.',
  VISUALIZACAO: 'Somente visualizar e acompanhar status das migrações.',
};
