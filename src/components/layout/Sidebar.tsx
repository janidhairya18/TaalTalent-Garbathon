import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import { 
  LayoutDashboard, 
  Mail, 
  Kanban, 
  ShieldAlert, 
  Clock, 
  BarChart3, 
  Settings, 
  Sparkles, 
  ShieldCheck,
  ChevronRight,
  Flame
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { 
    activeTab, 
    setActiveTab, 
    t, 
    emails, 
    reminders, 
    analyseEmails, 
    isAnalysing, 
    geminiApiKey 
  } = useApp();

  const unreadEmails = emails.filter((e) => !e.isRead).length;
  const highScams = emails.filter((e) => e.scamAssessment.riskLevel === 'HIGH' && !e.scamAssessment.reviewed).length;
  const overdueReminders = reminders.filter((r) => r.status === 'Overdue' || r.status === 'Due Today').length;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    {
      id: 'overview',
      label: t('navOverview'),
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'inbox',
      label: t('navInbox'),
      icon: <Mail className="w-5 h-5" />,
      badge: unreadEmails > 0 ? unreadEmails : undefined,
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 'tracker',
      label: t('navTracker'),
      icon: <Kanban className="w-5 h-5" />,
    },
    {
      id: 'scam',
      label: t('navScamProtection'),
      icon: <ShieldAlert className="w-5 h-5" />,
      badge: highScams > 0 ? highScams : undefined,
      badgeColor: 'bg-rose-100 text-rose-700 font-bold animate-pulse',
    },
    {
      id: 'reminders',
      label: t('navReminders'),
      icon: <Clock className="w-5 h-5" />,
      badge: overdueReminders > 0 ? overdueReminders : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'analytics',
      label: t('navAnalytics'),
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: t('navSettings'),
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const handleNavClick = (id: ActiveTab) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" 
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:h-[calc(100vh-61px)]`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          
          {/* Main Action Button */}
          <div>
            <button
              onClick={analyseEmails}
              disabled={isAnalysing}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Sparkles className={`w-4 h-4 ${isAnalysing ? 'animate-spin' : 'animate-bounce'}`} />
              <span className="text-sm">
                {isAnalysing ? t('analysing') : t('analyseEmails')}
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-white/20 skew-x-12" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge !== undefined && (
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-indigo-500 lg:hidden" />
                    )}
                  </div>
                </button>
              );
            })}
          </nav>

        </div>

        {/* Footer info: AI status badge & demo notice */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>AI Engine</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              {geminiApiKey ? 'Gemini Live' : 'Deterministic AI'}
            </span>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
            <span>20 Sample Emails</span>
            <span className="text-indigo-600 font-medium">v1.2 Active</span>
          </div>
        </div>

      </aside>
    </>
  );
};
