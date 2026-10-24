import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, RiskBadge } from '../common/Badge';
import { 
  Building2, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Sparkles, 
  TrendingUp, 
  ArrowUpRight, 
  FileText, 
  Plus, 
  Download, 
  Mail,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';

interface OverviewPageProps {
  onOpenAddModal: () => void;
  onOpenPasteModal: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onOpenAddModal, onOpenPasteModal }) => {
  const { 
    applications, 
    emails, 
    reminders, 
    t, 
    language, 
    setActiveTab, 
    setSelectedEmailId, 
    setSelectedAppId,
    analyseEmails,
    isAnalysing 
  } = useApp();

  // Metrics calculation
  const totalApps = applications.length;
  const awaitingCount = applications.filter((a) => a.status === 'Applied' || a.status === 'No Response').length;
  const interviewCount = applications.filter((a) => a.status === 'Interview').length;
  const offerCount = applications.filter((a) => a.status === 'Offer').length;
  const rejectionCount = applications.filter((a) => a.status === 'Rejected').length;
  const scamCount = emails.filter((e) => e.scamAssessment.riskLevel === 'HIGH' || e.scamAssessment.riskLevel === 'MEDIUM').length;

  // Chart data: Status distribution
  const statusCounts: Record<string, number> = {};
  applications.forEach((a) => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  });

  const pieData = Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status]
  }));

  const STATUS_COLORS: Record<string, string> = {
    'Applied': '#6366f1',
    'Assessment': '#a855f7',
    'Interview': '#f59e0b',
    'Offer': '#10b981',
    'Rejected': '#f43f5e',
    'Withdrawn': '#94a3b8',
    'No Response': '#fb923c'
  };

  // Weekly Activity Mock/Dynamic from emails/apps
  const weeklyData = [
    { week: 'Week 1', apps: 3, interviews: 0, offers: 0 },
    { week: 'Week 2', apps: 5, interviews: 1, offers: 0 },
    { week: 'Week 3', apps: 4, interviews: 2, offers: 0 },
    { week: 'This Week', apps: totalApps > 0 ? Math.min(totalApps, 6) : 2, interviews: interviewCount, offers: offerCount }
  ];

  // Recent Scam Alerts
  const recentScams = emails
    .filter((e) => e.scamAssessment.riskLevel === 'HIGH' || e.scamAssessment.riskLevel === 'MEDIUM')
    .slice(0, 3);

  // Recent Recruiter Updates
  const recentEmails = [...emails]
    .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())
    .slice(0, 4);

  // Active Overdue / Today Reminders
  const activeReminders = reminders
    .filter((r) => r.status === 'Overdue' || r.status === 'Due Today')
    .slice(0, 3);

  const handleOpenEmail = (emailId: string) => {
    setSelectedEmailId(emailId);
    setActiveTab('inbox');
  };

  const handleOpenApp = (appId: string) => {
    setSelectedAppId(appId);
    setActiveTab('tracker');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Welcome Banner & Quick Action */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl shadow-indigo-950/20">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              02 · AUTOMATION · Job Hunt Autopilot
            </span>
            <span className="text-[11px] text-slate-300 font-medium italic">
              Track every application. Catch every fake offer.
            </span>
          </div>

          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
            {language === 'hi'
              ? 'तालटैलेंट (TaalTalent) — ले-ऑफ रिकवरी एवं नौकरी आवेदन ऑटोपायलट'
              : 'TaalTalent — Layoff Recovery & Job Hunt Autopilot'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {language === 'hi'
              ? 'ले-ऑफ के बाद 100+ पदों पर आवेदन करने वाले उम्मीदवारों के लिए निर्मित। 20-ईमेल इनबॉक्स से स्वतः अद्यतन होने वाला ट्रैकर (Applied, Interview, Rejected, Offer), लाल रंग में चिह्नित धोखाधड़ी चेतावनी और 7 दिनों तक कोई जवाब न मिलने पर स्वचालित फॉलो-अप रिमाइंडर।'
              : 'Built for laid-off professionals and active job seekers managing 100+ applications. Converts a 20-email sample inbox into a self-updating tracker (applied, interview, rejected, offer), flags fake offers in red with evidence, and schedules follow-up reminders after 7 days of no reply.'}
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              onClick={analyseEmails}
              disabled={isAnalysing}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalysing ? t('analysing') : t('analyseEmails')}</span>
            </button>

            <a
              href="/sample_inbox.json"
              download="sample_inbox.json"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/15 flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-300" />
              <span>Download sample_inbox.json</span>
            </a>

            <button
              onClick={onOpenPasteModal}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/15 flex items-center gap-1.5 transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t('pasteEmail')}</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/15 flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('addApplication')}</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-indigo-500/10 via-blue-500/5 to-transparent pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
      </div>

      {/* 6 Key Performance Indicator (KPI) Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Total Apps */}
        <div 
          onClick={() => setActiveTab('tracker')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {t('totalApplications')}
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading font-extrabold text-2xl text-slate-900 mt-2">
            {totalApps}
          </p>
          <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            Across 20 emails
          </span>
        </div>

        {/* Awaiting Response */}
        <div 
          onClick={() => setActiveTab('tracker')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {t('awaitingResponse')}
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading font-extrabold text-2xl text-slate-900 mt-2">
            {awaitingCount}
          </p>
          <span className="text-[10px] text-blue-600 font-semibold mt-1 block">
            Needs review
          </span>
        </div>

        {/* Interviews */}
        <div 
          onClick={() => setActiveTab('tracker')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {t('interviewsScheduled')}
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading font-extrabold text-2xl text-amber-600 mt-2">
            {interviewCount}
          </p>
          <span className="text-[10px] text-amber-700 font-semibold mt-1 block">
            Upcoming rounds
          </span>
        </div>

        {/* Offers */}
        <div 
          onClick={() => setActiveTab('tracker')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {t('offersReceived')}
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading font-extrabold text-2xl text-emerald-600 mt-2">
            {offerCount}
          </p>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
            High milestone 🎉
          </span>
        </div>

        {/* Rejections */}
        <div 
          onClick={() => setActiveTab('tracker')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-rose-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {t('rejections')}
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition">
              <TrendingUp className="w-4 h-4 rotate-180" />
            </div>
          </div>
          <p className="font-heading font-extrabold text-2xl text-slate-700 mt-2">
            {rejectionCount}
          </p>
          <span className="text-[10px] text-slate-400 font-medium mt-1 block">
            Logged & archived
          </span>
        </div>

        {/* Potential Scams */}
        <div 
          onClick={() => setActiveTab('scam')}
          className="bg-white p-4 rounded-2xl border border-rose-200 shadow-sm hover:shadow-md hover:border-rose-400 transition cursor-pointer group bg-gradient-to-b from-rose-50/30 to-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
              {t('potentialScams')}
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-110 transition">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading font-extrabold text-2xl text-rose-600 mt-2">
            {scamCount}
          </p>
          <span className="text-[10px] text-rose-600 font-bold mt-1 block animate-pulse">
            Fraud intercepted
          </span>
        </div>

      </div>

      {/* Visual Analytics Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Status Distribution Donut */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-800">
                {t('statusDistribution')}
              </h3>
              <p className="text-[11px] text-slate-400">
                Current applicant pipeline allocation
              </p>
            </div>
            <button
              onClick={() => setActiveTab('tracker')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>{t('viewAll')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-60 flex items-center justify-center">
            {pieData.length === 0 ? (
              <p className="text-xs text-slate-400">{t('noActivityYet')}</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={STATUS_COLORS[entry.name] || '#6366f1'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => {
                      const count = Number(value);
                      const pct = totalApps > 0 ? ((count / totalApps) * 100).toFixed(1) : '0';
                      return [`${count} applications (${pct}%)`, name];
                    }}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Custom Legend with Percentages */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 border-t border-slate-100 text-xs">
            {pieData.map((d) => {
              const pct = totalApps > 0 ? Math.round((d.value / totalApps) * 100) : 0;
              return (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[d.name] || '#6366f1' }}
                  />
                  <span className="text-slate-600 font-medium">{d.name}</span>
                  <span className="text-slate-900 font-bold">({d.value} • {pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Activity Bar Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-800">
                {t('weeklyActivity')}
              </h3>
              <p className="text-[11px] text-slate-400">
                Applications submitted vs. interviews scheduled
              </p>
            </div>
            <button
              onClick={() => setActiveTab('analytics')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Analytics</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="apps" name="Applications" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="interviews" name="Interviews" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 3 Detail Columns: Upcoming Interviews & Follow-ups, Recent Recruiter Updates, Scam Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Upcoming Follow-ups & Interviews */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h3 className="font-heading font-bold text-sm text-slate-800">
                {t('upcomingInterviews')}
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('reminders')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              {t('viewAll')}
            </button>
          </div>

          {activeReminders.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No overdue follow-ups right now.
            </p>
          ) : (
            <div className="space-y-2.5">
              {activeReminders.map((rem) => (
                <div
                  key={rem.id}
                  onClick={() => setActiveTab('reminders')}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/70 hover:border-indigo-200 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{rem.company}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rem.status === 'Overdue' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rem.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">{rem.jobTitle}</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {rem.daysSinceApplication} {t('daysAgo')} (7-day rule)
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Recent Recruiter Responses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-600" />
              <h3 className="font-heading font-bold text-sm text-slate-800">
                {t('recentResponses')}
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('inbox')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              {t('viewAll')}
            </button>
          </div>

          <div className="space-y-2.5">
            {recentEmails.map((em) => (
              <div
                key={em.id}
                onClick={() => handleOpenEmail(em.id)}
                className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/70 hover:border-indigo-200 transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[140px]">{em.company}</span>
                  <span className="text-[10px] font-semibold text-slate-500">
                    {em.receivedAt.split('T')[0]}
                  </span>
                </div>
                <p className="text-[11px] text-indigo-700 font-medium mt-0.5 truncate">{em.subject}</p>
                <div className="flex items-center justify-between mt-1 text-[10px]">
                  <span className="text-slate-400">{em.classification}</span>
                  <RiskBadge level={em.scamAssessment.riskLevel} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Recent Scam Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h3 className="font-heading font-bold text-sm text-slate-800">
                {t('recentScamAlerts')}
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('scam')}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
            >
              {t('viewAll')}
            </button>
          </div>

          <div className="space-y-2.5">
            {recentScams.map((scam) => (
              <div
                key={scam.id}
                onClick={() => {
                  setSelectedEmailId(scam.id);
                  setActiveTab('scam');
                }}
                className="p-3 rounded-xl bg-rose-50/50 hover:bg-rose-100/60 border border-rose-200 transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{scam.company}</span>
                  <RiskBadge level={scam.scamAssessment.riskLevel} score={scam.scamAssessment.riskScore} />
                </div>
                <p className="text-[11px] text-rose-800 font-medium mt-0.5 line-clamp-1">
                  {scam.subject}
                </p>
                <p className="text-[10px] text-slate-600 mt-1 line-clamp-2">
                  {scam.scamAssessment.reasons[0] || 'Advance fee or phishing markers found'}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
