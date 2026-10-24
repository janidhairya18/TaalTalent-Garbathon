import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStatus } from '../../types';
import { StatusBadge, RiskBadge } from '../common/Badge';
import { 
  X, 
  Building2, 
  Briefcase, 
  Calendar, 
  Mail, 
  Clock, 
  MapPin, 
  DollarSign, 
  User, 
  ExternalLink, 
  CheckCircle2, 
  Save,
  MessageSquare,
  ShieldCheck,
  History
} from 'lucide-react';

interface ApplicationDetailModalProps {
  app: Application | null;
  onClose: () => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({ app, onClose }) => {
  const { t, language, updateApplication, emails, setSelectedEmailId, setActiveTab } = useApp();

  if (!app) return null;

  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>(app.status);
  const [notes, setNotes] = useState(app.notes || '');
  const [location, setLocation] = useState(app.location || '');
  const [salary, setSalary] = useState(app.salary || '');

  // Get associated emails
  const linkedEmails = emails.filter((e) => app.emailIds.includes(e.id));

  const handleSave = () => {
    updateApplication({
      ...app,
      status: currentStatus,
      notes,
      location,
      salary
    });
    onClose();
  };

  const handleOpenEmail = (emailId: string) => {
    setSelectedEmailId(emailId);
    setActiveTab('inbox');
    onClose();
  };

  const statuses: ApplicationStatus[] = [
    'Applied',
    'Assessment',
    'Interview',
    'Offer',
    'Rejected',
    'Withdrawn',
    'No Response'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-base shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <span>{app.company}</span>
                  <RiskBadge level={app.scamRisk} />
                </h2>
                <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>{app.jobTitle}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={app.status} />
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Status Changer Bar */}
          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-slate-800">
                {language === 'hi' ? 'आवेदन स्थिति अद्यतन करें:' : 'Update Pipeline Status:'}
              </p>
              <p className="text-[11px] text-slate-500">
                {language === 'hi' ? 'चयनित स्थिति डैशबोर्ड मेट्रिक्स में तुरंत प्रतिबिंबित होगी' : 'Reflects immediately in dashboard metrics and reminders.'}
              </p>
            </div>
            <select
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value as ApplicationStatus)}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Key Application Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {t('colDate')}
              </span>
              <p className="text-xs font-semibold text-slate-800 mt-1">
                {app.applicationDate}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {t('colLastEmail')}
              </span>
              <p className="text-xs font-semibold text-slate-800 mt-1">
                {app.lastMeaningfulResponseAt ? app.lastMeaningfulResponseAt.split('T')[0] : 'None'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <User className="w-3 h-3" />
                Recruiter
              </span>
              <p className="text-xs font-semibold text-slate-800 mt-1 truncate" title={app.recruiterEmail || ''}>
                {app.recruiterName || app.recruiterEmail || 'HR Department'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Fraud Defense
              </span>
              <p className="text-xs font-semibold text-slate-800 mt-1">
                {app.scamRisk === 'LOW' ? 'Verified Safe' : app.scamRisk === 'HIGH' ? 'Flagged Alert' : 'Caution Advised'}
              </p>
            </div>
          </div>

          {/* Associated Emails List */}
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-800 mb-2.5 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-indigo-600" />
              <span>{t('associatedEmails')} ({linkedEmails.length})</span>
            </h3>

            {linkedEmails.length === 0 ? (
              <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl">
                No direct recruiter emails linked to this record yet.
              </p>
            ) : (
              <div className="space-y-2">
                {linkedEmails.map((em) => (
                  <div
                    key={em.id}
                    className="p-3 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-300 transition flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {em.subject}
                        </span>
                        <RiskBadge level={em.scamAssessment.riskLevel} />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {language === 'hi' && em.summaryHi ? em.summaryHi : em.summary}
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenEmail(em.id)}
                      className="shrink-0 text-xs font-medium text-indigo-600 hover:text-indigo-800 px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 border border-indigo-100 flex items-center gap-1 transition"
                    >
                      <span>Read</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Timeline History */}
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-800 mb-2.5 flex items-center gap-1.5">
              <History className="w-4 h-4 text-indigo-600" />
              <span>{t('historyTimeline')}</span>
            </h3>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {app.history.map((hist) => (
                <div key={hist.id} className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-white" />
                  <p className="text-xs font-bold text-slate-800">
                    {hist.title}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {hist.description}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    {hist.date.split('T')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Editable Notes & Additional Details */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco / Remote"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Salary / Comp
                </label>
                <input
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. $160k - $185k"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('fieldNotes')}
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Personal notes on interview rounds, questions asked, or referral contacts..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition"
          >
            {t('close')}
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-500/20 flex items-center gap-1.5 transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{t('save')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
