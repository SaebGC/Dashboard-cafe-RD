import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Card = ({ children, className = '' }) => {
  return (
    <div className={cn("bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(15,40,30,0.05)] border border-[#EBE6DC] p-6 text-[#2C3E35]", className)}>
      {children}
    </div>
  );
};
