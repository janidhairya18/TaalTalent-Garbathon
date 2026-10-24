import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStatus } from '../../types';
import { StatusBadge, RiskBadge, ApprovalBadge } from '../common/Badge';
import { 
  Kanban, 
  Table as TableIcon, 
  Search, 
  Plus, 
  Download, 
  Eye, 
  Edit2, 
  Trash2, 
  Clock, 
  Calendar, 
  Building2, 
  Briefcase, 
  ArrowUpDown, 
  ChevronRight,
  Filter,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  UserCheck,
  AlertCircle
} from 'lucide-react';

interface TrackerPageProps {
  onOpenAddModal: () => void;
  onOpenEditModal: (app: Application) => void;
  onOpenDetailModal: (app: Application) => void;
}

export const TrackerPage: React.FC<TrackerPageProps> = ({
  onOpenAddModal,
  onOpenEditModal,
  onOpenDetailModal
}) => {
  const { 
    applications, 
    deleteApplication, 
    updateApplication, 
    currentUser,
    approveApplication,
    rejectApplication,
    t, 
    language, 
    showToast 
  } = useApp();

  const isAdmin = currentUser?.role === 'admin';

  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [approvalFilter, setApprovalFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'company' | 'followup'>('newest');

  const pendingApps = applications.filter((a) => a.approvalStatus === 'pending');

  // Filter & Sort
  const filteredApps = applications.filter((app) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      app.company.toLowerCase().includes(q) || 
      app.jobTitle.toLowerCase().includes(q) ||
      (app.location && app.location.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchesRisk = riskFilter === 'ALL' || app.scamRisk === riskFilter;
    const matchesApproval = 
      approvalFilter === 'ALL' 
        ? true 
        : approvalFilter === 'PENDING' 
        ? app.approvalStatus === 'pending' 
        : app.approvalStatus !== 'pending';

    return matchesSearch && matchesStatus && matchesRisk && matchesApproval;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime();
    if (sortBy === 'oldest') return new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime();
    if (sortBy === 'company') return a.company.localeCompare(b.company);
    if (sortBy === 'followup') {
      const aDate = a.nextFollowUpAt || '9999-99-99';
      const bDate = b.nextFollowUpAt || '9999-99-99';
      return aDate.localeCompare(bDate);
    }
    return 0;
  });

  const handleDelete = (app: Application) => {
    if (!isAdmin) {
      showToast('Only admins can delete applications.', 'warning');
      return;
    }
    if (window.confirm(t('confirmDelete'))) {
      deleteApplication(app.id);
    }
  };

  const handleExportCsv = () => {
    if (applications.length === 0) {
      showToast('No applications to export', 'warning');
      return;
    }

    const headers = ['Company', 'Job Title', 'Status', 'Approval Status', 'Application Date', 'Last Response', 'Scam Risk', 'Location', 'Notes'];
    const rows = applications.map((app) => [
      `"${app.company.replace(/"/g, '""')}"`,
      `"${app.jobTitle.replace(/"/g, '""')}"`,
      `"${app.status}"`,
      `"${app.approvalStatus || 'approved'}"`,
      `"${app.applicationDate}"`,
      `"${app.lastMeaningfulResponseAt ? app.lastMeaningfulResponseAt.split('T')[0] : ''}"`,
      `"${app.scamRisk}"`,
      `"${(app.location || '').replace(/"/g, '""')}"`,
      `"${(app.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `taaltalent_applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(language === 'hi' ? 'सीएसवी सफलतापूर्वक डाउनलोड हुई!' : 'Exported applications to CSV!', 'success');
  };

  const kanbanStatuses: ApplicationStatus[] = [
    'Applied',
    'Assessment',
    'Interview',
    'Offer',
    'Rejected'
  ];

  return (
    <div className="space-y-4 pb-12 w-full">
      
      {/* Admin Approval Queue Notification Banner */}
      {isAdmin && pendingApps.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-amber-950 flex items-center gap-2">
                <span>{pendingApps.length} Candidate Application Request(s) Pending Admin Approval</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-extrabold uppercase">Action Required</span>
              </h3>
              <p className="text-xs text-amber-800">
                Review applicant submitted records. Approve to officially integrate them into the verified tracking pipeline.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setApprovalFilter('PENDING')}
              className="px-3 py-1.5 rounded-xl bg-white text-amber-900 border border-amber-300 hover:bg-amber-100/50 text-xs font-bold transition shadow-sm"
            >
              Filter Pending Queue
            </button>
          </div>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
                <Kanban className="w-5 h-5 text-indigo-600" />
                <span>{t('trackerHeading')}</span>
              </h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                isAdmin ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}>
                {isAdmin ? 'Admin Reviewer Mode' : 'Candidate User Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAdmin 
                ? 'Review candidate submissions, approve applications, and oversee recruitment pipeline.' 
                : 'View verified companies, track application progress, and submit new job applications.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* View Switcher: Table vs. Kanban */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                  viewMode === 'table'
                    ? 'bg-white text-indigo-700 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>{t('tableView')}</span>
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                  viewMode === 'kanban'
                    ? 'bg-white text-indigo-700 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>{t('kanbanView')}</span>
              </button>
            </div>

            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('exportCsv')}</span>
            </button>

            {/* Candidate or Admin can add new application */}
            <button
              onClick={onOpenAddModal}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm shadow-indigo-500/25 flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Add & Pre-Approve' : 'Submit Application'}</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Row */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2 border-t border-slate-100">
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies or roles..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Approval Filter */}
          <div>
            <select
              value={approvalFilter}
              onChange={(e) => setApprovalFilter(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
            >
              <option value="ALL">All Approvals ({applications.length})</option>
              <option value="PENDING">Pending Admin Approval ({pendingApps.length})</option>
              <option value="APPROVED">Approved ({applications.length - pendingApps.length})</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
            >
              <option value="ALL">{t('filterByStatus')}</option>
              <option value="Applied">Applied</option>
              <option value="Assessment">Assessment</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
              <option value="Withdrawn">Withdrawn</option>
              <option value="No Response">No Response</option>
            </select>
          </div>

          <div>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
            >
              <option value="ALL">{t('filterByRisk')}</option>
              <option value="LOW">Low Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="HIGH">High Risk</option>
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
            >
              <option value="newest">{t('sortNewest')}</option>
              <option value="oldest">{t('sortOldest')}</option>
              <option value="company">{t('sortCompany')}</option>
              <option value="followup">{t('sortFollowUp')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Kanban */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden w-full">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">{t('colCompany')}</th>
                  <th className="py-3.5 px-4">Approval</th>
                  <th className="py-3.5 px-4">{t('colDate')}</th>
                  <th className="py-3.5 px-4">{t('colStatus')}</th>
                  <th className="py-3.5 px-4">{t('colLastEmail')}</th>
                  <th className="py-3.5 px-4">{t('colScamRisk')}</th>
                  <th className="py-3.5 px-4 text-right">{t('colActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      {t('noApplicationsFound')}
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-50/80 transition group"
                    >
                      <td className="py-3.5 px-4">
                        <div 
                          onClick={() => onOpenDetailModal(app)}
                          className="cursor-pointer"
                        >
                          <p className="font-heading font-bold text-slate-900 group-hover:text-indigo-600 transition flex items-center gap-1.5">
                            {app.company}
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            {app.jobTitle}
                          </p>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <ApprovalBadge status={app.approvalStatus} />
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {app.applicationDate}
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={app.status} />
                      </td>

                      <td className="py-3.5 px-4 text-slate-500">
                        {app.lastMeaningfulResponseAt ? app.lastMeaningfulResponseAt.split('T')[0] : '—'}
                      </td>

                      <td className="py-3.5 px-4">
                        <RiskBadge level={app.scamRisk} />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Admin Approval Actions for Pending Applications */}
                          {isAdmin && app.approvalStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => approveApplication(app.id)}
                                title="Approve application"
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => rejectApplication(app.id)}
                                title="Decline application"
                                className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-medium text-[11px] transition"
                              >
                                Decline
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => onOpenDetailModal(app)}
                            title={t('viewDetails')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Admin Only Actions */}
                          {isAdmin && (
                            <>
                              <button
                                onClick={() => onOpenEditModal(app)}
                                title={t('edit')}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(app)}
                                title={t('delete')}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}

                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start w-full">
          {kanbanStatuses.map((colStatus) => {
            const colApps = filteredApps.filter((a) => a.status === colStatus);

            return (
              <div
                key={colStatus}
                className="bg-slate-100/70 rounded-2xl border border-slate-200/80 p-3 flex flex-col min-h-[450px]"
              >
                <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={colStatus} />
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {colApps.length}
                  </span>
                </div>

                <div className="space-y-2.5 pt-3 flex-1 overflow-y-auto">
                  {colApps.length === 0 ? (
                    <div className="p-6 text-center text-[11px] text-slate-400 italic">
                      No applications
                    </div>
                  ) : (
                    colApps.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => onOpenDetailModal(app)}
                        className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition cursor-pointer space-y-2"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <p className="font-heading font-bold text-xs text-slate-900 leading-tight">
                            {app.company}
                          </p>
                          <RiskBadge level={app.scamRisk} />
                        </div>

                        <p className="text-[11px] text-slate-600 line-clamp-1">
                          {app.jobTitle}
                        </p>

                        <div className="flex items-center justify-between">
                          <ApprovalBadge status={app.approvalStatus} />
                        </div>

                        {/* Admin 1-Click Approve in Kanban Card */}
                        {isAdmin && app.approvalStatus === 'pending' && (
                          <div 
                            onClick={(e) => e.stopPropagation()} 
                            className="pt-1.5 border-t border-slate-100 flex items-center gap-1.5"
                          >
                            <button
                              onClick={() => approveApplication(app.id)}
                              className="w-full py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center gap-1 shadow-sm transition"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Approve Request</span>
                            </button>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                          <span>{app.applicationDate}</span>
                          <span className="text-indigo-600 font-semibold flex items-center gap-0.5">
                            Details <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
