import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Award, 
  ShieldAlert, 
  CheckCircle2, 
  Calendar,
  Layers,
  Sparkles
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
  CartesianGrid, 
  AreaChart, 
  Area 
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { applications, emails, t, language } = useApp();

  const totalApps = applications.length;
  const interviewCount = applications.filter((a) => a.status === 'Interview').length;
  const offerCount = applications.filter((a) => a.status === 'Offer').length;
  const rejectionCount = applications.filter((a) => a.status === 'Rejected').length;
  const respondedApps = applications.filter((a) => a.status !== 'Applied' && a.status !== 'No Response').length;
  const highScams = emails.filter((e) => e.scamAssessment.riskLevel === 'HIGH').length;
  const mediumScams = emails.filter((e) => e.scamAssessment.riskLevel === 'MEDIUM').length;
  const lowRisk = emails.filter((e) => e.scamAssessment.riskLevel === 'LOW').length;

  const responseRate = totalApps > 0 ? Math.round((respondedApps / totalApps) * 100) : 0;
  const interviewRate = totalApps > 0 ? Math.round((interviewCount / totalApps) * 100) : 0;
  const fraudRate = emails.length > 0 ? Math.round(((highScams + mediumScams) / emails.length) * 100) : 0;

  // Pipeline Funnel Data
  const funnelData = [
    { stage: 'Applied', count: totalApps, fill: '#6366f1' },
    { stage: 'Assessment', count: applications.filter(a => a.status === 'Assessment').length + interviewCount + offerCount, fill: '#818cf8' },
    { stage: 'Interview', count: interviewCount + offerCount, fill: '#f59e0b' },
    { stage: 'Offers', count: offerCount, fill: '#10b981' },
  ];

  // Scam Risk Data
  const scamRiskData = [
    { category: 'High Risk (Scams)', count: highScams, fill: '#f43f5e' },
    { category: 'Medium Risk (Caution)', count: mediumScams, fill: '#f59e0b' },
    { category: 'Low Risk (Legitimate)', count: lowRisk, fill: '#10b981' },
  ];

  // Velocity data
  const velocityData = [
    { period: 'Week 1', applied: 3, responded: 1 },
    { period: 'Week 2', periodName: 'Oct 08-14', applied: 5, responded: 3 },
    { period: 'Week 3', periodName: 'Oct 15-21', applied: 4, responded: 4 },
    { period: 'Current', periodName: 'Oct 22-24', applied: totalApps, responded: respondedApps },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
        <h1 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          <span>{t('analyticsHeading')}</span>
        </h1>
        <p className="text-xs text-slate-500">
          {t('analyticsSubheading')}
        </p>
      </div>

      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              {t('kpiResponseRate')}
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading font-extrabold text-2xl text-slate-900">
            {responseRate}%
          </p>
          <p className="text-[10px] text-slate-400">
            {respondedApps} of {totalApps} applications responded
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              {t('kpiAvgResponseDays')}
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading font-extrabold text-2xl text-slate-900">
            4.2 Days
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold">
            Faster than industry average (8 days)
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              {t('kpiInterviewRate')}
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading font-extrabold text-2xl text-amber-600">
            {interviewRate}%
          </p>
          <p className="text-[10px] text-slate-400">
            {interviewCount} interviews from {totalApps} applied
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-sm space-y-1 bg-rose-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-700 uppercase">
              {t('kpiFraudEncounterRate')}
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading font-extrabold text-2xl text-rose-600">
            {fraudRate}%
          </p>
          <p className="text-[10px] text-rose-600 font-bold">
            {highScams + mediumScams} potential scams intercepted
          </p>
        </div>

      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recruitment Funnel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-800">
              {t('chartStatusFunnel')}
            </h3>
            <p className="text-[11px] text-slate-400">
              Progression from initial application to final offer
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="stage" type="category" stroke="#64748b" fontSize={11} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" name="Candidates / Applications" radius={[0, 6, 6, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`funnel-cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scam Risk Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-800">
              {t('chartScamBreakdown')}
            </h3>
            <p className="text-[11px] text-slate-400">
              Distribution of incoming recruitment emails by verified threat level
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scamRiskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" name="Emails" radius={[6, 6, 0, 0]}>
                  {scamRiskData.map((entry, index) => (
                    <Cell key={`scam-cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
