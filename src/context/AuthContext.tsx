/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserRole, UserSession } from '../types';

export interface DemoAccount {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  tenantName: string;
  passwordHint: string;
}

export const DEMO_ACCOUNTS: Record<UserRole, DemoAccount> = {
  empleado: {
    id: 'usr_emp_01',
    email: 'caja@allday.cafe',
    name: 'Carlos Barista',
    role: 'empleado',
    roleLabel: 'Personal de Barra',
    tenantName: 'AllDayCafé - Barra Principal',
    passwordHint: 'caja123',
  },
  admin: {
    id: 'usr_adm_01',
    email: 'admin@allday.cafe',
    name: 'Ana Gerente',
    role: 'admin',
    roleLabel: 'Administrador de Local',
    tenantName: 'AllDayCafé - Sede Central',
    passwordHint: 'admin123',
  },
  jefe: {
    id: 'usr_jef_01',
    email: 'gerencia@allday.cafe',
    name: 'Roberto Dueño',
    role: 'jefe',
    roleLabel: 'Gerencia General & Propietario',
    tenantName: 'AllDayCafé - Corporativo',
    passwordHint: 'jefe123',
  },
};

const STORAGE_KEY = 'alldaycafe_user_session';

export interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as UserSession;
      }
    } catch {
      // Fallback silently if storage parse fails
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem('cafe_user_role', user.role);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (
    email: string,
    password = ''
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // Realistic brief latency for feedback
    await new Promise((res) => setTimeout(res, 500));

    const cleanEmail = email.trim().toLowerCase();

    // Check if matching any of the demo accounts
    const matchedAccount = Object.values(DEMO_ACCOUNTS).find(
      (acc) => acc.email.toLowerCase() === cleanEmail
    );

    if (matchedAccount) {
      if (password && password !== matchedAccount.passwordHint) {
        setIsLoading(false);
        return { 
          success: false, 
          error: `Contraseña incorrecta para ${matchedAccount.name}. Prueba con "${matchedAccount.passwordHint}".` 
        };
      }

      const session: UserSession = {
        id: matchedAccount.id,
        email: matchedAccount.email,
        name: matchedAccount.name,
        role: matchedAccount.role,
        tenantName: matchedAccount.tenantName,
      };

      setUser(session);
      setIsLoading(false);
      return { success: true };
    }

    // Generic login validation for any custom valid email
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setIsLoading(false);
      return { success: false, error: 'Por favor ingresa un correo electrónico corporativo válido.' };
    }

    if (password && password.length < 4) {
      setIsLoading(false);
      return { success: false, error: 'La contraseña debe contener al menos 4 caracteres.' };
    }

    // Default to admin role if unknown email is supplied
    const fallbackSession: UserSession = {
      id: `usr_${Date.now()}`,
      email: cleanEmail,
      name: cleanEmail.split('@')[0].replace('.', ' '),
      role: 'admin',
      tenantName: 'AllDayCafé - Sede Central',
    };

    setUser(fallbackSession);
    setIsLoading(false);
    return { success: true };
  };

  const loginAsDemo = (role: UserRole) => {
    const account = DEMO_ACCOUNTS[role];
    const session: UserSession = {
      id: account.id,
      email: account.email,
      name: account.name,
      role: account.role,
      tenantName: account.tenantName,
    };
    setUser(session);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    const account = DEMO_ACCOUNTS[newRole];
    setUser({
      ...user,
      role: newRole,
      name: account.name,
      tenantName: account.tenantName,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsDemo,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
