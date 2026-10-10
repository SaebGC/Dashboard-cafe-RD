import React from 'react';
import { Wallet, TrendingUp } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';

export const Topbar = ({ title }) => {
  const { netAvailableCash, todayTotalEarnings, formatDOP } = useFinancial();

  return (
    <div className="h-20 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-10">
      <h2 className="text-2xl font-bold text-slate-100">{title}</h2>
      
      <div className="flex items-center space-x-6">
        {/* Today's Gross Earnings */}
        <div className="flex items-center space-x-3 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700/50">
          <div className="p-1.5 bg-emerald-500/20 rounded-lg">
            <TrendingUp size={16} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ingresos de Hoy</p>
            <p className="text-sm font-bold text-emerald-400">{formatDOP(todayTotalEarnings)}</p>
          </div>
        </div>

        {/* Global Balance */}
        <div className="flex items-center space-x-3 bg-slate-800 px-5 py-2.5 rounded-full border border-slate-700/50 shadow-inner">
          <div className="p-1.5 bg-amber-500/20 rounded-full">
            <Wallet size={18} className="text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Balance en Caja</p>
            <p className="text-sm font-bold text-amber-400">{formatDOP(netAvailableCash)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
