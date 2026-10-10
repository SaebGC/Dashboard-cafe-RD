import React from 'react';
import { Card } from '../ui/Card';
import { useFinancial } from '../../context/FinancialContext';
import { TrendingUp, Wallet, Receipt, Clock, AlertCircle } from 'lucide-react';

export const OverviewView = () => {
  const { 
    todayTotalEarnings, 
    totalExpensesPaid,
    totalExpensesPending,
    totalPayrollPaid,
    totalPayrollPending,
    netAvailableCash,
    formatDOP 
  } = useFinancial();

  const totalPaidOutflows = totalExpensesPaid + totalPayrollPaid;
  const totalPendingOutflows = totalExpensesPending + totalPayrollPending;
  
  const maxBarValue = Math.max(todayTotalEarnings, totalPaidOutflows, 1);
  
  const percentExpenses = (totalExpensesPaid / maxBarValue) * 100;
  const percentPayroll = (totalPayrollPaid / maxBarValue) * 100;
  
  const visualAvailable = Math.max(0, netAvailableCash);
  const percentAvailable = (visualAvailable / maxBarValue) * 100;

  const isNegative = netAvailableCash < 0;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Earnings */}
        <Card className="relative overflow-hidden ring-2 ring-emerald-500/50 bg-slate-800/80 backdrop-blur-sm shadow-2xl shadow-emerald-900/20 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-500"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">Ingresos de Hoy</p>
              <h3 className="text-2xl font-black text-emerald-400">
                {formatDOP(todayTotalEarnings)}
              </h3>
            </div>
            <div className="p-2 rounded-xl bg-emerald-400/10 border border-emerald-500/20">
              <TrendingUp size={20} className="text-emerald-400" />
            </div>
          </div>
        </Card>

        {/* Paid Outflows */}
        <Card className="hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Egresos Pagados</p>
              <h3 className="text-xl font-bold text-slate-100">
                {formatDOP(totalPaidOutflows)}
              </h3>
              <div className="mt-2 text-xs text-slate-500 flex flex-col gap-1">
                <span className="flex justify-between"><span>Gastos:</span> <span className="text-orange-400 font-medium ml-4">{formatDOP(totalExpensesPaid)}</span></span>
                <span className="flex justify-between"><span>Nómina:</span> <span className="text-blue-400 font-medium ml-4">{formatDOP(totalPayrollPaid)}</span></span>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-700/50 border border-slate-600/50 flex-shrink-0">
              <Receipt size={20} className="text-slate-300" />
            </div>
          </div>
        </Card>

        {/* Pending Outflows */}
        <Card className="hover:-translate-y-1 transition-transform duration-300 border-amber-500/20 bg-amber-950/10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-amber-200/60 text-xs font-bold uppercase tracking-wider mb-2">Egresos Pendientes</p>
              <h3 className="text-xl font-bold text-amber-400">
                {formatDOP(totalPendingOutflows)}
              </h3>
              <div className="mt-2 text-xs text-amber-500/60 flex flex-col gap-1">
                <span className="flex justify-between"><span>Gastos:</span> <span className="text-amber-400/80 font-medium ml-4">{formatDOP(totalExpensesPending)}</span></span>
                <span className="flex justify-between"><span>Nómina:</span> <span className="text-amber-400/80 font-medium ml-4">{formatDOP(totalPayrollPending)}</span></span>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 flex-shrink-0">
              <Clock size={20} className="text-amber-400" />
            </div>
          </div>
        </Card>

        {/* Available Cash */}
        <Card className={`relative overflow-hidden hover:-translate-y-1 transition-transform duration-300 ${isNegative ? 'ring-1 ring-red-500/50 bg-red-950/20' : 'ring-1 ring-emerald-500/30'}`}>
          {isNegative && <div className="absolute inset-0 bg-red-500/5 pointer-events-none"></div>}
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center">
                Balance en Caja {isNegative && <AlertCircle size={14} className="ml-1.5 text-red-400" />}
              </p>
              <h3 className={`text-xl font-black ${isNegative ? 'text-red-400' : 'text-emerald-400'}`}>
                {formatDOP(netAvailableCash)}
              </h3>
            </div>
            <div className={`p-2 rounded-xl border flex-shrink-0 ${isNegative ? 'bg-red-400/10 border-red-500/20 text-red-400' : 'bg-emerald-400/10 border-emerald-500/20 text-emerald-400'}`}>
              <Wallet size={20} />
            </div>
          </div>
        </Card>
      </div>

      {/* Visual Summary */}
      <Card>
        <h3 className="text-lg font-semibold text-slate-100 mb-6 flex items-center">
          Distribución del Dinero (Flujo Actual)
        </h3>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between text-sm gap-4 md:gap-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-slate-300">Gastos Pagados: <strong className="text-slate-100">{formatDOP(totalExpensesPaid)}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-slate-300">Nómina Pagada: <strong className="text-slate-100">{formatDOP(totalPayrollPaid)}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-slate-300">Caja Libre: <strong className="text-slate-100">{formatDOP(visualAvailable)}</strong></span>
            </div>
          </div>
          
          <div className="h-6 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-700/50 flex">
            <div 
              className="h-full bg-orange-500 transition-all duration-1000 ease-out"
              style={{ width: `${percentExpenses}%` }}
              title="Gastos Fijos Pagados"
            ></div>
            <div 
              className="h-full bg-blue-500 transition-all duration-1000 ease-out"
              style={{ width: `${percentPayroll}%` }}
              title="Nómina Repartida"
            ></div>
            <div 
              className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
              style={{ width: `${percentAvailable}%` }}
              title="Dinero Libre"
            ></div>
          </div>

          {isNegative && (
             <div className="p-3 mt-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center">
               <AlertCircle size={16} className="mr-2 flex-shrink-0" />
               <strong>Atención:</strong> Los egresos superan las ventas del día. La caja presenta un saldo negativo y requiere inyección de capital.
             </div>
          )}
        </div>
      </Card>
    </div>
  );
};
