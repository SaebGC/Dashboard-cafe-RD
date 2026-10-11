import React from 'react';
import { Wallet, TrendingUp } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';

export const Topbar = ({ title }) => {
  const { netAvailableCash, todayTotalEarnings, formatDOP } = useFinancial();

  return (
    <header className="h-20 border-b border-[#EBE6DC] bg-white/90 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
      <h2 className="text-2xl font-bold text-[#0F281E]">{title}</h2>
      
      <div className="flex items-center space-x-6">
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
    </header>
  );
};
