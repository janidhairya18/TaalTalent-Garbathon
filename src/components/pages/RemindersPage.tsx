import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Reminder, ReminderStatus } from '../../types';
import { ReminderBadge } from '../common/Badge';
import { 
  Clock, 
  Copy, 
  Check, 
  Calendar, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Building2, 
  Briefcase, 
  ExternalLink, 
  MessageSquare, 
  Info,
  ChevronDown,
  Globe
} from 'lucide-react';

export const RemindersPage: React.FC = () => {
  const { 
    reminders, 
    markReminderCompleted, 
    snoozeReminder, 
    dismissReminder, 
    t, 
    language, 
    showToast,
    setSelectedAppId,
    setActiveTab
  } = useApp();

  const [activeTab, setActiveReminderTab] = useState<'ALL' | ReminderStatus>('ALL');
  const [templateLang, setTemplateLang] = useState<'en' | 'hi'>(language);
  const [snoozeOpenId, setSnoozeOpenId] = useState<string | null>(null);

  const filteredReminders = reminders.filter((r) => {
    if (activeTab === 'ALL') return r.status !== 'Dismissed';
    return r.status === activeTab;
  });

  const overdueCount = reminders.filter((r) => r.status === 'Overdue').length;
  const dueTodayCount = reminders.filter((r) => r.status === 'Due Today').length;
  const upcomingCount = reminders.filter((r) => r.status === 'Upcoming').length;
  const completedCount = reminders.filter((r) => r.status === 'Completed').length;

  const handleCopyMessage = (message: string) => {
    navigator.clipboard.writeText(message);
    showToast(t('copied'), 'success');
  };

  const handleOpenApp = (appId: string) => {
    setSelectedAppId(appId);
    setActiveTab('tracker');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & 7-Day Rule Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div>
          <h1 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <span>{t('remindersHeading')}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('remindersSubheading')}
          </p>
        </div>

        {/* 7-Day Rule Banner */}
        <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200 text-xs text-indigo-950 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block font-bold">Automated 7-Day Follow-Up Rule:</strong>
            <span>{t('sevenDayRuleBanner')}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Language Selector for Email Templates */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveReminderTab('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'ALL'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t('tabAll')} ({reminders.filter(r => r.status !== 'Dismissed').length})
          </button>

          <button
            onClick={() => setActiveReminderTab('Overdue')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'Overdue'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
            }`}
          >
            {t('tabOverdue')} ({overdueCount})
          </button>

          <button
            onClick={() => setActiveReminderTab('Due Today')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'Due Today'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
            }`}
          >
            {t('tabDueToday')} ({dueTodayCount})
          </button>

          <button
            onClick={() => setActiveReminderTab('Upcoming')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'Upcoming'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
            }`}
          >
            {t('tabUpcoming')} ({upcomingCount})
          </button>

          <button
            onClick={() => setActiveReminderTab('Completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'Completed'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
            }`}
          >
            {t('tabCompleted')} ({completedCount})
          </button>
        </div>

        {/* Template Language Selector */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Globe className="w-3.5 h-3.5" />
          <span>Template Language:</span>
          <button
            onClick={() => setTemplateLang(templateLang === 'en' ? 'hi' : 'en')}
            className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 transition"
          >
            {templateLang === 'en' ? 'English' : 'हिन्दी'}
          </button>
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        {filteredReminders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            {t('noRemindersFound')}
          </div>
        ) : (
          filteredReminders.map((rem) => {
            const templateText = templateLang === 'hi' ? rem.suggestedMessage.hi : rem.suggestedMessage.en;
            const isCompleted = rem.status === 'Completed';

            return (
              <div
                key={rem.id}
                className={`bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4 transition ${
                  isCompleted ? 'opacity-60 bg-slate-50/50' : 'hover:border-slate-300'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-extrabold text-base text-slate-900">
                        {rem.company}
                      </span>
                      <ReminderBadge status={rem.status} />
                    </div>
                    <p className="text-xs font-medium text-slate-600">
                      Role: <strong>{rem.jobTitle}</strong> · Applied: {rem.applicationDate} ({rem.daysSinceApplication} {t('daysSince')})
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenApp(rem.applicationId)}
                      className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg border border-indigo-100 flex items-center gap-1 transition"
                    >
                      <span>App Record</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Pre-composed Polite Follow-up Email Template */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                      {t('suggestedTemplate')} ({templateLang.toUpperCase()})
                    </span>
                    <button
                      onClick={() => handleCopyMessage(templateText)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 px-2 py-0.5 rounded hover:bg-indigo-100/50 transition"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{t('copy')}</span>
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                    {templateText}
                  </pre>
                </div>

                {/* Bottom Actions: Mark Completed, Snooze, Dismiss */}
                {!isCompleted && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-slate-400">
                      {t('dueDate')}: <strong>{rem.dueDate}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      {/* Snooze Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setSnoozeOpenId(snoozeOpenId === rem.id ? null : rem.id)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition flex items-center gap-1"
                        >
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{t('snooze')}</span>
                          <ChevronDown className="w-3 h-3" />
                        </button>

                        {snoozeOpenId === rem.id && (
                          <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-20 text-xs">
                            <button
                              onClick={() => {
                                snoozeReminder(rem.id, 1);
                                setSnoozeOpenId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                            >
                              {t('snooze1Day')}
                            </button>
                            <button
                              onClick={() => {
                                snoozeReminder(rem.id, 3);
                                setSnoozeOpenId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                            >
                              {t('snooze3Days')}
                            </button>
                            <button
                              onClick={() => {
                                snoozeReminder(rem.id, 7);
                                setSnoozeOpenId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                            >
                              {t('snooze7Days')}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Dismiss */}
                      <button
                        onClick={() => dismissReminder(rem.id)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-medium transition"
                      >
                        {t('dismiss')}
                      </button>

                      {/* Mark Completed */}
                      <button
                        onClick={() => markReminderCompleted(rem.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t('markCompleted')}</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
