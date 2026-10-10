import React from 'react';
import { cn } from './Card'; // reuse the cn utility we just made

export const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-500 px-4 py-2",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-100 focus:ring-slate-500 px-4 py-2",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 px-4 py-2",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-2",
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      className={cn(baseStyles, variants[variant], className)}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
