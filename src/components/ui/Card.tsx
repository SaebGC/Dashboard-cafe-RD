import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={cn("bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(15,40,30,0.05)] border border-[#EBE6DC] p-6 text-[#2C3E35]", className)}>
      {children}
    </div>
  );
};
