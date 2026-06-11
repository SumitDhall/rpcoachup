/**
 * Types for Authentication context and session state
 */
import { User, UserRole } from './user';

export interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}
