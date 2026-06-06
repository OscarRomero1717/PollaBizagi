export const RoleNames = {
  User: 'User',
  Admin: 'Admin'
} as const;

export type RoleName = (typeof RoleNames)[keyof typeof RoleNames];
