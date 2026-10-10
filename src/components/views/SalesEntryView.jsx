import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ConfirmModal } from '../ui/ConfirmModal';
import { useFinancial } from '../../context/FinancialContext';
import { Plus, Trash2, Search, X, Coffee, PlusCircle, MinusCircle, RotateCcw } from 'lucide-react';

export const SalesEntryView = () => {
  const { 
    salesItems, addSalesItem, deleteSalesItem, 
    incrementSale, decrementSale, updateUnitPrice, 
    resetDaySales, todayTotalEarnings, formatDOP 
  } = useFinancial();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Modals state
  const [confirmModalConfig, setConfirmModalConfig] = useState({ isOpen: false });

  // Add item form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newUnitPrice, setNewUnitPrice] = useState('');

  // Extract unique categories dynamically
  const categories = ['All', ...new Set(salesItems.map(item => item.category))].filter(Boolean);

  const filteredItems = useMemo(() => {
    return salesItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [salesItems, searchQuery, activeCategory]);

  const totalUnitsSold = salesItems.reduce((acc, item) => acc + (item.unitsSold || 0), 0);

  const handleAddItem = (e) => {
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

  const openDeleteModal = (item) => {
    setConfirmModalConfig({
      isOpen: true,
      title: "Eliminar Producto",
      message: `¿Estás seguro de que deseas eliminar "${item.name}" del catálogo de hoy?`,
      confirmText: "Eliminar",
      onConfirm: () => deleteSalesItem(item.id),
      isDestructive: true
    });
  };

  const openResetModal = () => {
    setConfirmModalConfig({
      isOpen: true,
      title: "Reiniciar Día",
      message: "¿Estás seguro de que deseas reiniciar todas las ventas del día a 0? Esta acción no se puede deshacer.",
      confirmText: "Reiniciar",
      onConfirm: resetDaySales,
      isDestructive: true
    });
  };

  return (
    <div className="p-8 animate-in fade-in duration-500 space-y-6">
      
      {/* Summary Header */}
      <Card className="bg-slate-800/80 backdrop-blur-md border-slate-700 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-8">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Catálogo Activo</p>
            <p className="text-xl font-bold text-slate-100">{salesItems.length} items</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Unidades Vendidas (Hoy)</p>
            <p className="text-xl font-bold text-slate-100">{totalUnitsSold}</p>
          </div>
          <div>
            <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">Total Ingresos (Hoy)</p>
            <p className="text-3xl font-black text-cyan-400">{formatDOP(todayTotalEarnings)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {totalUnitsSold > 0 && (
            <Button 
              variant="danger" 
              onClick={openResetModal}
              className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
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
        <Card className="border-emerald-500/30 bg-slate-800/90 shadow-emerald-900/10 animate-in slide-in-from-top-4">
          <form onSubmit={handleAddItem} className="flex flex-col md:flex-row items-end gap-4">
            <div className="flex-1 w-full space-y-1">
              <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Nombre del Producto</label>
              <input 
                type="text" 
                placeholder="Ej. Latte Machiato" 
                value={newItemName} 
                onChange={(e) => setNewItemName(e.target.value)} 
                required 
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500"
              />
            </div>
            <div className="w-full md:w-1/4 space-y-1">
              <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Categoría</label>
              <input 
                type="text" 
                placeholder="Ej. Café Caliente" 
                value={newCategory} 
                onChange={(e) => setNewCategory(e.target.value)} 
                required 
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500"
              />
            </div>
            <div className="w-full md:w-1/4 space-y-1">
              <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Precio Unitario</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">RD$</span>
                <input 
                  type="number" 
                  placeholder="0" 
                  value={newUnitPrice} 
                  onChange={(e) => setNewUnitPrice(e.target.value)} 
                  required 
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg pl-10 pr-3 py-2.5 outline-none focus:border-emerald-500"
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 shadow-sm"
          />
        </div>
        
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat 
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-900/40' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
          {(searchQuery || activeCategory !== 'All') && (
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="px-4 py-1.5 rounded-full text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors flex items-center"
            >
              <X size={14} className="mr-1" /> Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* POS Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-slate-800/50 rounded-2xl border border-slate-700/50 border-dashed">
            <Coffee size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400 font-medium text-lg">No se encontraron productos.</p>
          </div>
        ) : (
          filteredItems.map(item => {
            const subtotal = (item.unitPrice || 0) * (item.unitsSold || 0);
            return (
              <Card key={item.id} className="p-5 flex flex-col justify-between border-slate-700 hover:border-slate-600 transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="inline-block px-2 py-1 bg-slate-700/50 text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded-md mb-2">
                        {item.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-100 leading-tight">{item.name}</h3>
                    </div>
                    <button 
                      onClick={() => openDeleteModal(item)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded-md hover:bg-slate-700 transition-colors"
                      title="Eliminar producto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <label className="text-xs text-slate-400 font-semibold mb-1 block">Precio C/U</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">RD$</span>
                      <input 
                        type="number"
                        value={item.unitPrice || ''}
                        onChange={(e) => updateUnitPrice(item.id, e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 text-sm font-bold rounded-lg pl-10 pr-3 py-2 outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-slate-400 uppercase font-bold">Total Generado</p>
                    <p className="text-lg font-black text-emerald-400">{formatDOP(subtotal)}</p>
                  </div>
                  
                  {/* Stepper */}
                  <div className="flex items-center justify-between bg-slate-900 rounded-xl p-1 border border-slate-700">
                    <button 
                      onClick={() => decrementSale(item.id)}
                      disabled={item.unitsSold === 0}
                      className="p-3 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                    >
                      <MinusCircle size={24} />
                    </button>
                    
                    <div className="flex-1 text-center font-bold text-slate-100">
                      {item.unitsSold} <span className="text-xs font-normal text-slate-400 ml-1">vendidas</span>
                    </div>

                    <button 
                      onClick={() => incrementSale(item.id)}
                      className="p-3 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors"
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
        onClose={() => setConfirmModalConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
