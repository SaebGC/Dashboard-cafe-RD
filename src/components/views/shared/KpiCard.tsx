import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '../../ui/Card';

export interface KpiCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  subtext?: ReactNode;
  variant?: 'gold' | 'emerald' | 'amber' | 'neutral' | 'danger';
  className?: string;
}

export const KpiCard = ({
  label,
  value,
  icon: Icon,
  subtext,
  variant = 'neutral',
  className = '',
}: KpiCardProps) => {
  const variantStyles = {
    gold: {
      card: 'border-[#C8963E]/40 hover:-translate-y-1 transition-all group',
      value: 'text-[#C8963E]',
      iconBox: 'bg-[#FEF3D6] text-[#8F6010]',
      glow: 'bg-[#C8963E]/5 group-hover:bg-[#C8963E]/10',
    },
    emerald: {
      card: 'border-[#1E653F]/30 hover:-translate-y-1 transition-all group',
      value: 'text-[#1E653F]',
      iconBox: 'bg-[#E6F4EA] text-[#1E653F]',
      glow: 'bg-[#1E653F]/5 group-hover:bg-[#1E653F]/10',
    },
    amber: {
      card: 'border-[#FEF3D6] hover:-translate-y-1 transition-all group',
      value: 'text-[#8F6010]',
      iconBox: 'bg-[#FEF3D6] text-[#8F6010]',
      glow: 'bg-[#FEF3D6]/20',
    },
    neutral: {
      card: 'border-[#EBE6DC] hover:-translate-y-1 transition-all group',
      value: 'text-[#0F281E]',
      iconBox: 'bg-[#F3EFE8] text-[#2C3E35]',
      glow: 'bg-transparent',
    },
    danger: {
      card: 'border-[#FDE8E6] bg-[#FDE8E6]/20 hover:-translate-y-1 transition-all group',
      value: 'text-[#A83226]',
      iconBox: 'bg-[#FDE8E6] text-[#A83226]',
      glow: 'bg-[#A83226]/5',
    },
  };

  const current = variantStyles[variant];

  return (
    <Card className={`relative overflow-hidden bg-white ${current.card} ${className}`}>
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none transition-all duration-500 ${current.glow}`} />
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1 pr-2">
          <p className="text-[#6B7C72] text-xs font-bold uppercase tracking-wider mb-2">{label}</p>
          <h3 className={`text-2xl font-black ${current.value}`}>{value}</h3>
          {subtext && <div className="mt-2 text-xs text-[#6B7C72]">{subtext}</div>}
        </div>
        <div className={`p-2 rounded-xl flex-shrink-0 ${current.iconBox}`}>
          <Icon size={20} />
        </div>
      </div>
    </Card>
  );
};
