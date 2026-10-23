import type { ReactNode } from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger';

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const variants: Record<BadgeVariant, string> = {
    default: "bg-[#F3EFE8] text-[#2C3E35] border border-[#EBE6DC]",
    success: "bg-[#E6F4EA] text-[#1E653F] border border-[#1E653F]/20",
    warning: "bg-[#FEF3D6] text-[#8F6010] border border-[#8F6010]/20",
    danger: "bg-[#FDE8E6] text-[#A83226] border border-[#A83226]/20",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
