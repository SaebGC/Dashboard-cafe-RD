import { useState, useMemo } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useFinancial } from '../../../context/FinancialContext';
import { CashCountModal } from '../shared/CashCountModal';
import { Search, X, Coffee, PlusCircle, MinusCircle, Calculator, ShoppingBag, Receipt } from 'lucide-react';

export const EmpleadoPosView = () => {
  const { 
    salesItems, incrementSale, decrementSale, formatDOP 
  } = useFinancial();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);

  // Extract unique categories dynamically
  const categories: string[] = ['All', ...new Set(salesItems.map((item) => item.category))].filter(Boolean);

  const filteredItems = useMemo(() => {
    return salesItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [salesItems, searchQuery, activeCategory]);

  const activeOrderItems = useMemo(() => {
    return salesItems.filter((item) => item.unitsSold > 0);
  }, [salesItems]);

  const currentOrderTotal = useMemo(() => {
    return activeOrderItems.reduce((acc, item) => acc + (item.unitPrice || 0) * item.unitsSold, 0);
  }, [activeOrderItems]);

  const totalUnitsInOrder = activeOrderItems.reduce((acc, item) => acc + item.unitsSold, 0);

  return (
    <div className="p-8 animate-in fade-in duration-500 space-y-6">
      
      {/* Top Banner: Shift Info & Cash Count Action */}
      <Card className="bg-white border-[#EBE6DC] shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-[#E6F4EA] rounded-2xl text-[#1E653F]">
            <Receipt size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#0F281E]">Terminal de Comandas y Ventas</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F4EA] text-[#1E653F] border border-[#1E653F]/20 uppercase">
                Turno en Vivo
              </span>
            </div>
            <p className="text-xs text-[#6B7C72] mt-0.5">
              Registra artículos para los clientes. Precios fijados por gerencia.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button 
            variant="secondary" 
            onClick={() => setIsCashModalOpen(true)}
            className="w-full md:w-auto bg-[#F9F7F2] border-[#EBE6DC] text-[#0F281E] hover:bg-[#EBE6DC]/60 font-semibold"
          >
            <Calculator size={18} className="mr-2 text-[#C8963E]" />
            Arqueo / Cierre de Caja
          </Button>
        </div>
      </Card>

      {/* Main Grid: Catalog + Order Tray */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Catalog (2 cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search & Category Pills */}
          <div className="space-y-3">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7C72]" size={18} />
              <input
                type="text"
                placeholder="Buscar café, postre o bebida..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#EBE6DC] text-[#2C3E35] rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[#C8963E] focus:ring-1 focus:ring-[#C8963E] shadow-sm text-sm"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeCategory === cat 
                      ? 'bg-[#0F281E] text-[#C8963E] shadow-sm' 
                      : 'bg-white text-[#6B7C72] hover:bg-[#F9F7F2] hover:text-[#0F281E] border border-[#EBE6DC]'
                  }`}
                >
                  {cat}
                </button>
              ))}
              {(searchQuery || activeCategory !== 'All') && (
                <button 
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold text-[#6B7C72] hover:text-[#0F281E] flex items-center bg-white border border-[#EBE6DC]"
                >
                  <X size={12} className="mr-1" /> Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-[#EBE6DC] border-dashed">
                <Coffee size={40} className="mx-auto text-[#6B7C72]/50 mb-3" />
                <p className="text-[#6B7C72] font-medium text-sm">No hay productos en esta categoría.</p>
              </div>
            ) : (
              filteredItems.map((item) => {
                const isSelected = item.unitsSold > 0;
                return (
                  <Card 
                    key={item.id} 
                    className={`p-4 flex flex-col justify-between border transition-all shadow-sm ${
                      isSelected 
                        ? 'bg-white border-[#C8963E]/50 ring-1 ring-[#C8963E]/30' 
                        : 'bg-white border-[#EBE6DC] hover:border-[#C8963E]/30'
                    }`}
                  >
                    <div>
                      <span className="inline-block px-2 py-0.5 bg-[#FEF3D6] text-[#8F6010] text-[9px] font-bold uppercase tracking-wider rounded-md mb-2">
                        {item.category}
                      </span>
                      <h3 className="text-base font-bold text-[#0F281E]">{item.name}</h3>
                      <p className="text-sm font-black text-[#C8963E] mt-1">
                        {formatDOP(item.unitPrice)}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#EBE6DC] flex items-center justify-between">
                      <div className="flex items-center space-x-2 bg-[#F9F7F2] rounded-xl p-1 border border-[#EBE6DC] w-full justify-between">
                        <button 
                          onClick={() => decrementSale(item.id)}
                          disabled={item.unitsSold === 0}
                          className="p-2 text-[#6B7C72] hover:text-[#A83226] hover:bg-white rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Restar"
                        >
                          <MinusCircle size={20} />
                        </button>
                        
                        <span className="text-sm font-bold text-[#0F281E] px-2">
                          {item.unitsSold} <span className="text-[10px] font-normal text-[#6B7C72]">uds</span>
                        </span>

                        <button 
                          onClick={() => incrementSale(item.id)}
                          className="p-2 text-[#C8963E] hover:bg-white rounded-lg transition-colors"
                          title="Sumar"
                        >
                          <PlusCircle size={20} />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Live Comanda / Active Ticket Summary */}
        <div className="space-y-4">
          <Card className="bg-white border-[#EBE6DC] shadow-sm p-5 sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-[#EBE6DC]">
              <div className="flex items-center space-x-2">
                <ShoppingBag size={20} className="text-[#C8963E]" />
                <h3 className="font-bold text-[#0F281E] text-base">Comanda Activa</h3>
              </div>
              <span className="text-xs font-bold text-[#6B7C72] bg-[#F9F7F2] px-2.5 py-1 rounded-full border border-[#EBE6DC]">
                {totalUnitsInOrder} artículos
              </span>
            </div>

            {activeOrderItems.length === 0 ? (
              <div className="py-12 text-center">
                <Coffee size={36} className="mx-auto text-[#6B7C72]/40 mb-2" />
                <p className="text-xs text-[#6B7C72]">Usa los botones (+) en los productos para agregarlos al pedido.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#EBE6DC] my-4 max-h-72 overflow-y-auto pr-1">
                {activeOrderItems.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex-1 pr-2">
                      <p className="font-bold text-[#0F281E]">{item.name}</p>
                      <p className="text-[#6B7C72]">{item.unitsSold} x {formatDOP(item.unitPrice)}</p>
                    </div>
                    <span className="font-black text-[#0F281E]">
                      {formatDOP(item.unitPrice * item.unitsSold)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-[#EBE6DC] space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase font-bold text-[#6B7C72]">Total a Cobrar</span>
                <span className="text-2xl font-black text-[#C8963E]">
                  {formatDOP(currentOrderTotal)}
                </span>
              </div>
              
              <div className="bg-[#E6F4EA] rounded-xl p-3 border border-[#1E653F]/20 text-[11px] text-[#1E653F]">
                ✓ Registrado automáticamente en el flujo del turno.
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Cash Counting Modal */}
      <CashCountModal 
        isOpen={isCashModalOpen} 
        onClose={() => setIsCashModalOpen(false)}
        expectedAmount={currentOrderTotal}
      />
    </div>
  );
};
