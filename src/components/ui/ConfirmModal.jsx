import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

export const ConfirmModal = ({ 
  isOpen, 
  title = "¿Estás seguro?", 
  message = "¿Estás seguro de que deseas realizar esta acción?", 
  confirmText = "Confirmar", 
  cancelText = "Cancelar", 
  onConfirm, 
  onClose, 
  isDestructive = true 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F281E]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-[#EBE6DC] shadow-[0_20px_40px_-15px_rgba(15,40,30,0.15)] max-w-md w-full animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-full ${isDestructive ? 'bg-[#FDE8E6] text-[#A83226]' : 'bg-[#FEF3D6] text-[#8F6010]'}`}>
              <AlertTriangle size={24} />
            </div>
            <button onClick={onClose} className="text-[#6B7C72] hover:text-[#0F281E] transition-colors p-1 rounded-md hover:bg-[#F3EFE8]">
              <X size={20} />
            </button>
          </div>
          
          <h3 className="text-xl font-bold text-[#0F281E] mb-2">{title}</h3>
          <p className="text-[#6B7C72] text-sm leading-relaxed mb-8">{message}</p>
          
          <div className="flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={onClose} className="px-5">
              {cancelText}
            </Button>
            <Button 
              variant={isDestructive ? "danger" : "primary"} 
              onClick={() => { onConfirm(); onClose(); }}
              className="px-5"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
