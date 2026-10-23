import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { useFinancial } from '../../../context/FinancialContext';
import { Coffee, TrendingUp } from 'lucide-react';

export const AdminMenuView = () => {
  const { products, formatCurrency } = useFinancial();

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <Card className="overflow-hidden p-0 bg-white border-[#EBE6DC] shadow-sm">
        <div className="p-6 border-b border-[#EBE6DC] bg-white flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-[#0F281E] flex items-center">
              <Coffee className="mr-2 text-[#C8963E]" size={20} />
              Catálogo Oficial de Productos y Márgenes
            </h3>
            <p className="text-xs text-[#6B7C72] mt-1">
              Control de precios de venta, costos de insumos y rentabilidad estimada por unidad.
            </p>
          </div>
          <Badge variant="default" className="text-sm px-3 py-1 bg-[#F9F7F2] border border-[#EBE6DC] text-[#2C3E35]">
            {products.length} Items Activos
          </Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F9F7F2] text-[#6B7C72] uppercase text-xs border-b border-[#EBE6DC]">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Producto</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Categoría</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Precio Venta (RD$)</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Costo Insumo (RD$)</th>
                <th className="px-6 py-4 font-semibold text-right tracking-wider">Margen Ganancia (RD$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE6DC]">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-[#F9F7F2] transition-colors group">
                  <td className="px-6 py-4 font-semibold text-[#0F281E]">
                    {product.name}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="default" className="bg-[#FEF3D6] border border-[#8F6010]/20 text-[#8F6010]">
                      {product.category}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#0F281E]">
                    {formatCurrency(product.sellingPrice)}
                  </td>
                  <td className="px-6 py-4 font-medium text-[#A83226]">
                    {formatCurrency(product.ingredientCost)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center justify-end px-3 py-1 rounded-full bg-[#E6F4EA] text-[#1E653F] border border-[#1E653F]/20 font-bold transition-all shadow-sm">
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
