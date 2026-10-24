export type ApplicationStatus = 
  | 'Applied'
  | 'Assessment'
  | 'Interview'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn'
  | 'No Response';

export type ScamRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type EmailClassification =
  | 'Application Confirmation'
  | 'Recruiter Response'
  | 'Interview Invitation'
  | 'Interview Update'
  | 'Rejection'
  | 'Job Offer'
  | 'Request for Information'
  | 'Follow-up'
  | 'Potential Scam'
  | 'Other';

export type ReminderStatus = 'Upcoming' | 'Due Today' | 'Overdue' | 'Completed' | 'Dismissed';

export interface ScamAssessment {
  riskLevel: ScamRiskLevel;
  riskScore: number; // 0 to 100
  reasons: string[];
  reasonsHi?: string[];
  evidence: string[];
  recommendedActions: string[];
  recommendedActionsHi?: string[];
  reviewed: boolean;
  userCorrection?: 'CONFIRMED_SCAM' | 'NOT_A_SCAM' | 'FALSE_POSITIVE' | null;
  suspiciousPhrases: string[];
}

export interface Email {
  id: string;
  senderName: string;
  senderEmail: string;
  company: string;
  jobTitle: string;
  subject: string;
  body: string;
  receivedAt: string; // ISO date string e.g. "2026-10-20T10:30:00Z"
  classification: EmailClassification;
  linkedApplicationId?: string;
  scamAssessment: ScamAssessment;
  summary: string;
  summaryHi?: string;
  isRead: boolean;
  isStarred?: boolean;
}

export interface ApplicationHistoryItem {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'status_change' | 'email_received' | 'followup_sent' | 'note_added';
}

export type UserRole = 'admin' | 'user';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Application {
  id: string;
  company: string;
  jobTitle: string;
  location?: string;
  salary?: string;
  applicationDate: string; // ISO date string
  status: ApplicationStatus;
  approvalStatus?: ApprovalStatus;
  submittedBy?: string;
  approvalNotes?: string;
  lastMeaningfulResponseAt?: string;
  nextFollowUpAt?: string;
  recruiterEmail?: string;
  recruiterName?: string;
  notes?: string;
  emailIds: string[];
  scamRisk: ScamRiskLevel;
  interviewDate?: string;
  history: ApplicationHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  applicationId: string;
  company: string;
  jobTitle: string;
  applicationDate: string;
  daysSinceApplication: number;
  dueDate: string;
  status: ReminderStatus;
  suggestedMessage: {
    en: string;
    hi: string;
  };
  createdAt: string;
  completedAt?: string;
  snoozedUntil?: string;
}

export interface NotificationItem {
  id: string;
  type: 'interview' | 'scam' | 'followup' | 'system';
  titleEn: string;
  titleHi: string;
  messageEn: string;
  messageHi: string;
  timestamp: string;
  read: boolean;
  dismissed: boolean;
  linkedId?: string;
  viewTarget?: 'inbox' | 'tracker' | 'scam' | 'reminders';
}

export type Language = 'en' | 'hi';
export type ActiveTab = 'overview' | 'inbox' | 'tracker' | 'scam' | 'reminders' | 'analytics' | 'settings';
