import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useFinancial } from '../../context/FinancialContext';
import { Coffee, TrendingUp } from 'lucide-react';

export const MenuView = () => {
  const { products, formatCurrency } = useFinancial();

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <Card className="overflow-hidden p-0">
        <div className="p-6 border-b border-slate-700/50 bg-slate-800/50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center">
            <Coffee className="mr-2 text-amber-400" size={20} />
            Catálogo de Productos
          </h3>
          <Badge variant="default" className="text-sm px-3 py-1 bg-slate-900 border border-slate-700 text-slate-300 shadow-inner">
            {products.length} Items Activos
          </Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider">Producto</th>
                <th className="px-6 py-4 font-medium tracking-wider">Categoría</th>
                <th className="px-6 py-4 font-medium tracking-wider">Precio Venta (RD$)</th>
                <th className="px-6 py-4 font-medium tracking-wider">Costo Insumo (RD$)</th>
                <th className="px-6 py-4 font-medium text-right tracking-wider">Margen Ganancia (RD$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-200">
                    {product.name}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="default" className="bg-slate-900 border border-slate-700/50">
                      {product.category}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-medium text-emerald-400">
                    {formatCurrency(product.sellingPrice)}
                  </td>
                  <td className="px-6 py-4 font-medium text-orange-400">
                    {formatCurrency(product.ingredientCost)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center justify-end px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-all shadow-sm">
                      <TrendingUp size={14} className="mr-1.5" />
                      {formatCurrency(product.margin)}
                    </div>
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
