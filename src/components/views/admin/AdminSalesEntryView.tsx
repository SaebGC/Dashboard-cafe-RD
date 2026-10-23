import { useState, useMemo, type FormEvent } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { ConfirmModal } from '../../ui/ConfirmModal';
import { useFinancial } from '../../../context/FinancialContext';
import { Plus, Trash2, Search, X, Coffee, PlusCircle, MinusCircle, RotateCcw } from 'lucide-react';
import type { SalesItem, ConfirmModalConfig } from '../../../types';

export const AdminSalesEntryView = () => {
  const { 
    salesItems, addSalesItem, deleteSalesItem, 
    incrementSale, decrementSale, updateUnitPrice, 
    resetDaySales, todayTotalEarnings, formatDOP 
  } = useFinancial();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [confirmModalConfig, setConfirmModalConfig] = useState<ConfirmModalConfig>({ isOpen: false });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newUnitPrice, setNewUnitPrice] = useState('');

  const categories: string[] = ['All', ...new Set(salesItems.map((item) => item.category))].filter(Boolean);

  const filteredItems = useMemo(() => {
    return salesItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [salesItems, searchQuery, activeCategory]);

  const totalUnitsSold = salesItems.reduce((acc, item) => acc + (item.unitsSold || 0), 0);

  const handleAddItem = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newItemName || !newCategory || !newUnitPrice) return;
    
    addSalesItem({
      name: newItemName,
      category: newCategory,
      unitPrice: Number(newUnitPrice)
    });

    setNewItemName('');
    setNewCategory('');
    setNewUnitPrice('');
    setShowAddForm(false);
  };

  const openDeleteModal = (item: SalesItem) => {
    setConfirmModalConfig({
      isOpen: true,
      title: "Eliminar Producto del Catálogo",
      message: `¿Estás seguro de que deseas eliminar "${item.name}" del catálogo? Esta acción no se puede deshacer.`,
      confirmText: "Eliminar",
      onConfirm: () => deleteSalesItem(item.id),
      isDestructive: true
    });
  };

  const openResetModal = () => {
    setConfirmModalConfig({
      isOpen: true,
      title: "Reiniciar Ventas del Día",
      message: "¿Estás seguro de que deseas reiniciar todas las ventas del día a 0? Esta acción no se puede deshacer.",
      confirmText: "Reiniciar",
      onConfirm: resetDaySales,
      isDestructive: true
    });
  };

  return (
    <div className="p-8 animate-in fade-in duration-500 space-y-6">
      
      {/* Summary Header */}
      <Card className="bg-white border-[#EBE6DC] shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-8">
          <div>
            <p className="text-xs text-[#6B7C72] font-bold uppercase tracking-wider mb-1">Catálogo Activo</p>
            <p className="text-xl font-bold text-[#0F281E]">{salesItems.length} items</p>
          </div>
          <div>
            <p className="text-xs text-[#6B7C72] font-bold uppercase tracking-wider mb-1">Unidades Vendidas (Hoy)</p>
            <p className="text-xl font-bold text-[#0F281E]">{totalUnitsSold}</p>
          </div>
          <div>
            <p className="text-xs text-[#6B7C72] font-bold uppercase tracking-wider mb-1">Total Ingresos (Hoy)</p>
            <p className="text-3xl font-black text-[#C8963E]">{formatDOP(todayTotalEarnings)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {totalUnitsSold > 0 && (
            <Button 
              variant="danger" 
              onClick={openResetModal}
              className="bg-[#FDE8E6] text-[#A83226] hover:bg-[#FDE8E6]/80 border border-[#A83226]/30 shadow-none font-medium"
            >
              <RotateCcw size={18} className="mr-2" /> Reiniciar Día
            </Button>
          )}
          <Button onClick={() => setShowAddForm(!showAddForm)} className="w-full md:w-auto">
            {showAddForm ? <X size={18} className="mr-2" /> : <Plus size={18} className="mr-2" />}
            {showAddForm ? 'Cancelar' : 'Agregar Producto'}
          </Button>
        </div>
      </Card>

      {/* Add Item Form */}
      {showAddForm && (
        <Card className="border-[#EBE6DC] bg-white shadow-sm animate-in slide-in-from-top-4">
          <form onSubmit={handleAddItem} className="flex flex-col md:flex-row items-end gap-4">
            <div className="flex-1 w-full space-y-1">
              <label className="text-xs text-[#6B7C72] uppercase font-bold tracking-wider">Nombre del Producto</label>
              <input 
                type="text" 
                placeholder="Ej. Latte Vainilla" 
                value={newItemName} 
                onChange={(e) => setNewItemName(e.target.value)} 
                required 
                className="w-full bg-white border border-[#EBE6DC] text-[#2C3E35] rounded-lg px-3 py-2.5 outline-none focus:border-[#C8963E] shadow-sm"
              />
            </div>
            <div className="w-full md:w-1/4 space-y-1">
              <label className="text-xs text-[#6B7C72] uppercase font-bold tracking-wider">Categoría</label>
              <input 
                type="text" 
                placeholder="Ej. Bebidas Calientes" 
                value={newCategory} 
                onChange={(e) => setNewCategory(e.target.value)} 
                required 
                className="w-full bg-white border border-[#EBE6DC] text-[#2C3E35] rounded-lg px-3 py-2.5 outline-none focus:border-[#C8963E] shadow-sm"
              />
            </div>
            <div className="w-full md:w-1/4 space-y-1">
              <label className="text-xs text-[#6B7C72] uppercase font-bold tracking-wider">Precio Unitario</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7C72]">RD$</span>
                <input 
                  type="number" 
                  placeholder="0" 
                  value={newUnitPrice} 
                  onChange={(e) => setNewUnitPrice(e.target.value)} 
                  required 
                  className="w-full bg-white border border-[#EBE6DC] text-[#2C3E35] rounded-lg pl-10 pr-3 py-2.5 outline-none focus:border-[#C8963E] shadow-sm"
                />
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto h-[46px] mb-px">
              Guardar
            </Button>
          </form>
        </Card>
      )}

      {/* Toolbar: Search & Categories */}
      <div className="space-y-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7C72]" size={18} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#EBE6DC] text-[#2C3E35] rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#C8963E] focus:ring-1 focus:ring-[#C8963E] shadow-sm placeholder:text-[#6B7C72]/60"
          />
        </div>
        
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat 
                  ? 'bg-[#C8963E] text-white shadow-sm' 
                  : 'bg-white text-[#6B7C72] hover:bg-[#F9F7F2] hover:text-[#0F281E] border border-[#EBE6DC]'
              }`}
            >
              {cat}
            </button>
          ))}
          {(searchQuery || activeCategory !== 'All') && (
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="px-4 py-1.5 rounded-full text-sm font-semibold text-[#6B7C72] hover:text-[#0F281E] transition-colors flex items-center"
            >
              <X size={14} className="mr-1" /> Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* POS Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-[#EBE6DC] border-dashed">
            <Coffee size={48} className="mx-auto text-[#6B7C72]/60 mb-4" />
            <p className="text-[#6B7C72] font-medium text-lg">No se encontraron productos.</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const subtotal = (item.unitPrice || 0) * (item.unitsSold || 0);
            return (
              <Card key={item.id} className="p-5 flex flex-col justify-between border-[#EBE6DC] hover:border-[#C8963E]/40 transition-colors shadow-sm bg-white">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="inline-block px-2.5 py-1 bg-[#FEF3D6] text-[#8F6010] text-[10px] font-bold uppercase tracking-wider rounded-md mb-2">
                        {item.category}
                      </span>
                      <h3 className="text-lg font-bold text-[#0F281E] leading-tight">{item.name}</h3>
                    </div>
                    <button 
                      onClick={() => openDeleteModal(item)}
                      className="text-[#6B7C72] hover:text-[#A83226] p-1.5 rounded-md hover:bg-[#FDE8E6] transition-colors"
                      title="Eliminar producto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <label className="text-xs text-[#6B7C72] font-semibold mb-1 block">Precio Unitario Editable</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7C72] font-bold">RD$</span>
                      <input 
                        type="number"
                        value={item.unitPrice || ''}
                        onChange={(e) => updateUnitPrice(item.id, e.target.value)}
                        className="w-full bg-[#F9F7F2] border border-[#EBE6DC] text-[#2C3E35] text-sm font-bold rounded-lg pl-10 pr-3 py-2 outline-none focus:border-[#C8963E] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EBE6DC]">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-[#6B7C72] uppercase font-bold">Total Generado</p>
                    <p className="text-lg font-black text-[#C8963E]">{formatDOP(subtotal)}</p>
                  </div>
                  
                  {/* Stepper */}
                  <div className="flex items-center justify-between bg-[#F9F7F2] rounded-xl p-1 border border-[#EBE6DC]">
                    <button 
                      onClick={() => decrementSale(item.id)}
                      disabled={item.unitsSold === 0}
                      className="p-3 text-[#6B7C72] hover:text-[#A83226] hover:bg-white rounded-lg transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#6B7C72]"
                    >
                      <MinusCircle size={24} />
                    </button>
                    
                    <div className="flex-1 text-center font-bold text-[#0F281E]">
                      {item.unitsSold} <span className="text-xs font-normal text-[#6B7C72] ml-1">vendidas</span>
                    </div>

                    <button 
                      onClick={() => incrementSale(item.id)}
                      className="p-3 text-[#C8963E] hover:bg-white rounded-lg transition-colors"
                    >
                      <PlusCircle size={24} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <ConfirmModal 
        {...confirmModalConfig}
        onClose={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
