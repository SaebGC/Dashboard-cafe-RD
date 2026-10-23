import { useState, useMemo } from 'react';
import { Calculator, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../../ui/Button';
import { formatDOP } from '../../../lib/utils';

export interface CashCountModalProps {
  isOpen: boolean;
  onClose: () => void;
  expectedAmount?: number;
  onConfirmCount?: (countedTotal: number, difference: number) => void;
}

const DENOMINATIONS = [
  { label: 'RD$ 2,000', value: 2000 },
  { label: 'RD$ 1,000', value: 1000 },
  { label: 'RD$ 500', value: 500 },
  { label: 'RD$ 200', value: 200 },
  { label: 'RD$ 100', value: 100 },
  { label: 'RD$ 50', value: 50 },
  { label: 'RD$ 25', value: 25 },
  { label: 'RD$ 10', value: 10 },
];

export const CashCountModal = ({
  isOpen,
  onClose,
  expectedAmount = 0,
  onConfirmCount,
}: CashCountModalProps) => {
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [cashierNotes, setCashierNotes] = useState('');

  const totalCounted = useMemo(() => {
    return Object.entries(counts).reduce((acc, [denom, qty]) => {
      return acc + Number(denom) * (Number(qty) || 0);
    }, 0);
  }, [counts]);

  const difference = totalCounted - expectedAmount;

  if (!isOpen) return null;

  const handleQtyChange = (denom: number, value: string) => {
    const qty = Math.max(0, parseInt(value, 10) || 0);
    setCounts((prev) => ({ ...prev, [denom]: qty }));
  };

  const handleReset = () => {
    setCounts({});
    setCashierNotes('');
  };

  const handleConfirm = () => {
    onConfirmCount?.(totalCounted, difference);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F281E]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-[#EBE6DC] shadow-[0_20px_40px_-15px_rgba(15,40,30,0.15)] max-w-lg w-full animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#EBE6DC] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#FEF3D6] text-[#8F6010]">
              <Calculator size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0F281E]">Arqueo de Caja / Cierre de Turno</h3>
              <p className="text-xs text-[#6B7C72]">Conteo físico de efectivo y billetes en caja</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-[#6B7C72] hover:text-[#0F281E] p-1.5 rounded-lg hover:bg-[#F3EFE8] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Denominations Grid */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-2 gap-3">
            {DENOMINATIONS.map((d) => (
              <div 
                key={d.value} 
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#F9F7F2] border border-[#EBE6DC]"
              >
                <span className="text-xs font-bold text-[#0F281E]">{d.label}</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={counts[d.value] || ''}
                  onChange={(e) => handleQtyChange(d.value, e.target.value)}
                  className="w-16 text-right bg-white border border-[#EBE6DC] rounded-lg px-2 py-1 text-sm font-semibold outline-none focus:border-[#C8963E]"
                />
              </div>
            ))}
          </div>

          <div className="space-y-1 pt-2">
            <label className="text-xs uppercase font-bold text-[#6B7C72] tracking-wider">Notas del Cajero</label>
            <textarea
              rows={2}
              value={cashierNotes}
              onChange={(e) => setCashierNotes(e.target.value)}
              placeholder="Comentarios sobre faltantes, sobrantes o fondo inicial de caja..."
              className="w-full bg-[#F9F7F2] border border-[#EBE6DC] text-[#2C3E35] rounded-xl p-3 text-xs outline-none focus:border-[#C8963E]"
            />
          </div>

          {/* Balance Comparison */}
          <div className="p-4 rounded-xl bg-[#0F281E] text-white flex justify-between items-center">
            <div>
              <p className="text-[10px] uppercase font-bold text-[#D8D1C2]/70 tracking-wider">Total Contado</p>
              <p className="text-2xl font-black text-[#C8963E]">{formatDOP(totalCounted)}</p>
            </div>
            {expectedAmount > 0 && (
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-[#D8D1C2]/70 tracking-wider">Diferencia</p>
                <div className="flex items-center justify-end text-sm font-bold">
                  {difference === 0 ? (
                    <span className="text-[#68D391] flex items-center">
                      <CheckCircle size={14} className="mr-1" /> Cuadre Exacto
                    </span>
                  ) : difference > 0 ? (
                    <span className="text-[#68D391]">+{formatDOP(difference)} (Sobrante)</span>
                  ) : (
                    <span className="text-[#FC8181] flex items-center">
                      <AlertTriangle size={14} className="mr-1" /> {formatDOP(difference)} (Faltante)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EBE6DC] flex justify-between items-center bg-[#F9F7F2] rounded-b-2xl">
          <Button variant="ghost" onClick={handleReset} className="text-xs">
            Limpiar Conteo
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose} className="px-4">
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleConfirm} className="px-5">
              Confirmar Arqueo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
