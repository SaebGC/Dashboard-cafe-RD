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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-800 rounded-2xl border border-slate-700/50 shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-full ${isDestructive ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
              <AlertTriangle size={24} />
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-md hover:bg-slate-700">
              <X size={20} />
            </button>
          </div>
          
          <h3 className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">{message}</p>
          
          <div className="flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={onClose} className="px-5 border-slate-700 text-slate-300 hover:bg-slate-700">
              {cancelText}
            </Button>
            <Button 
              variant="danger" 
              onClick={() => { onConfirm(); onClose(); }}
              className={`px-5 font-semibold transition-colors ${isDestructive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-amber-500 hover:bg-amber-600 text-slate-900'}`}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
