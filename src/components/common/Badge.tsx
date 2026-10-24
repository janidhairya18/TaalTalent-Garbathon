import React from 'react';
import { ApplicationStatus, ScamRiskLevel, ReminderStatus } from '../../types';

export const StatusBadge: React.FC<{ status: ApplicationStatus; text?: string }> = ({ status, text }) => {
  const styles: Record<ApplicationStatus, { bg: string; text: string; dot: string }> = {
    'Applied': { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
    'Assessment': { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700', dot: 'bg-purple-500' },
    'Interview': { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', dot: 'bg-amber-500' },
    'Offer': { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    'Rejected': { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', dot: 'bg-rose-500' },
    'Withdrawn': { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-600', dot: 'bg-slate-400' },
    'No Response': { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700', dot: 'bg-orange-400' },
  };

  const current = styles[status] || styles['Applied'];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${current.bg} ${current.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {text || status}
    </span>
  );
};

export const RiskBadge: React.FC<{ level: ScamRiskLevel; score?: number; label?: string }> = ({ level, score, label }) => {
  const styles: Record<ScamRiskLevel, { bg: string; text: string; border: string }> = {
    'LOW': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    'MEDIUM': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    'HIGH': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  };

  const current = styles[level];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${current.bg} ${current.text} ${current.border}`}>
      {level === 'HIGH' && (
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
      )}
      {label || level}
      {typeof score === 'number' && ` (${score})`}
    </span>
  );
};

export const ReminderBadge: React.FC<{ status: ReminderStatus; text?: string }> = ({ status, text }) => {
  const styles: Record<ReminderStatus, { bg: string; text: string }> = {
    'Overdue': { bg: 'bg-rose-100 text-rose-800 border-rose-200', text: 'Overdue' },
    'Due Today': { bg: 'bg-amber-100 text-amber-800 border-amber-200', text: 'Due Today' },
    'Upcoming': { bg: 'bg-blue-100 text-blue-800 border-blue-200', text: 'Upcoming' },
    'Completed': { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', text: 'Completed' },
    'Dismissed': { bg: 'bg-slate-100 text-slate-600 border-slate-200', text: 'Dismissed' },
  };

  const current = styles[status];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${current.bg}`}>
      {text || current.text}
    </span>
  );
};

export const ApprovalBadge: React.FC<{ status?: 'pending' | 'approved' | 'rejected' }> = ({ status = 'approved' }) => {
  if (status === 'pending') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Pending Admin Review
      </span>
    );
  }
  if (status === 'rejected') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        Admin Declined
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      Approved
    </span>
  );
};
