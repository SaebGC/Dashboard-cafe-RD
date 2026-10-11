import React from 'react';
import { Card } from '../ui/Card';
import { useFinancial } from '../../context/FinancialContext';
import { Calendar, CreditCard } from 'lucide-react';

export const ServicesView = () => {
  const { services, toggleServiceStatus, formatCurrency } = useFinancial();

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <Card className="overflow-hidden p-0 bg-white border-[#EBE6DC] shadow-sm">
        <div className="p-6 border-b border-[#EBE6DC] bg-white">
          <h3 className="text-lg font-bold text-[#0F281E] flex items-center">
            <CreditCard className="mr-2 text-[#C8963E]" size={20} />
            Control de Gastos Fijos
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F9F7F2] text-[#6B7C72] uppercase text-xs border-b border-[#EBE6DC]">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Servicio</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Monto Adeudado (RD$)</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Fecha de Vencimiento</th>
                <th className="px-6 py-4 font-semibold text-right tracking-wider">Estado de Pago</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE6DC]">
              {services.map((service) => {
                const isPaid = service.status === 'Paid';
                
                return (
                  <tr key={service.id} className={`transition-colors ${isPaid ? 'bg-[#E6F4EA]/20' : 'hover:bg-[#F9F7F2]'}`}>
                    <td className="px-6 py-4 font-semibold text-[#0F281E]">
                      {service.name}
                    </td>
                    <td className="px-6 py-4 font-bold text-[#A83226]">
                      {formatCurrency(service.amount)}
                    </td>
                    <td className="px-6 py-4 text-[#6B7C72]">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2 text-[#6B7C72]" />
                        {new Date(service.dueDate).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 flex justify-end">
                      <select
                        value={service.status}
                        onChange={(e) => toggleServiceStatus(service.id, e.target.value)}
                        className={`text-xs font-bold rounded-full block px-4 py-1.5 border transition-colors outline-none cursor-pointer ${
                          isPaid 
                            ? 'bg-[#E6F4EA] text-[#1E653F] border-[#1E653F]/20' 
                            : 'bg-[#FEF3D6] text-[#8F6010] border-[#8F6010]/20'
                        }`}
                      >
                        <option value="Pending" className="bg-white text-[#8F6010]">Por pagar (Pending)</option>
                        <option value="Paid" className="bg-white text-[#1E653F]">Pagado (Paid)</option>
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
