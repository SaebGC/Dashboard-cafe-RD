import { Wallet, TrendingUp, ShieldCheck, UserCheck } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { useRole } from '../../context/RoleContext';
import type { UserRole } from '../../types';

export interface TopbarProps {
  title: string;
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
}

export const Topbar = ({ title, currentRole: propRole, onRoleChange }: TopbarProps) => {
  const { netAvailableCash, todayTotalEarnings, formatDOP } = useFinancial();
  const { role: contextRole, setRole: contextSetRole } = useRole();

  const role = propRole || contextRole;
  const setRole = onRoleChange || contextSetRole;

  const isEmployee = role === 'empleado';

  const roleLabels: Record<UserRole, string> = {
    admin: 'Admin',
    empleado: 'Empleado',
    jefe: 'Jefe',
  };

  return (
    <header className="h-20 border-b border-[#EBE6DC] bg-white/90 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10 gap-4">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-[#0F281E]">{title}</h2>
        {isEmployee && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F4EA] text-[#1E653F] border border-[#1E653F]/20">
            <UserCheck size={14} className="mr-1.5" /> Modo Cajero (Solo POS)
          </span>
        )}
      </div>
      
      <div className="flex items-center space-x-5">
        {/* Role Selector */}
        <div className="flex items-center bg-[#F9F7F2] p-1 rounded-xl border border-[#EBE6DC] shadow-sm">
          <div className="px-2.5 text-xs text-[#6B7C72] font-bold flex items-center gap-1 hidden sm:flex">
            <ShieldCheck size={15} className="text-[#C8963E]" />
            <span>Rol:</span>
          </div>
          {(['admin', 'empleado', 'jefe'] as UserRole[]).map((r) => {
            const isActive = role === r;
            return (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                  isActive 
                    ? 'bg-[#0F281E] text-[#C8963E] shadow-sm' 
                    : 'text-[#6B7C72] hover:text-[#0F281E] hover:bg-white'
                }`}
                title={`Cambiar a vista de ${roleLabels[r]}`}
              >
                {roleLabels[r]}
              </button>
            );
          })}
        </div>

        {/* Financial Balances: ONLY visible to admin and jefe; HIDDEN for empleado */}
        {!isEmployee && (
          <div className="flex items-center space-x-4">
            {/* Today's Gross Earnings */}
            <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl border border-[#EBE6DC] shadow-[0_2px_8px_rgba(15,40,30,0.03)]">
              <div className="p-1.5 bg-[#E6F4EA] rounded-lg">
                <TrendingUp size={16} className="text-[#1E653F]" />
              </div>
              <div>
                <p className="text-[10px] text-[#6B7C72] font-bold uppercase tracking-wider">Ingresos de Hoy</p>
                <p className="text-sm font-bold text-[#1E653F]">{formatDOP(todayTotalEarnings)}</p>
              </div>
            </div>

            {/* Global Balance */}
            <div className="flex items-center space-x-3 bg-white px-5 py-2.5 rounded-full border border-[#EBE6DC] shadow-[0_2px_8px_rgba(15,40,30,0.03)]">
              <div className="p-1.5 bg-[#FEF3D6] rounded-full">
                <Wallet size={18} className="text-[#8F6010]" />
              </div>
              <div>
                <p className="text-xs text-[#6B7C72] font-bold uppercase tracking-wider">Balance en Caja</p>
                <p className="text-sm font-bold text-[#C8963E]">{formatDOP(netAvailableCash)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
