/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { UserRole } from '../types';
import { useAuth } from './AuthContext';

export interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const RoleContext = createContext<RoleContextType | null>(null);

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

export interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider = ({ children }: RoleProviderProps) => {
  const { user, switchRole } = useAuth();

  const [localRole, setLocalRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('cafe_user_role') as UserRole | null;
    return saved && ['empleado', 'admin', 'jefe'].includes(saved) ? saved : 'admin';
  });

  // Source of truth: active user session role, fallback to local role
  const role = user?.role || localRole;

  const setRole = (newRole: UserRole) => {
    setLocalRole(newRole);
    localStorage.setItem('cafe_user_role', newRole);
    if (user && user.role !== newRole) {
      switchRole(newRole);
    }
  };

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};
