import React from 'react';
import { Card } from '../ui/Card';
import { useFinancial } from '../../context/FinancialContext';
import { History, ShoppingBag } from 'lucide-react';

export const SalesHistoryView = () => {
  const { salesHistory, formatCurrency } = useFinancial();

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <Card className="overflow-hidden p-0">
        <div className="p-6 border-b border-slate-700/50 bg-slate-800/50">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center">
            <History className="mr-2 text-cyan-400" size={20} />
            Registro de Ventas de Hoy
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Auditoría de las transacciones que componen el Ingreso Bruto de Hoy.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider">Hora</th>
                <th className="px-6 py-4 font-medium tracking-wider">Order ID</th>
                <th className="px-6 py-4 font-medium tracking-wider">Artículos Vendidos</th>
                <th className="px-6 py-4 font-medium text-right tracking-wider">Monto Total (RD$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {salesHistory.map((record) => (
                <tr key={record.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-300 whitespace-nowrap">
                    {record.time}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                    #{record.id.toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <ShoppingBag size={16} className="mr-2 mt-0.5 text-slate-500 flex-shrink-0" />
                      <span className="text-slate-200">{record.itemsSold}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-cyan-400">
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
