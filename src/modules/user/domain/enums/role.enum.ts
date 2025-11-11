export const ROLE_ENUM = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type Role = (typeof ROLE_ENUM)[keyof typeof ROLE_ENUM];