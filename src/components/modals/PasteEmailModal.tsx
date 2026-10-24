import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, AlertTriangle, FileText, Send } from 'lucide-react';

interface PasteEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasteEmailModal: React.FC<PasteEmailModalProps> = ({ isOpen, onClose }) => {
  const { t, language, addPastedEmail } = useApp();

  const [subject, setSubject] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const loadScamSample = () => {
    setCompany('Apex Rapid Staffing');
    setJobTitle('Remote Operations Assistant');
    setSenderName('Onboarding Coordinator');
    setSenderEmail('recruiting@apex-rapid-jobs.biz');
    setSubject('URGENT: Immediate Employment Confirmation - Equipment Fee Required');
    setBody(`Dear Applicant,

Congratulations! You have been selected without further interview for the position of Remote Operations Assistant with starting salary of $48/hour.

To dispatch your company Apple laptop and security credentials, please transfer a refundable equipment fee of $250 via Zelle or Bitcoin within 24 hours. Your placement will be forfeited if payment is not received today.

Apex Rapid Staffing Desk`);
  };

  const loadLegitSample = () => {
    setCompany('CloudScale Systems');
    setJobTitle('Senior Backend Engineer');
    setSenderName('David Miller');
    setSenderEmail('dmiller@cloudscalesystems.com');
    setSubject('CloudScale Systems: Technical Interview Invitation');
    setBody(`Hi there,

Thank you for applying for our Senior Backend Engineer opening. We were very impressed by your distributed systems and Go/Kubernetes experience.

We would like to invite you for a 60-minute technical architecture discussion with our staff engineers next Tuesday at 2:00 PM PST.

Please let me know if this time slot works for you!

Best regards,
David Miller
Talent Acquisition Team`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    setIsSubmitting(true);
    await addPastedEmail({
      subject: subject || 'Recruitment Update',
      body,
      senderEmail,
      senderName,
      company,
      jobTitle
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-slate-800">
                {t('pasteModalTitle')}
              </h2>
              <p className="text-xs text-slate-500">
                {t('pasteModalDesc')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">
              {language === 'hi' ? 'त्वरित नमूने लोड करें:' : 'Try quick templates:'}
            </span>
            <button
              type="button"
              onClick={loadScamSample}
              className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-medium transition"
            >
              ⚠️ {language === 'hi' ? 'धोखाधड़ी ईमेल नमूना' : 'Fake Job Fee Scam'}
            </button>
            <button
              type="button"
              onClick={loadLegitSample}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-medium transition"
            >
              ✓ {language === 'hi' ? 'वैध इंटरव्यू आमंत्रण' : 'Legit Tech Interview'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('companyLabel')}
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Acme Corp (Auto-extracted if blank)"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('jobTitleLabel')}
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Frontend Engineer"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('sender')} (Name)
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Talent Lead"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sender Email
              </label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="e.g. recruiter@company.com"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Application Status / Interview Invitation"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Message Body <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t('pastePlaceholder')}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono leading-relaxed"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !body.trim()}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-500/25 flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSubmitting ? t('analysing') : t('analyseButton')}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
