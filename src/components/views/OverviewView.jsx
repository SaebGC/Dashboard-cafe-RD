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
        <Card className="relative overflow-hidden border-[#C8963E]/40 hover:-translate-y-1 transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8963E]/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-[#C8963E]/10 transition-all duration-500"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-[#6B7C72] text-xs font-bold uppercase tracking-wider mb-2">Ingresos de Hoy</p>
              <h3 className="text-2xl font-black text-[#C8963E]">
                {formatDOP(todayTotalEarnings)}
              </h3>
            </div>
            <div className="p-2 rounded-xl bg-[#FEF3D6] text-[#8F6010]">
              <TrendingUp size={20} />
            </div>
          </div>
        </Card>

        {/* Paid Outflows */}
        <Card className="hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#6B7C72] text-xs font-bold uppercase tracking-wider mb-2">Egresos Pagados</p>
              <h3 className="text-xl font-bold text-[#0F281E]">
                {formatDOP(totalPaidOutflows)}
              </h3>
              <div className="mt-2 text-xs text-[#6B7C72] flex flex-col gap-1">
                <span className="flex justify-between"><span>Gastos:</span> <span className="text-[#A83226] font-semibold ml-4">{formatDOP(totalExpensesPaid)}</span></span>
                <span className="flex justify-between"><span>Nómina:</span> <span className="text-[#0F281E] font-semibold ml-4">{formatDOP(totalPayrollPaid)}</span></span>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-[#F3EFE8] text-[#2C3E35] flex-shrink-0">
              <Receipt size={20} />
            </div>
          </div>
        </Card>

        {/* Pending Outflows */}
        <Card className="hover:-translate-y-1 transition-transform duration-300 border-[#FEF3D6]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#6B7C72] text-xs font-bold uppercase tracking-wider mb-2">Egresos Pendientes</p>
              <h3 className="text-xl font-bold text-[#8F6010]">
                {formatDOP(totalPendingOutflows)}
              </h3>
              <div className="mt-2 text-xs text-[#8F6010]/80 flex flex-col gap-1">
                <span className="flex justify-between"><span>Gastos:</span> <span className="font-semibold ml-4">{formatDOP(totalExpensesPending)}</span></span>
                <span className="flex justify-between"><span>Nómina:</span> <span className="font-semibold ml-4">{formatDOP(totalPayrollPending)}</span></span>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-[#FEF3D6] text-[#8F6010] flex-shrink-0">
              <Clock size={20} />
            </div>
          </div>
        </Card>

        {/* Available Cash */}
        <Card className={`relative overflow-hidden hover:-translate-y-1 transition-transform duration-300 ${isNegative ? 'border-[#FDE8E6] bg-[#FDE8E6]/20' : 'border-[#EBE6DC]'}`}>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-[#6B7C72] text-xs font-bold uppercase tracking-wider mb-2 flex items-center">
                Balance en Caja {isNegative && <AlertCircle size={14} className="ml-1.5 text-[#A83226]" />}
              </p>
              <h3 className={`text-xl font-black ${isNegative ? 'text-[#A83226]' : 'text-[#1E653F]'}`}>
                {formatDOP(netAvailableCash)}
              </h3>
            </div>
            <div className={`p-2 rounded-xl flex-shrink-0 ${isNegative ? 'bg-[#FDE8E6] text-[#A83226]' : 'bg-[#E6F4EA] text-[#1E653F]'}`}>
              <Wallet size={20} />
            </div>
          </div>
        </Card>
      </div>

      {/* Visual Summary */}
      <Card>
        <h3 className="text-lg font-bold text-[#0F281E] mb-6 flex items-center">
          Distribución del Dinero (Flujo Actual)
        </h3>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between text-sm gap-4 md:gap-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#A83226]"></div>
              <span className="text-[#6B7C72]">Gastos Pagados: <strong className="text-[#0F281E]">{formatDOP(totalExpensesPaid)}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#0F281E]"></div>
              <span className="text-[#6B7C72]">Nómina Pagada: <strong className="text-[#0F281E]">{formatDOP(totalPayrollPaid)}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#C8963E]"></div>
              <span className="text-[#6B7C72]">Caja Libre: <strong className="text-[#0F281E]">{formatDOP(visualAvailable)}</strong></span>
            </div>
          </div>
          
          <div className="h-6 w-full bg-[#F3EFE8] rounded-full overflow-hidden border border-[#EBE6DC] flex">
            <div 
              className="h-full bg-[#A83226] transition-all duration-1000 ease-out"
              style={{ width: `${percentExpenses}%` }}
              title="Gastos Fijos Pagados"
            ></div>
            <div 
              className="h-full bg-[#0F281E] transition-all duration-1000 ease-out"
              style={{ width: `${percentPayroll}%` }}
              title="Nómina Repartida"
            ></div>
            <div 
              className="h-full bg-[#C8963E] transition-all duration-1000 ease-out"
              style={{ width: `${percentAvailable}%` }}
              title="Dinero Libre"
            ></div>
          </div>

          {isNegative && (
             <div className="p-3 mt-4 rounded-lg bg-[#FDE8E6] border border-[#A83226]/30 text-[#A83226] text-sm flex items-center">
               <AlertCircle size={16} className="mr-2 flex-shrink-0" />
               <strong>Atención:</strong> Los egresos superan las ventas del día. La caja presenta un saldo negativo y requiere inyección de capital.
             </div>
          )}
        </div>
      </Card>
    </div>
  );
};
