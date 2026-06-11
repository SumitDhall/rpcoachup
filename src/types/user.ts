/**
 * Core User and Role types
 */

export type UserRole = 'dancer' | 'artist';

export interface User {
  name: string;
  role: UserRole;
}
