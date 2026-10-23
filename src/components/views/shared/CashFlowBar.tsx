import { Card } from '../../ui/Card';
import { formatDOP } from '../../../lib/utils';
import { AlertCircle } from 'lucide-react';

export interface CashFlowBarProps {
  totalEarnings: number;
  expensesPaid: number;
  payrollPaid: number;
  netCash: number;
  title?: string;
}

export const CashFlowBar = ({
  totalEarnings,
  expensesPaid,
  payrollPaid,
  netCash,
  title = 'Distribución del Dinero (Flujo Actual)',
}: CashFlowBarProps) => {
  const totalPaidOutflows = expensesPaid + payrollPaid;
  const maxBarValue = Math.max(totalEarnings, totalPaidOutflows, 1);

  const percentExpenses = (expensesPaid / maxBarValue) * 100;
  const percentPayroll = (payrollPaid / maxBarValue) * 100;
  const visualAvailable = Math.max(0, netCash);
  const percentAvailable = (visualAvailable / maxBarValue) * 100;

  const isNegative = netCash < 0;

  return (
    <Card className="bg-white border-[#EBE6DC] shadow-sm">
      <h3 className="text-lg font-bold text-[#0F281E] mb-6 flex items-center">
        {title}
      </h3>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between text-sm gap-4 md:gap-0">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#A83226]"></div>
            <span className="text-[#6B7C72]">Gastos Pagados: <strong className="text-[#0F281E]">{formatDOP(expensesPaid)}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#0F281E]"></div>
            <span className="text-[#6B7C72]">Nómina Pagada: <strong className="text-[#0F281E]">{formatDOP(payrollPaid)}</strong></span>
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
            <strong>Atención:</strong> Los egresos superan los ingresos del turno. Se requiere inyección o ajuste de caja.
          </div>
        )}
      </div>
    </Card>
  );
};
