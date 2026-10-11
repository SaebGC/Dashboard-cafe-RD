import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ConfirmModal } from '../ui/ConfirmModal';
import { useFinancial } from '../../context/FinancialContext';
import { UserCircle, CheckCircle, Clock, PlusCircle, Trash2, RotateCcw } from 'lucide-react';

export const EmployeesView = () => {
  const { 
    employees, toggleEmployeeStatus, updateEmployeeTotalOwed, 
    addEmployeeInstallment, deleteInstallment, resetEmployeePayments, formatDOP 
  } = useFinancial();

  const [installmentInputs, setInstallmentInputs] = useState({});
  const [confirmModalConfig, setConfirmModalConfig] = useState({ isOpen: false });

  const handleInputChange = (id, value) => {
    setInstallmentInputs(prev => ({ ...prev, [id]: value }));
  };

  const submitInstallment = (id, customAmount = null) => {
    const amount = customAmount !== null ? customAmount : Number(installmentInputs[id]);
    if (!amount || amount <= 0) return;
    addEmployeeInstallment(id, amount);
    if (customAmount === null) {
      setInstallmentInputs(prev => ({ ...prev, [id]: '' }));
    }
  };

  const openDeleteModal = (employeeId, hist) => {
    setConfirmModalConfig({
      isOpen: true,
      title: "Eliminar Abono",
      message: `¿Estás seguro de que deseas eliminar este abono de ${formatDOP(hist.amount)}? El dinero se devolverá al balance general.`,
      confirmText: "Eliminar",
      onConfirm: () => deleteInstallment(employeeId, hist.id),
      isDestructive: true
    });
  };

  const openResetModal = (employee) => {
    setConfirmModalConfig({
      isOpen: true,
      title: "Reiniciar Pagos",
      message: `¿Estás seguro de que deseas reiniciar todos los pagos de ${employee.name}? Esto devolverá todo el dinero abonado (${formatDOP(employee.amountPaid)}) a tu balance disponible.`,
      confirmText: "Reiniciar Pagos",
      onConfirm: () => resetEmployeePayments(employee.id),
      isDestructive: true
    });
  };

  return (
    <div className="p-8 animate-in fade-in duration-500 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {employees.map((employee) => {
          const isPaid = employee.status === 'Paid';
          const remainingAmount = Math.max(0, employee.totalAmountOwed - employee.amountPaid);
          const progressPercent = employee.totalAmountOwed > 0 
            ? Math.min((employee.amountPaid / employee.totalAmountOwed) * 100, 100) 
            : 0;

          return (
            <Card key={employee.id} className="flex flex-col relative transition-all duration-300 border border-[#EBE6DC] bg-white shadow-sm">
              
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-[#E6F4EA] text-[#1E653F]">
                    <UserCircle size={36} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0F281E]">{employee.name}</h3>
                    <p className="text-sm text-[#6B7C72]">{employee.role}</p>
                  </div>
                </div>
                
                {/* Interactive Status Badge */}
                <button
                  onClick={() => toggleEmployeeStatus(employee.id, isPaid ? 'Pending' : 'Paid')}
                  className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                    isPaid ? 'bg-[#E6F4EA] text-[#1E653F] border-[#1E653F]/20 hover:bg-[#E6F4EA]/80' : 'bg-[#FEF3D6] text-[#8F6010] border-[#8F6010]/20 hover:bg-[#FEF3D6]/80'
                  }`}
                >
                  {isPaid ? <CheckCircle size={14} className="mr-1.5" /> : <Clock size={14} className="mr-1.5" />}
                  {isPaid ? 'Pagado' : 'Por pagar'}
                </button>
              </div>

              {/* Total Owed */}
              <div className="mb-6">
                <label className="text-xs text-[#6B7C72] uppercase font-bold tracking-wider mb-2 block">
                  Monto Total a Pagar
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7C72] font-bold">RD$</span>
                  <input
                    type="number"
                    value={employee.totalAmountOwed || ''}
                    onChange={(e) => updateEmployeeTotalOwed(employee.id, e.target.value)}
                    className="w-full bg-[#F9F7F2] border border-[#EBE6DC] text-[#0F281E] text-lg rounded-xl pl-12 pr-4 py-3 outline-none focus:border-[#C8963E] focus:ring-1 focus:ring-[#C8963E] transition-all font-black"
                  />
                </div>
              </div>

              {/* Progress & Breakdown */}
              <div className="bg-[#F9F7F2] p-4 rounded-xl border border-[#EBE6DC] mb-6">
                <div className="flex justify-between text-sm mb-3">
                  <div className="flex flex-col">
                    <span className="text-[#6B7C72] text-xs uppercase font-bold tracking-wider mb-1">Abonado</span>
                    <span className="font-bold text-[#1E653F] text-lg">{formatDOP(employee.amountPaid)}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[#6B7C72] text-xs uppercase font-bold tracking-wider mb-1">Restante</span>
                    <span className="font-bold text-[#8F6010] text-lg">{formatDOP(remainingAmount)}</span>
                  </div>
                </div>
                <div className="h-2.5 w-full bg-[#EBE6DC] rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-700 ease-out bg-[#C8963E]"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Installments Section */}
              <div className="space-y-4 mb-6">
                <label className="text-xs text-[#6B7C72] uppercase font-bold tracking-wider block">
                  Abonos a Plazos
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7C72]">RD$</span>
                    <input
                      type="number"
                      placeholder="Monto a abonar..."
                      value={installmentInputs[employee.id] || ''}
                      onChange={(e) => handleInputChange(employee.id, e.target.value)}
                      className="w-full bg-white border border-[#EBE6DC] text-[#2C3E35] text-sm rounded-lg pl-10 pr-3 py-2.5 outline-none focus:border-[#C8963E] focus:ring-1 focus:ring-[#C8963E]"
                    />
                  </div>
                  <Button 
                    variant="primary" 
                    onClick={() => submitInstallment(employee.id)}
                    className="px-5"
                  >
                    <PlusCircle size={18} className="mr-1.5" />
                    Abonar
                  </Button>
                </div>

                {/* Quick Chips */}
                <div className="flex flex-wrap gap-2">
                  {[200, 500, 1000].map(val => (
                    <button 
                      key={val}
                      onClick={() => submitInstallment(employee.id, val)}
                      className="text-xs font-semibold bg-white hover:bg-[#F9F7F2] text-[#2C3E35] px-3 py-1.5 rounded-full transition-colors border border-[#EBE6DC]"
                    >
                      +RD$ {val}
                    </button>
                  ))}
                  {remainingAmount > 0 && (
                    <button 
                      onClick={() => submitInstallment(employee.id, remainingAmount)}
                      className="text-xs font-bold bg-[#FEF3D6] hover:bg-[#FEF3D6]/80 text-[#8F6010] px-3 py-1.5 rounded-full transition-colors border border-[#8F6010]/20 ml-auto"
                    >
                      Completar Restante
                    </button>
                  )}
                </div>
              </div>

              {/* Installment History & Rest */}
              <div className="mt-auto pt-6">
                <label className="text-xs text-[#6B7C72] uppercase font-bold tracking-wider mb-3 block">
                  Historial de Abonos
                </label>
                
                <div className="bg-[#F9F7F2] rounded-xl border border-[#EBE6DC] max-h-40 overflow-y-auto mb-4 p-2 space-y-2">
                  {employee.paymentHistory.length === 0 ? (
                    <div className="text-center py-4 text-xs text-[#6B7C72]/70 italic">
                      No hay abonos registrados.
                    </div>
                  ) : (
                    employee.paymentHistory.map((hist) => (
                      <div key={hist.id} className="flex justify-between items-center text-xs bg-white p-2.5 rounded-lg border border-[#EBE6DC] group hover:border-[#C8963E]/40 transition-colors shadow-sm">
                        <span className="text-[#6B7C72] flex-1">{hist.date}</span>
                        <span className="font-bold text-[#1E653F] px-3 bg-[#E6F4EA] rounded-md py-1 border border-[#1E653F]/20">
                          +{formatDOP(hist.amount)}
                        </span>
                        <button 
                          onClick={() => openDeleteModal(employee.id, hist)}
                          title="Eliminar este abono"
                          className="ml-3 p-1.5 text-[#6B7C72] hover:text-[#A83226] hover:bg-[#FDE8E6] rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {employee.paymentHistory.length > 0 && (
                  <div className="flex justify-end">
                    <button 
                      onClick={() => openResetModal(employee)}
                      className="flex items-center text-xs font-semibold text-[#6B7C72] hover:text-[#0F281E] border border-[#EBE6DC] hover:border-[#0F281E] bg-white hover:bg-[#F9F7F2] px-4 py-2 rounded-lg transition-all"
                    >
                      <RotateCcw size={14} className="mr-2" />
                      Reiniciar Pagos
                    </button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <ConfirmModal 
        {...confirmModalConfig}
        onClose={() => setConfirmModalConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
