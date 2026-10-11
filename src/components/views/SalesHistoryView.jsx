import React from 'react';
import { Card } from '../ui/Card';
import { useFinancial } from '../../context/FinancialContext';
import { History, ShoppingBag } from 'lucide-react';

export const SalesHistoryView = () => {
  const { salesHistory, formatCurrency } = useFinancial();

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <Card className="overflow-hidden p-0 bg-white border-[#EBE6DC] shadow-sm">
        <div className="p-6 border-b border-[#EBE6DC] bg-white">
          <h3 className="text-lg font-bold text-[#0F281E] flex items-center">
            <History className="mr-2 text-[#C8963E]" size={20} />
            Registro de Ventas de Hoy
          </h3>
          <p className="text-sm text-[#6B7C72] mt-1">
            Auditoría de las transacciones que componen el Ingreso Bruto de Hoy.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F9F7F2] text-[#6B7C72] uppercase text-xs border-b border-[#EBE6DC]">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Hora</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Order ID</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Artículos Vendidos</th>
                <th className="px-6 py-4 font-semibold text-right tracking-wider">Monto Total (RD$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE6DC]">
              {salesHistory.map((record) => (
                <tr key={record.id} className="hover:bg-[#F9F7F2] transition-colors">
                  <td className="px-6 py-4 font-medium text-[#2C3E35] whitespace-nowrap">
                    {record.time}
                  </td>
                  <td className="px-6 py-4 text-[#6B7C72] font-mono text-xs">
                    #{record.id.toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <ShoppingBag size={16} className="mr-2 mt-0.5 text-[#6B7C72] flex-shrink-0" />
                      <span className="text-[#2C3E35]">{record.itemsSold}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-[#C8963E]">
                    {formatCurrency(record.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
