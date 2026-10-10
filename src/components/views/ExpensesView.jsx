import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ConfirmModal } from '../ui/ConfirmModal';
import { useFinancial } from '../../context/FinancialContext';
import { Plus, Trash2, Edit2, Check, X, CreditCard } from 'lucide-react';

export const ExpensesView = () => {
  const { expenses, addExpense, updateExpense, deleteExpense, toggleExpenseStatus, formatDOP } = useFinancial();
  
  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  
  const [confirmModalConfig, setConfirmModalConfig] = useState({ isOpen: false });

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expenseName || !amount) return;
    
    addExpense({
      expenseName,
      amount: Number(amount)
    });
    
    setExpenseName('');
    setAmount('');
  };

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditName(expense.expenseName);
    setEditAmount(expense.amount);
  };

  const saveEdit = (id) => {
    updateExpense(id, { expenseName: editName, amount: Number(editAmount) });
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const openDeleteModal = (expense) => {
    setConfirmModalConfig({
      isOpen: true,
      title: "Eliminar Gasto",
      message: `¿Estás seguro de que deseas eliminar el gasto "${expense.expenseName}"? Esta acción recalculará los balances si ya estaba pagado.`,
      confirmText: "Eliminar",
      onConfirm: () => deleteExpense(expense.id),
      isDestructive: true
    });
  };

  return (
    <div className="p-8 animate-in fade-in duration-500 space-y-6">
      
      <Card className="bg-slate-800/80 backdrop-blur-md border-slate-700">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center">
            <CreditCard size={20} className="mr-2 text-orange-400" />
            Registrar Nuevo Gasto Fijo
          </h3>
        </div>
        
        <form onSubmit={handleAddExpense} className="flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1 w-full space-y-1">
            <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Descripción del Gasto</label>
            <input 
              type="text" 
              placeholder="Ej. Servicio de Internet" 
              value={expenseName} 
              onChange={(e) => setExpenseName(e.target.value)} 
              required 
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-3 py-2.5 outline-none focus:border-orange-500"
            />
          </div>
          <div className="w-full md:w-1/3 space-y-1">
            <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Monto a Pagar</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">RD$</span>
              <input 
                type="number" 
                placeholder="0" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                required 
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg pl-10 pr-3 py-2.5 outline-none focus:border-orange-500"
              />
            </div>
          </div>
          <Button type="submit" className="w-full md:w-auto h-[46px] mb-px bg-orange-600 hover:bg-orange-500 text-white">
            <Plus size={18} className="mr-2" />
            Agregar Gasto
          </Button>
        </form>
      </Card>

      <Card className="p-0 overflow-hidden bg-slate-800/80 backdrop-blur-md border-slate-700">
        <div className="p-6 border-b border-slate-700/50">
          <h3 className="text-lg font-semibold text-slate-100">Directorio de Gastos Operativos</h3>
        </div>
        
        {expenses.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-400 text-lg">No hay gastos fijos registrados en el sistema.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase font-bold tracking-wider">
                  <th className="px-6 py-4 font-semibold">Descripción</th>
                  <th className="px-6 py-4 font-semibold">Monto (RD$)</th>
                  <th className="px-6 py-4 font-semibold text-center">Estado de Pago</th>
                  <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {expenses.map((expense) => {
                  const isEditing = editingId === expense.id;
                  const isPaid = expense.status === 'Paid';
                  
                  if (isEditing) {
                    return (
                      <tr key={expense.id} className="bg-slate-700/30">
                        <td className="px-6 py-4">
                          <input 
                            type="text" 
                            value={editName} 
                            onChange={(e) => setEditName(e.target.value)} 
                            className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-md px-3 py-1.5 outline-none focus:border-orange-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">RD$</span>
                            <input 
                              type="number" 
                              value={editAmount} 
                              onChange={(e) => setEditAmount(e.target.value)} 
                              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-md pl-9 pr-3 py-1.5 outline-none focus:border-orange-500"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-slate-500 text-sm italic">
                          Editando...
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button onClick={() => saveEdit(expense.id)} className="p-1.5 text-emerald-400 hover:bg-emerald-500/20 rounded-md transition-colors">
                              <Check size={18} />
                            </button>
                            <button onClick={cancelEdit} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-md transition-colors">
                              <X size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={expense.id} className={`transition-colors ${isPaid ? 'bg-emerald-500/5' : 'hover:bg-slate-800/50'}`}>
                      <td className="px-6 py-4 font-medium text-slate-200">{expense.expenseName}</td>
                      <td className="px-6 py-4 font-bold text-orange-400">{formatDOP(expense.amount)}</td>
                      <td className="px-6 py-4 flex justify-center">
                        <select
                          value={expense.status}
                          onChange={(e) => toggleExpenseStatus(expense.id, e.target.value)}
                          className={`appearance-none bg-transparent font-bold text-sm px-4 py-1.5 rounded-full border cursor-pointer outline-none transition-colors ${
                            isPaid 
                              ? 'text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10' 
                              : 'text-amber-400 border-amber-500/30 hover:bg-amber-500/10'
                          }`}
                        >
                          <option value="Pending" className="bg-slate-800 text-amber-400">Por Pagar</option>
                          <option value="Paid" className="bg-slate-800 text-emerald-400">Pagado</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center space-x-2">
                          <button 
                            onClick={() => startEdit(expense)} 
                            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 rounded-md transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => openDeleteModal(expense)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-md transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ConfirmModal 
        {...confirmModalConfig}
        onClose={() => setConfirmModalConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
