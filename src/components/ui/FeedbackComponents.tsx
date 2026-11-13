import React from 'react';
import { Info, AlertCircle, XCircle, CheckCircle2 } from 'lucide-react';

export const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'navy' | 'ocean' | 'accent' | 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
}> = ({ children, variant = 'ocean', className = '' }) => {
  const styles: Record<string, string> = {
    navy: 'bg-[#0B2545] text-white',
    ocean: 'bg-[#E7F3F8] text-[#136F99]',
    accent: 'bg-[#FEF3C7] text-[#B45309]',
    success: 'bg-[#ECFDF5] text-[#047857]',
    warning: 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]',
    error: 'bg-[#FEF2F2] text-[#B91C1C]',
    neutral: 'bg-slate-100 text-slate-700'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-tight ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export const AlertBanner: React.FC<{
  type?: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ type = 'info', title, children, className = '' }) => {
  const config = {
    info: {
      bg: 'bg-[#E7F3F8] border-[#BAE6FD] text-[#0B2545]',
      icon: <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#136F99]" />
    },
    warning: {
      bg: 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]',
      icon: <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#D97706]" />
    },
    error: {
      bg: 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]',
      icon: <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#DC2626]" />
    },
    success: {
      bg: 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]',
      icon: <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#059669]" />
    }
  }[type];

  return (
    <div className={`rounded-xl border p-3 text-xs leading-relaxed flex gap-2.5 ${config.bg} ${className}`}>
      {config.icon}
      <div className="flex-1 min-w-0">
        {title && <div className="font-bold mb-0.5">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
};

export const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ icon, title, description, actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center text-center py-10 px-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
    <div className="w-12 h-12 rounded-2xl bg-[#E7F3F8] text-[#136F99] flex items-center justify-center mb-3">
      {icon}
    </div>
    <h3 className="text-sm font-bold text-slate-900 mb-1">{title}</h3>
    <p className="text-xs text-slate-500 leading-relaxed max-w-[260px] mb-4">{description}</p>
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="px-4 py-2.5 rounded-xl bg-[#0B2545] text-white text-xs font-semibold active:scale-[0.98] transition"
      >
        {actionLabel}
      </button>
    )}
  </div>
);
