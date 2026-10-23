import { useFinancial } from '../../../context/FinancialContext';
import { KpiCard } from '../shared/KpiCard';
import { CashFlowBar } from '../shared/CashFlowBar';
import { Card } from '../../ui/Card';
import { TrendingUp, Wallet, Receipt, Clock, Sparkles, ArrowUpRight, ShieldAlert } from 'lucide-react';

export const JefeDashboardView = () => {
  const { 
    todayTotalEarnings, 
    totalExpensesPaid,
    totalExpensesPending,
    totalPayrollPaid,
    totalPayrollPending,
    netAvailableCash,
    formatDOP,
    salesItems,
    employees,
  } = useFinancial();

  const totalPaidOutflows = totalExpensesPaid + totalPayrollPaid;
  const totalPendingOutflows = totalExpensesPending + totalPayrollPending;
  const isNegative = netAvailableCash < 0;

  // Derive estimated operating margin
  const operatingMarginPercent = todayTotalEarnings > 0 
    ? Math.round(((todayTotalEarnings - totalPaidOutflows) / todayTotalEarnings) * 100)
    : 0;

  // Find top sold products
  const topProducts = [...salesItems]
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 4);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Executive Welcome & AI Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0F281E] to-[#183D2F] p-6 rounded-2xl text-white shadow-lg border border-[#1B3D2F]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C8963E]/20 text-[#C8963E] border border-[#C8963E]/40 uppercase tracking-wider">
              Panel Gerencial
            </span>
            <span className="text-xs text-[#D8D1C2]/70">Auditoría Ejecutiva en Tiempo Real</span>
          </div>
          <h2 className="text-2xl font-black text-white">Estado Financiero y Rentabilidad</h2>
          <p className="text-xs text-[#D8D1C2]/80">
            Resumen consolidado de ingresos brutos, márgenes operativos y compromisos pendientes.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-[#091812]/80 p-3 rounded-xl border border-[#C8963E]/30">
          <Sparkles size={24} className="text-[#C8963E] animate-pulse flex-shrink-0" />
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-[#D8D1C2]/60">Margen Operativo Estimado</p>
            <p className="text-xl font-black text-[#C8963E]">{operatingMarginPercent}%</p>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          label="Ingresos Brutos (Hoy)"
          value={formatDOP(todayTotalEarnings)}
          icon={TrendingUp}
          variant="gold"
          subtext="Ventas acumuladas en el turno"
        />

        <KpiCard
          label="Egresos Pagados"
          value={formatDOP(totalPaidOutflows)}
          icon={Receipt}
          variant="neutral"
          subtext={
            <div className="flex justify-between pt-1 text-[11px]">
              <span>Gastos: {formatDOP(totalExpensesPaid)}</span>
              <span>Nómina: {formatDOP(totalPayrollPaid)}</span>
            </div>
          }
        />

        <KpiCard
          label="Compromisos Pendientes"
          value={formatDOP(totalPendingOutflows)}
          icon={Clock}
          variant="amber"
          subtext={
            <div className="flex justify-between pt-1 text-[11px] text-[#8F6010]">
              <span>Facturas: {formatDOP(totalExpensesPending)}</span>
              <span>Deuda Salarial: {formatDOP(totalPayrollPending)}</span>
            </div>
          }
        />

        <KpiCard
          label="Liquidez en Caja"
          value={formatDOP(netAvailableCash)}
          icon={Wallet}
          variant={isNegative ? 'danger' : 'emerald'}
          subtext={isNegative ? 'Alerta: Saldo en déficit' : 'Fondo neto libre disponible'}
        />
      </div>

      {/* Visual Cash Flow Distribution */}
      <CashFlowBar
        totalEarnings={todayTotalEarnings}
        expensesPaid={totalExpensesPaid}
        payrollPaid={totalPayrollPaid}
        netCash={netAvailableCash}
        title="Distribución Ejecutiva del Flujo de Efectivo"
      />

      {/* Two Columns: AI Financial Insights & Top Selling Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* AI Financial Insights */}
        <Card className="bg-white border-[#EBE6DC] shadow-sm p-6 space-y-4">
          <div className="flex items-center space-x-2 text-[#0F281E] border-b border-[#EBE6DC] pb-4">
            <Sparkles size={20} className="text-[#C8963E]" />
            <h3 className="font-bold text-lg">Diagnóstico de Negocio & Recomendaciones</h3>
          </div>

          <div className="space-y-3 text-xs leading-relaxed">
            <div className="p-3.5 rounded-xl bg-[#FEF3D6]/50 border border-[#FEF3D6] text-[#8F6010]">
              <div className="flex items-start gap-2">
                <ArrowUpRight size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="block font-bold">Rendimiento de Ventas:</strong>
                  {todayTotalEarnings > 5000 
                    ? `El ritmo de facturación actual (${formatDOP(todayTotalEarnings)}) cubre los costes directos del día y proyecta un rendimiento saludable.`
                    : `Facturación en fase inicial del día (${formatDOP(todayTotalEarnings)}). Monitorear turnos de tarde.`}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F9F7F2] border border-[#EBE6DC] text-[#2C3E35]">
              <div className="flex items-start gap-2">
                <Clock size={16} className="mt-0.5 text-[#C8963E] flex-shrink-0" />
                <div>
                  <strong className="block font-bold text-[#0F281E]">Compromiso de Nómina y Deuda:</strong>
                  Tienes {employees.length} colaboradores activos con un saldo adeudado consolidado de <strong>{formatDOP(totalPayrollPending)}</strong>.
                </div>
              </div>
            </div>

            {isNegative && (
              <div className="p-3.5 rounded-xl bg-[#FDE8E6] border border-[#A83226]/30 text-[#A83226]">
                <div className="flex items-start gap-2">
                  <ShieldAlert size={16} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="block font-bold">Aviso de Sobregiro Operativo:</strong>
                    Los pagos salientes superan los cobros del turno. Se recomienda postergar pagos no urgentes hasta el cierre del próximo ciclo.
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Top Products Performance */}
        <Card className="bg-white border-[#EBE6DC] shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EBE6DC] pb-4">
            <h3 className="font-bold text-lg text-[#0F281E]">Productos Más Vendidos (Hoy)</h3>
            <span className="text-xs text-[#6B7C72]">Ranking en tiempo real</span>
          </div>

          <div className="divide-y divide-[#EBE6DC]">
            {topProducts.length === 0 || topProducts.every((p) => p.unitsSold === 0) ? (
              <div className="py-12 text-center text-xs text-[#6B7C72]">
                Aún no se registran unidades vendidas en la jornada actual.
              </div>
            ) : (
              topProducts.map((p) => {
                const subtotal = (p.unitPrice || 0) * p.unitsSold;
                return (
                  <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#0F281E]">{p.name}</p>
                      <span className="text-[10px] text-[#6B7C72]">{p.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#C8963E]">{formatDOP(subtotal)}</p>
                      <span className="text-[10px] text-[#6B7C72] font-semibold">{p.unitsSold} vendidas</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
