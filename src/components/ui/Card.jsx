import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Card = ({ children, className = '' }) => {
  return (
    <div className={cn("bg-slate-800 rounded-2xl shadow-xl border border-slate-700/50 p-6", className)}>
      {children}
    </div>
  );
};
