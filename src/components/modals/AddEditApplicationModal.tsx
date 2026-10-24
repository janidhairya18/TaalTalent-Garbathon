import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStatus, ScamRiskLevel } from '../../types';
import { X, Plus, Save, Building2, Briefcase } from 'lucide-react';

interface AddEditApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationToEdit?: Application | null;
}

export const AddEditApplicationModal: React.FC<AddEditApplicationModalProps> = ({
  isOpen,
  onClose,
  applicationToEdit
}) => {
  const { t, language, addApplication, updateApplication } = useApp();

  const isEdit = Boolean(applicationToEdit);

  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>('Applied');
  const [applicationDate, setApplicationDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [scamRisk, setScamRisk] = useState<ScamRiskLevel>('LOW');

  useEffect(() => {
    if (applicationToEdit) {
      setCompany(applicationToEdit.company);
      setJobTitle(applicationToEdit.jobTitle);
      setStatus(applicationToEdit.status);
      setApplicationDate(applicationToEdit.applicationDate);
      setLocation(applicationToEdit.location || '');
      setSalary(applicationToEdit.salary || '');
      setRecruiterEmail(applicationToEdit.recruiterEmail || '');
      setNotes(applicationToEdit.notes || '');
      setScamRisk(applicationToEdit.scamRisk);
    } else {
      setCompany('');
      setJobTitle('');
      setStatus('Applied');
      setApplicationDate(new Date().toISOString().split('T')[0]);
      setLocation('');
      setSalary('');
      setRecruiterEmail('');
      setNotes('');
      setScamRisk('LOW');
    }
  }, [applicationToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !jobTitle.trim()) return;

    if (isEdit && applicationToEdit) {
      updateApplication({
        ...applicationToEdit,
        company: company.trim(),
        jobTitle: jobTitle.trim(),
        status,
        applicationDate,
        location,
        salary,
        recruiterEmail,
        notes,
        scamRisk
      });
    } else {
      addApplication({
        company: company.trim(),
        jobTitle: jobTitle.trim(),
        status,
        applicationDate,
        location,
        salary,
        recruiterEmail,
        notes,
        scamRisk,
        emailIds: []
      });
    }

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
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              {isEdit ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
            <h2 className="font-heading font-bold text-base text-slate-800">
              {isEdit ? t('editModalTitle') : t('addModalTitle')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('fieldCompany')} <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. OpenAI"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('fieldRole')} <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Full Stack Engineer"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('fieldStatus')}
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('fieldDate')}
              </label>
              <input
                type="date"
                value={applicationDate}
                onChange={(e) => setApplicationDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('fieldLocation')}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Remote, NYC, etc."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('fieldSalary')}
              </label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="$150k - $175k"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('fieldRecruiterEmail')}
            </label>
            <input
              type="email"
              value={recruiterEmail}
              onChange={(e) => setRecruiterEmail(e.target.value)}
              placeholder="recruiter@company.com"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('fieldNotes')}
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Specific notes, interview topics, referral names..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

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
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-500/20 flex items-center gap-1.5 transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t('save')}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
