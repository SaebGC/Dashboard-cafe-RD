import type { ChangeEvent } from 'react';

export interface InputProps {
  label?: string;
  type?: string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
}: InputProps) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && <label className="text-xs font-semibold uppercase tracking-wider text-[#6B7C72]">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-white border border-[#EBE6DC] text-[#2C3E35] text-sm rounded-lg focus:ring-1 focus:ring-[#C8963E] focus:border-[#C8963E] block p-2.5 outline-none transition-colors shadow-sm placeholder:text-[#6B7C72]/50"
      />
    </div>
  );
};
