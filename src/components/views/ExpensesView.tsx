import { useState, type FormEvent } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ConfirmModal } from '../ui/ConfirmModal';
import { useFinancial } from '../../context/FinancialContext';
import { Plus, Trash2, Edit2, Check, X, CreditCard } from 'lucide-react';
import type { Expense, ConfirmModalConfig } from '../../types';

export const ExpensesView = () => {
  const { expenses, addExpense, updateExpense, deleteExpense, toggleExpenseStatus, formatDOP } = useFinancial();
  
  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState<string | number>('');
  
  const [confirmModalConfig, setConfirmModalConfig] = useState<ConfirmModalConfig>({ isOpen: false });

  const handleAddExpense = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!expenseName || !amount) return;
    
    addExpense({
      expenseName,
      amount: Number(amount)
    });
    
    setExpenseName('');
    setAmount('');
  };

  const startEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setEditName(expense.expenseName);
    setEditAmount(expense.amount);
  };

  const saveEdit = (id: string) => {
    updateExpense(id, { expenseName: editName, amount: Number(editAmount) });
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const openDeleteModal = (expense: Expense) => {
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
      <Card className="bg-white border-[#EBE6DC] shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#0F281E] flex items-center">
            <CreditCard size={20} className="mr-2 text-[#C8963E]" />
            Registrar Nuevo Gasto Fijo
          </h3>
        </div>
        
        <form onSubmit={handleAddExpense} className="flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1 w-full space-y-1">
            <label className="text-xs text-[#6B7C72] uppercase font-bold tracking-wider">Descripción del Gasto</label>
            <input 
              type="text" 
              placeholder="Ej. Servicio de Internet" 
              value={expenseName} 
              onChange={(e) => setExpenseName(e.target.value)} 
              required 
              className="w-full bg-white border border-[#EBE6DC] text-[#2C3E35] rounded-lg px-3 py-2.5 outline-none focus:border-[#C8963E] shadow-sm"
            />
          </div>
          <div className="w-full md:w-1/3 space-y-1">
            <label className="text-xs text-[#6B7C72] uppercase font-bold tracking-wider">Monto a Pagar</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7C72]">RD$</span>
              <input 
                type="number" 
                placeholder="0" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                required 
                className="w-full bg-white border border-[#EBE6DC] text-[#2C3E35] rounded-lg pl-10 pr-3 py-2.5 outline-none focus:border-[#C8963E] shadow-sm"
              />
            </div>
          </div>
          <Button type="submit" className="w-full md:w-auto h-[46px] mb-px">
            <Plus size={18} className="mr-2" />
            Agregar Gasto
          </Button>
        </form>
      </Card>

      <Card className="p-0 overflow-hidden bg-white border-[#EBE6DC] shadow-sm">
        <div className="p-6 border-b border-[#EBE6DC]">
          <h3 className="text-lg font-bold text-[#0F281E]">Directorio de Gastos Operativos</h3>
        </div>
        
        {expenses.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[#6B7C72] text-lg">No hay gastos fijos registrados en el sistema.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F9F7F2] text-[#6B7C72] text-xs uppercase font-bold tracking-wider border-b border-[#EBE6DC]">
                  <th className="px-6 py-4 font-semibold">Descripción</th>
                  <th className="px-6 py-4 font-semibold">Monto (RD$)</th>
                  <th className="px-6 py-4 font-semibold text-center">Estado de Pago</th>
                  <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE6DC]">
                {expenses.map((expense) => {
                  const isEditing = editingId === expense.id;
                  const isPaid = expense.status === 'Paid';
                  
                  if (isEditing) {
                    return (
                      <tr key={expense.id} className="bg-[#F9F7F2]">
                        <td className="px-6 py-4">
                          <input 
                            type="text" 
                            value={editName} 
                            onChange={(e) => setEditName(e.target.value)} 
                            className="w-full bg-white border border-[#EBE6DC] text-[#2C3E35] rounded-md px-3 py-1.5 outline-none focus:border-[#C8963E]"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7C72] text-sm">RD$</span>
                            <input 
                              type="number" 
                              value={editAmount} 
                              onChange={(e) => setEditAmount(e.target.value)} 
                              className="w-full bg-white border border-[#EBE6DC] text-[#2C3E35] rounded-md pl-9 pr-3 py-1.5 outline-none focus:border-[#C8963E]"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-[#6B7C72] text-sm italic">
                          Editando...
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button onClick={() => saveEdit(expense.id)} className="p-1.5 text-[#1E653F] hover:bg-[#E6F4EA] rounded-md transition-colors">
                              <Check size={18} />
                            </button>
                            <button onClick={cancelEdit} className="p-1.5 text-[#6B7C72] hover:text-[#A83226] hover:bg-[#FDE8E6] rounded-md transition-colors">
                              <X size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={expense.id} className={`transition-colors ${isPaid ? 'bg-[#E6F4EA]/20' : 'hover:bg-[#F9F7F2]'}`}>
                      <td className="px-6 py-4 font-semibold text-[#0F281E]">{expense.expenseName}</td>
                      <td className="px-6 py-4 font-bold text-[#A83226]">{formatDOP(expense.amount)}</td>
                      <td className="px-6 py-4 flex justify-center">
                        <select
                          value={expense.status}
                          onChange={(e) => toggleExpenseStatus(expense.id, e.target.value)}
                          className={`appearance-none font-bold text-xs px-4 py-1.5 rounded-full border cursor-pointer outline-none transition-colors ${
                            isPaid 
                              ? 'bg-[#E6F4EA] text-[#1E653F] border-[#1E653F]/20 hover:bg-[#E6F4EA]/80' 
                              : 'bg-[#FEF3D6] text-[#8F6010] border-[#8F6010]/20 hover:bg-[#FEF3D6]/80'
                          }`}
                        >
                          <option value="Pending" className="bg-white text-[#8F6010]">Por Pagar</option>
                          <option value="Paid" className="bg-white text-[#1E653F]">Pagado</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center space-x-2">
                          <button 
                            onClick={() => startEdit(expense)} 
                            className="p-1.5 text-[#6B7C72] hover:text-[#0F281E] hover:bg-[#F3EFE8] rounded-md transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => openDeleteModal(expense)} 
                            className="p-1.5 text-[#6B7C72] hover:text-[#A83226] hover:bg-[#FDE8E6] rounded-md transition-colors"
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
