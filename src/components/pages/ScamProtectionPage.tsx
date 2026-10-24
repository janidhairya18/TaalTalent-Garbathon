import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from '../common/Badge';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Flag, 
  Check, 
  XCircle, 
  ExternalLink, 
  Info, 
  Lock, 
  FileWarning, 
  DollarSign, 
  KeyRound, 
  MessageSquareWarning,
  Eye
} from 'lucide-react';

export const ScamProtectionPage: React.FC = () => {
  const { 
    emails, 
    updateEmailScamStatus, 
    t, 
    language, 
    setSelectedEmailId, 
    setActiveTab, 
    showToast 
  } = useApp();

  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  const highScams = emails.filter((e) => e.scamAssessment.riskLevel === 'HIGH');
  const mediumScams = emails.filter((e) => e.scamAssessment.riskLevel === 'MEDIUM');
  const cleanVerified = emails.filter((e) => e.scamAssessment.riskLevel === 'LOW');

  const filteredEmails = emails.filter((e) => {
    if (filterLevel === 'HIGH') return e.scamAssessment.riskLevel === 'HIGH';
    if (filterLevel === 'MEDIUM') return e.scamAssessment.riskLevel === 'MEDIUM';
    if (filterLevel === 'LOW') return e.scamAssessment.riskLevel === 'LOW';
    if (filterLevel === 'UNREVIEWED') return !e.scamAssessment.reviewed;
    return true;
  }).sort((a, b) => b.scamAssessment.riskScore - a.scamAssessment.riskScore);

  const handleOpenEmail = (emailId: string) => {
    setSelectedEmailId(emailId);
    setActiveTab('inbox');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Disclaimer */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div>
          <h1 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span>{t('scamHeading')}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('scamSubheading')}
          </p>
        </div>

        {/* Ethical Transparency Disclaimer */}
        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block font-bold">Important Candidate Advisory:</strong>
            <span>{t('scamDisclaimer')}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-bold text-rose-900">{t('scamStatsHigh')}</span>
            </div>
            <span className="text-base font-extrabold text-rose-600">{highScams.length}</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-amber-900">{t('scamStatsMedium')}</span>
            </div>
            <span className="text-base font-extrabold text-amber-600">{mediumScams.length}</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-900">{t('scamStatsSafe')}</span>
            </div>
            <span className="text-base font-extrabold text-emerald-600">{cleanVerified.length}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilterLevel('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            filterLevel === 'ALL'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          {t('scamFilterAll')} ({emails.length})
        </button>

        <button
          onClick={() => setFilterLevel('HIGH')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            filterLevel === 'HIGH'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
          }`}
        >
          {t('scamFilterHigh')} ({highScams.length})
        </button>

        <button
          onClick={() => setFilterLevel('MEDIUM')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            filterLevel === 'MEDIUM'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
          }`}
        >
          {t('scamFilterMedium')} ({mediumScams.length})
        </button>

        <button
          onClick={() => setFilterLevel('LOW')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            filterLevel === 'LOW'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
          }`}
        >
          {t('scamFilterLow')} ({cleanVerified.length})
        </button>

        <button
          onClick={() => setFilterLevel('UNREVIEWED')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            filterLevel === 'UNREVIEWED'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          {t('scamFilterUnreviewed')}
        </button>
      </div>

      {/* List of Fraud & Risk Assessments */}
      <div className="space-y-4">
        {filteredEmails.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            {t('noScamsFound')}
          </div>
        ) : (
          filteredEmails.map((em) => {
            const assessment = em.scamAssessment;
            const isHigh = assessment.riskLevel === 'HIGH';
            const isMedium = assessment.riskLevel === 'MEDIUM';

            return (
              <div
                key={em.id}
                className={`bg-white rounded-2xl border p-5 shadow-sm space-y-4 transition-all ${
                  isHigh
                    ? 'border-rose-300 ring-1 ring-rose-200 bg-gradient-to-b from-rose-50/20 to-white'
                    : isMedium
                    ? 'border-amber-300 bg-gradient-to-b from-amber-50/20 to-white'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-extrabold text-base text-slate-900">
                        {em.company}
                      </span>
                      <RiskBadge level={assessment.riskLevel} score={assessment.riskScore} />
                      {assessment.reviewed && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          ✓ Reviewed
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-600">
                      Subject: <strong>{em.subject}</strong> · From: &lt;{em.senderEmail}&gt;
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenEmail(em.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 flex items-center gap-1 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Email</span>
                    </button>
                  </div>
                </div>

                {/* Risk Score Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">Calculated Risk Score</span>
                    <span className={isHigh ? 'text-rose-600' : isMedium ? 'text-amber-600' : 'text-emerald-600'}>
                      {assessment.riskScore} / 100
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isHigh ? 'bg-rose-500' : isMedium ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${assessment.riskScore}%` }}
                    />
                  </div>
                </div>

                {/* Plain-Language Reasons (EN / HI) */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    {language === 'hi' ? 'पहचाने गए धोखाधड़ी संकेतक:' : 'Identified Risk Indicators:'}
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {(language === 'hi' && assessment.reasonsHi ? assessment.reasonsHi : assessment.reasons).map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className={`font-bold ${isHigh ? 'text-rose-600' : 'text-amber-600'}`}>•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quoted Evidence */}
                {assessment.evidence.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">
                      {t('suspiciousEvidence')}:
                    </span>
                    <div className="space-y-1.5">
                      {assessment.evidence.map((ev, i) => (
                        <blockquote key={i} className="p-2.5 rounded-lg bg-rose-50 border-l-4 border-rose-500 text-xs text-rose-900 font-mono italic">
                          "{ev}"
                        </blockquote>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Safety Actions */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    {t('recommendedSteps')}:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {(language === 'hi' && assessment.recommendedActionsHi ? assessment.recommendedActionsHi : assessment.recommendedActions).map((act, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* User Verification / Correction Controls */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <span>Candidate feedback:</span>
                    {assessment.userCorrection ? (
                      <strong className="text-indigo-600">
                        {assessment.userCorrection === 'NOT_A_SCAM' ? 'Marked as Not a Scam' : 'Reported Suspicious'}
                      </strong>
                    ) : (
                      <span>Unverified</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateEmailScamStatus(em.id, 'NOT_A_SCAM')}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition flex items-center gap-1"
                    >
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>{t('notAScam')}</span>
                    </button>

                    <button
                      onClick={() => updateEmailScamStatus(em.id, 'CONFIRMED_SCAM')}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-medium transition flex items-center gap-1"
                    >
                      <Flag className="w-3 h-3 text-rose-600" />
                      <span>{t('reportSuspicious')}</span>
                    </button>

                    <button
                      onClick={() => updateEmailScamStatus(em.id, null)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-medium transition"
                    >
                      {t('markReviewed')}
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
