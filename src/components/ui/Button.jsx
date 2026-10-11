import React from 'react';
import { cn } from './Card'; // reuse the cn utility we just made

export const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed select-none";
  
  const variants = {
    primary: "bg-[#C8963E] hover:bg-[#B3822E] text-white focus:ring-[#C8963E] px-4 py-2 font-semibold shadow-sm",
    secondary: "bg-white hover:bg-[#F9F7F2] text-[#0F281E] border border-[#0F281E] focus:ring-[#0F281E] px-4 py-2 font-medium shadow-sm",
    danger: "bg-[#A83226] hover:bg-[#8F281D] text-white focus:ring-[#A83226] px-4 py-2 font-semibold shadow-sm",
    ghost: "bg-transparent hover:bg-[#F3EFE8] text-[#2C3E35] hover:text-[#0F281E] px-3 py-2",
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

