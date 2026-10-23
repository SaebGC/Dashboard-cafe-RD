import { useState } from 'react';
import { Card } from '../../ui/Card';
import { useFinancial } from '../../../context/FinancialContext';
import { useAuth } from '../../../context/AuthContext';
import { useRole } from '../../../context/RoleContext';
import { api, ApiError } from '../../../lib/api';
import { Users, AlertCircle, CheckCircle, Clock, Pencil, Check, X } from 'lucide-react';

export const JefePayrollView = () => {
  const { 
    employees, 
    totalPayrollPaid, 
    totalPayrollPending, 
    formatDOP,
    updateEmployeeName 
  } = useFinancial();

  const { user } = useAuth();
  const { role: contextRole } = useRole();
  const currentRole = user?.role || contextRole;

  // Edit Name permission: enabled for admin and jefe
  const canEditName = currentRole === 'admin' || currentRole === 'jefe';

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const handleSaveName = async (id: string) => {
    if (!tempName.trim()) return;
    setIsSavingName(true);
    setEditError(null);

    try {
      try {
        await api.patch(`/employees/${id}/name`, { name: tempName.trim() });
      } catch (err: unknown) {
        if (err instanceof ApiError) {
          if (err.status === 403) {
            setEditError('Acceso denegado para editar nombres.');
            setIsSavingName(false);
            return;
          }
          if (err.status >= 400) {
            const dataMsg = typeof err.data === 'object' && err.data !== null && 'message' in err.data 
              ? (err.data as { message: string | string[] }).message 
              : err.message;
            setEditError(Array.isArray(dataMsg) ? dataMsg.join(', ') : dataMsg || 'Error al actualizar nombre');
            setIsSavingName(false);
            return;
          }
        }
        console.warn('API sync fallback to local update:', err);
      }

      updateEmployeeName(id, tempName.trim());
      setEditingId(null);
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : 'Error al actualizar');
    } finally {
      setIsSavingName(false);
    }
  };

  const totalCommittedPayroll = totalPayrollPaid + totalPayrollPending;
  const overallProgress = totalCommittedPayroll > 0 
    ? Math.round((totalPayrollPaid / totalCommittedPayroll) * 100) 
    : 0;

  return (
    <div className="p-8 animate-in fade-in duration-500 space-y-6">
      
      {/* Header Summary */}
      <Card className="bg-white border-[#EBE6DC] shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8F6010]/20 text-[#8F6010] border border-[#8F6010]/40 uppercase tracking-wider">
              Control Salarial & Pasivos
            </span>
            <span className="text-xs text-[#6B7C72]">Auditoría de Personal</span>
          </div>
          <h2 className="text-2xl font-black text-[#0F281E] mt-1">Supervisión de Nómina y Deuda</h2>
          <p className="text-xs text-[#6B7C72] mt-0.5">
            Monitorea el avance de pagos por colaborador, compromisos pendientes y balance histórico.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 bg-[#F9F7F2] p-4 rounded-xl border border-[#EBE6DC]">
          <div>
            <p className="text-[10px] text-[#6B7C72] uppercase font-bold tracking-wider">Total Nómina</p>
            <p className="text-lg font-bold text-[#0F281E]">{formatDOP(totalCommittedPayroll)}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#6B7C72] uppercase font-bold tracking-wider">Abonado</p>
            <p className="text-lg font-bold text-[#1E653F]">{formatDOP(totalPayrollPaid)}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#6B7C72] uppercase font-bold tracking-wider">Deuda Pendiente</p>
            <p className="text-lg font-black text-[#8F6010]">{formatDOP(totalPayrollPending)}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#6B7C72] uppercase font-bold tracking-wider">Cumplimiento</p>
            <p className="text-lg font-black text-[#C8963E]">{overallProgress}%</p>
          </div>
        </div>
      </Card>

      {/* Employees Debt Audit Table */}
      <Card className="p-0 overflow-hidden bg-white border-[#EBE6DC] shadow-sm">
        <div className="p-6 border-b border-[#EBE6DC] flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#0F281E] flex items-center">
            <Users size={20} className="mr-2 text-[#C8963E]" />
            Auditoría de Deuda Salarial por Colaborador
          </h3>
          <span className="text-xs text-[#6B7C72] font-semibold">
            {employees.length} colaboradores registrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F9F7F2] text-[#6B7C72] uppercase font-bold tracking-wider border-b border-[#EBE6DC]">
                <th className="px-6 py-4">Colaborador</th>
                <th className="px-6 py-4">Puesto</th>
                <th className="px-6 py-4">Compromiso Total</th>
                <th className="px-6 py-4">Monto Abonado</th>
                <th className="px-6 py-4">Deuda Restante</th>
                <th className="px-6 py-4 text-center">Progreso</th>
                <th className="px-6 py-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE6DC]">
              {employees.map((emp) => {
                const isPaid = emp.status === 'Paid';
                const remaining = Math.max(0, emp.totalAmountOwed - emp.amountPaid);
                const progress = emp.totalAmountOwed > 0 
                  ? Math.min(Math.round((emp.amountPaid / emp.totalAmountOwed) * 100), 100) 
                  : 0;

                return (
                  <tr key={emp.id} className="hover:bg-[#F9F7F2] transition-colors">
                    <td className="px-6 py-4 font-bold text-[#0F281E] text-sm">
                      {editingId === emp.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveName(emp.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            autoFocus
                            disabled={isSavingName}
                            className="bg-white border border-[#C8963E] text-[#0F281E] font-bold text-xs rounded px-2 py-1 outline-none ring-1 ring-[#C8963E]"
                          />
                          <button
                            onClick={() => handleSaveName(emp.id)}
                            disabled={isSavingName || !tempName.trim()}
                            title="Guardar nombre"
                            className="p-1 text-white bg-[#1E653F] hover:bg-[#1E653F]/90 rounded transition-colors"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => { setEditingId(null); setEditError(null); }}
                            disabled={isSavingName}
                            title="Cancelar"
                            className="p-1 text-[#6B7C72] hover:text-[#A83226] hover:bg-[#FDE8E6] rounded transition-colors"
                          >
                            <X size={14} />
                          </button>
                          {editError && (
                            <span className="text-[10px] text-[#A83226] font-normal">{editError}</span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group/edit">
                          <span>{emp.name}</span>
                          {canEditName && (
                            <button
                              onClick={() => {
                                setEditingId(emp.id);
                                setTempName(emp.name);
                                setEditError(null);
                              }}
                              title="Editar nombre del colaborador"
                              className="p-1 text-[#6B7C72] hover:text-[#C8963E] hover:bg-[#FEF3D6] rounded transition-colors opacity-60 group-hover/edit:opacity-100"
                            >
                              <Pencil size={13} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[#6B7C72] font-medium">
                      {emp.role}
                    </td>
                    <td className="px-6 py-4 font-bold text-[#0F281E]">
                      {formatDOP(emp.totalAmountOwed)}
                    </td>
                    <td className="px-6 py-4 font-bold text-[#1E653F]">
                      {formatDOP(emp.amountPaid)}
                    </td>
                    <td className="px-6 py-4 font-bold text-[#8F6010]">
                      {formatDOP(remaining)}
                    </td>
                    <td className="px-6 py-4 w-44">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-2 bg-[#EBE6DC] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#C8963E] transition-all duration-500" 
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-[#6B7C72]">{progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border ${
                        isPaid 
                          ? 'bg-[#E6F4EA] text-[#1E653F] border-[#1E653F]/20' 
                          : 'bg-[#FEF3D6] text-[#8F6010] border-[#8F6010]/20'
                      }`}>
                        {isPaid ? <CheckCircle size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}
                        {isPaid ? 'Completado' : 'Con Pendiente'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Historical Payments Audit Logs */}
      <Card className="bg-white border-[#EBE6DC] shadow-sm p-6">
        <h3 className="text-lg font-bold text-[#0F281E] mb-4 flex items-center">
          <Clock size={18} className="mr-2 text-[#C8963E]" />
          Bitácora de Desembolsos Salariales (Auditoría Gerencial)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {employees.map((emp) => (
            <div key={emp.id} className="p-4 rounded-xl bg-[#F9F7F2] border border-[#EBE6DC] space-y-2">
              <div className="flex justify-between items-center border-b border-[#EBE6DC] pb-2">
                <span className="font-bold text-xs text-[#0F281E]">{emp.name}</span>
                <span className="text-[10px] text-[#6B7C72]">{emp.paymentHistory.length} transacciones</span>
              </div>
              
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {emp.paymentHistory.length === 0 ? (
                  <p className="text-[11px] text-[#6B7C72] italic py-2">Sin desembolsos registrados.</p>
                ) : (
                  emp.paymentHistory.map((hist) => (
                    <div key={hist.id} className="flex justify-between items-center text-[11px] bg-white p-2 rounded-lg border border-[#EBE6DC]">
                      <span className="text-[#6B7C72]">{hist.date}</span>
                      <span className="font-bold text-[#1E653F]">+{formatDOP(hist.amount)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="bg-[#FEF3D6]/60 border border-[#FEF3D6] p-4 rounded-xl text-xs text-[#8F6010] flex items-center gap-3">
        <AlertCircle size={20} className="flex-shrink-0" />
        <p>
          <strong>Política de Nómina:</strong> Las cancelaciones y modificaciones de montos acordados deben ser coordinadas con el Administrador de Local.
        </p>
      </div>
    </div>
  );
};
