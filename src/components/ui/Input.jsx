import React from 'react';

export const Input = ({ label, type = 'text', value, onChange, placeholder, required = false, className = '' }) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 outline-none transition-colors"
      />
    </div>
  );
};
