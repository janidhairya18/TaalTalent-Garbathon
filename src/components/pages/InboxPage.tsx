import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Email, EmailClassification, ScamRiskLevel } from '../../types';
import { StatusBadge, RiskBadge } from '../common/Badge';
import { 
  Mail, 
  Search, 
  Filter, 
  RotateCcw, 
  Sparkles, 
  FileText, 
  Upload, 
  ExternalLink, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  Building2,
  RefreshCw
} from 'lucide-react';

interface InboxPageProps {
  onOpenPasteModal: () => void;
}

export const InboxPage: React.FC<InboxPageProps> = ({ onOpenPasteModal }) => {
  const { 
    emails, 
    selectedEmailId, 
    setSelectedEmailId, 
    loadDemoData, 
    analyseEmails, 
    reanalyseSingleEmail, 
    isAnalysing, 
    t, 
    language,
    setActiveTab,
    setSelectedAppId,
    importDataJson
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState<string>('ALL');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [activeViewTab, setActiveViewTab] = useState<'original' | 'ai'>('original');

  // Filtered emails
  const filteredEmails = emails.filter((em) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      em.company.toLowerCase().includes(q) ||
      em.jobTitle.toLowerCase().includes(q) ||
      em.subject.toLowerCase().includes(q) ||
      em.senderName.toLowerCase().includes(q) ||
      em.senderEmail.toLowerCase().includes(q);

    const matchesClass = filterClass === 'ALL' || em.classification === filterClass;
    const matchesRisk = filterRisk === 'ALL' || em.scamAssessment.riskLevel === filterRisk;

    return matchesSearch && matchesClass && matchesRisk;
  });

  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || filteredEmails[0] || null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      importDataJson(content);
    };
    reader.readAsText(file);
  };

  // Helper to highlight suspicious phrases in the body
  const renderHighlightedBody = (body: string, phrases: string[]) => {
    if (!phrases || phrases.length === 0) {
      return <div className="whitespace-pre-wrap font-sans text-xs text-slate-700 leading-relaxed">{body}</div>;
    }

    // Escape regex characters
    const escaped = phrases
      .filter(p => p && p.trim().length > 2)
      .map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    if (escaped.length === 0) {
      return <div className="whitespace-pre-wrap font-sans text-xs text-slate-700 leading-relaxed">{body}</div>;
    }

    const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
    const parts = body.split(regex);

    return (
      <div className="whitespace-pre-wrap font-sans text-xs text-slate-700 leading-relaxed">
        {parts.map((part, i) => {
          const isMatch = phrases.some(p => p.toLowerCase() === part.toLowerCase());
          if (isMatch) {
            return (
              <mark key={i} className="bg-rose-100 text-rose-900 font-semibold px-1 py-0.5 rounded border border-rose-200">
                {part}
              </mark>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </div>
    );
  };

  const classifications: EmailClassification[] = [
    'Application Confirmation',
    'Recruiter Response',
    'Interview Invitation',
    'Interview Update',
    'Rejection',
    'Job Offer',
    'Request for Information',
    'Follow-up',
    'Potential Scam'
  ];

  return (
    <div className="space-y-4 pb-12">
      
      {/* Top Header & Action Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-600" />
              <span>{t('inboxHeading')}</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('inboxSubheading')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={loadDemoData}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('loadDemoData')}</span>
            </button>

            <button
              onClick={onOpenPasteModal}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t('pasteEmail')}</span>
            </button>

            <label className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Import JSON / .mbox</span>
              <input type="file" accept=".json,.csv,.mbox,text/plain" onChange={handleFileUpload} className="hidden" />
            </label>

            <a
              href="/sample_inbox.json"
              download="sample_inbox.json"
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-medium flex items-center gap-1 transition"
              title="Download sample inbox JSON starter"
            >
              <span>Starter JSON</span>
            </a>

            <button
              onClick={analyseEmails}
              disabled={isAnalysing}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAnalysing ? t('analysing') : t('analyseEmails')}</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter company, role, sender..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
            >
              <option value="ALL">All Classifications ({emails.length})</option>
              {classifications.map((cl) => (
                <option key={cl} value={cl}>
                  {cl}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
            >
              <option value="ALL">All Scam Risk Levels</option>
              <option value="HIGH">High Risk (Scams Flagged)</option>
              <option value="MEDIUM">Medium Risk (Caution)</option>
              <option value="LOW">Low Risk (Verified Safe)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Email List on Left, Email Reader on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Email List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col max-h-[750px]">
          <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600 font-semibold">
            <span>{filteredEmails.length} {t('emailsCount')}</span>
            <span className="text-[11px] text-slate-400">Click to preview</span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {filteredEmails.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-xs">
                No emails match your filter criteria.
              </div>
            ) : (
              filteredEmails.map((em) => {
                const isSelected = selectedEmail?.id === em.id;
                const isScam = em.scamAssessment.riskLevel === 'HIGH';

                return (
                  <div
                    key={em.id}
                    onClick={() => setSelectedEmailId(em.id)}
                    className={`p-3.5 cursor-pointer transition relative flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-50/80 border-l-4 border-l-indigo-600'
                        : isScam
                        ? 'bg-rose-50/20 hover:bg-rose-50/50'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-heading font-bold text-xs text-slate-900 truncate">
                          {em.company}
                        </span>
                        <span className="text-[11px] text-slate-400">·</span>
                        <span className="text-[11px] text-slate-500 truncate">
                          {em.jobTitle}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                        {em.receivedAt.split('T')[0]}
                      </span>
                    </div>

                    <p className={`text-xs truncate ${isSelected ? 'font-bold text-indigo-900' : 'font-medium text-slate-800'}`}>
                      {em.subject}
                    </p>

                    <div className="flex items-center justify-between pt-0.5 text-[10px]">
                      <span className="text-slate-500 font-medium">
                        {em.classification}
                      </span>
                      <RiskBadge level={em.scamAssessment.riskLevel} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Email Detail & AI Findings */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col min-h-[500px]">
          {selectedEmail ? (
            <div className="flex flex-col h-full">
              
              {/* Header Bar */}
              <div className="p-5 border-b border-slate-100 space-y-3 bg-slate-50/50">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-extrabold text-base text-slate-900">
                      {selectedEmail.company}
                    </span>
                    <RiskBadge 
                      level={selectedEmail.scamAssessment.riskLevel} 
                      score={selectedEmail.scamAssessment.riskScore} 
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => reanalyseSingleEmail(selectedEmail.id)}
                      className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-lg flex items-center gap-1 transition"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{t('reanalyse')}</span>
                    </button>
                  </div>
                </div>

                <h2 className="font-heading font-bold text-sm text-slate-800">
                  {selectedEmail.subject}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <strong>{selectedEmail.senderName}</strong> &lt;{selectedEmail.senderEmail}&gt;
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {selectedEmail.receivedAt.replace('T', ' ').slice(0, 16)} UTC
                  </span>
                </div>

                {/* View Tabs: Original vs. AI Analysis */}
                <div className="flex items-center gap-1 pt-2">
                  <button
                    onClick={() => setActiveViewTab('original')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                      activeViewTab === 'original'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t('originalTab')}
                  </button>
                  <button
                    onClick={() => setActiveViewTab('ai')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                      activeViewTab === 'ai'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t('aiAnalysisTab')}</span>
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6 overflow-y-auto flex-1">
                {activeViewTab === 'original' ? (
                  <div className="space-y-4">
                    {selectedEmail.scamAssessment.suspiciousPhrases.length > 0 && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block">Suspicious Phrases Highlighted:</strong>
                          <span>We flagged trigger phrases below associated with advance fee demands or unverified credentials.</span>
                        </div>
                      </div>
                    )}

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      {renderHighlightedBody(selectedEmail.body, selectedEmail.scamAssessment.suspiciousPhrases)}
                    </div>
                  </div>
                ) : (
                  /* AI Analysis Tab */
                  <div className="space-y-5">
                    
                    {/* Summary Card */}
                    <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          AI Summary & Extraction
                        </span>
                        <StatusBadge status={selectedEmail.classification === 'Job Offer' ? 'Offer' : selectedEmail.classification === 'Interview Invitation' ? 'Interview' : selectedEmail.classification === 'Rejection' ? 'Rejected' : 'Applied'} />
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {language === 'hi' && selectedEmail.summaryHi ? selectedEmail.summaryHi : selectedEmail.summary}
                      </p>
                    </div>

                    {/* Scam Risk Score Meter */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{t('riskScore')}</span>
                        <span className={`font-extrabold ${
                          selectedEmail.scamAssessment.riskScore > 60 ? 'text-rose-600' : selectedEmail.scamAssessment.riskScore > 30 ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          {selectedEmail.scamAssessment.riskScore} / 100 ({selectedEmail.scamAssessment.riskLevel})
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            selectedEmail.scamAssessment.riskScore > 60
                              ? 'bg-rose-500'
                              : selectedEmail.scamAssessment.riskScore > 30
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${selectedEmail.scamAssessment.riskScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Transparent Reasons */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        {language === 'hi' ? 'मूल्यांकन कारण:' : 'Evaluation Reasons:'}
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {(language === 'hi' && selectedEmail.scamAssessment.reasonsHi ? selectedEmail.scamAssessment.reasonsHi : selectedEmail.scamAssessment.reasons).map((r, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Quoted Evidence */}
                    {selectedEmail.scamAssessment.evidence.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                          {t('suspiciousEvidence')}:
                        </h4>
                        <div className="space-y-1.5">
                          {selectedEmail.scamAssessment.evidence.map((ev, i) => (
                            <blockquote key={i} className="p-2.5 rounded-lg bg-rose-50 border-l-4 border-rose-500 text-xs text-rose-900 font-mono italic">
                              "{ev}"
                            </blockquote>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommended Next Steps */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        {t('recommendedSteps')}:
                      </h4>
                      <div className="space-y-1.5">
                        {(language === 'hi' && selectedEmail.scamAssessment.recommendedActionsHi ? selectedEmail.scamAssessment.recommendedActionsHi : selectedEmail.scamAssessment.recommendedActions).map((act, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span>{act}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Linked Application Link */}
                    {selectedEmail.linkedApplicationId && (
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          {t('linkedApplication')}: <strong>{selectedEmail.company}</strong>
                        </span>
                        <button
                          onClick={() => {
                            setSelectedAppId(selectedEmail.linkedApplicationId || null);
                            setActiveTab('tracker');
                          }}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          <span>View in Tracker</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs m-auto">
              <Mail className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              {t('noEmailSelected')}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
