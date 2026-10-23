import { ShieldCheck, LogOut } from 'lucide-react';
import cafeLogo from '../../assets/cafe-logo-all.jpg';
import type { UserRole } from '../../types';
import { useRole } from '../../context/RoleContext';
import { useAuth } from '../../context/AuthContext';
import { navItems } from '../../constants/navigation';

export interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
}

export const Sidebar = ({ 
  currentView, 
  setCurrentView, 
  currentRole: propRole,
  onRoleChange 
}: SidebarProps) => {
  const { role: contextRole, setRole: contextSetRole } = useRole();
  const { user, logout } = useAuth();
  const role = propRole || contextRole;
  const setRole = onRoleChange || contextSetRole;

  const roleMeta: Record<UserRole, { title: string; subtitle: string; initials: string }> = {
    admin: {
      title: 'Administrador',
      subtitle: 'admin@allday.cafe',
      initials: 'AD',
    },
    empleado: {
      title: 'Personal de Barra',
      subtitle: 'caja@allday.cafe',
      initials: 'EM',
    },
    jefe: {
      title: 'Gerencia General',
      subtitle: 'gerencia@allday.cafe',
      initials: 'JF',
    },
  };

  const currentMeta = roleMeta[role];
  const displayName = user?.name || currentMeta.title;
  const displayEmail = user?.email || currentMeta.subtitle;
  const displayInitials = user?.name 
    ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : currentMeta.initials;

  const visibleNavItems = navItems.filter((item) => item.allowedRoles.includes(role));

  return (
    <aside className="w-64 bg-[#0F281E] border-r border-[#1B3D2F] h-screen flex flex-col select-none flex-shrink-0">
      <div className="py-6 px-4 flex items-center justify-center border-b border-[#1B3D2F]/60">
        <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[#C8963E] bg-[#0F281E] flex items-center justify-center p-1.5 shadow-lg">
          <img 
            src={cafeLogo} 
            alt="All Day Café Logo" 
            className="w-full h-full object-contain rounded-full" 
          />
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        <div className="px-4 pb-2">
          <p className="text-[10px] uppercase font-bold text-[#6B7C72] tracking-wider">
            Navegación ({role})
          </p>
        </div>
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                isActive 
                  ? 'bg-[#183D2F] text-white font-semibold border-l-4 border-[#C99F5B] shadow-sm' 
                  : 'text-[#D8D1C2] hover:bg-[#183D2F]/60 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-[#C99F5B]' : 'text-[#D8D1C2]/70'} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-[#1B3D2F] space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#183D2F] border border-[#1B3D2F] flex items-center justify-center text-[#C99F5B] font-bold text-sm">
            {displayInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#D8D1C2] truncate">{displayName}</p>
            <p className="text-xs text-[#6B7C72] truncate">{displayEmail}</p>
          </div>
          <button
            onClick={logout}
            title="Cerrar Sesión"
            className="p-1.5 rounded-lg text-[#6B7C72] hover:text-[#A83226] hover:bg-[#A83226]/10 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* Quick Role Switcher in Sidebar */}
        <div className="pt-2 border-t border-[#1B3D2F]/60">
          <label className="text-[10px] uppercase font-bold tracking-wider text-[#6B7C72] flex items-center mb-1.5">
            <ShieldCheck size={12} className="mr-1 text-[#C8963E]" />
            Cambiar Rol
          </label>
          <div className="grid grid-cols-3 gap-1 bg-[#091812] p-1 rounded-lg border border-[#1B3D2F]">
            {(['admin', 'empleado', 'jefe'] as UserRole[]).map((r) => {
              const isSelected = role === r;
              return (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`text-[11px] py-1 rounded font-semibold capitalize transition-all ${
                    isSelected 
                      ? 'bg-[#183D2F] text-[#C99F5B] shadow-sm font-bold' 
                      : 'text-[#6B7C72] hover:text-[#D8D1C2]'
                  }`}
                  title={`Cambiar a rol ${r}`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};

