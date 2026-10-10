import React from 'react';
import { Card } from '../ui/Card';
import { useFinancial } from '../../context/FinancialContext';
import { Calendar, CreditCard } from 'lucide-react';

export const ServicesView = () => {
  const { services, toggleServiceStatus, formatCurrency } = useFinancial();

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <Card className="overflow-hidden p-0">
        <div className="p-6 border-b border-slate-700/50 bg-slate-800/50">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center">
            <CreditCard className="mr-2 text-emerald-400" size={20} />
            Control de Gastos Fijos
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider">Servicio</th>
                <th className="px-6 py-4 font-medium tracking-wider">Monto Adeudado (RD$)</th>
                <th className="px-6 py-4 font-medium tracking-wider">Fecha de Vencimiento</th>
                <th className="px-6 py-4 font-medium text-right tracking-wider">Estado de Pago</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {services.map((service) => {
                const isPaid = service.status === 'Paid';
                
                return (
                  <tr key={service.id} className={`transition-colors ${isPaid ? 'bg-slate-800/20' : 'hover:bg-slate-800/50'}`}>
                    <td className="px-6 py-4 font-medium text-slate-200">
                      {service.name}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-400">
                      {formatCurrency(service.amount)}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2 text-slate-500" />
                        {new Date(service.dueDate).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 flex justify-end">
                      <select
                        value={service.status}
                        onChange={(e) => toggleServiceStatus(service.id, e.target.value)}
                        className={`text-sm rounded-lg block p-2 border transition-colors outline-none cursor-pointer ${
                          isPaid 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                            : 'bg-slate-900 text-amber-400 border-slate-700 focus:border-amber-500 focus:ring-amber-500'
                        }`}
                      >
                        <option value="Pending">Por pagar (Pending)</option>
                        <option value="Paid">Pagado (Paid)</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
