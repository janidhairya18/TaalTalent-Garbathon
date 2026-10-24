import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Application, 
  Email, 
  Language, 
  NotificationItem, 
  Reminder, 
  ActiveTab,
  ScamRiskLevel 
} from '../types';
import { SAMPLE_EMAILS } from '../data/sampleEmails';
import { 
  processEmailsIntoApplications, 
  generateFollowUpReminders, 
  generateNotifications 
} from '../services/emailProcessor';
import { analyzeEmailLocally, analyzeEmailWithGemini } from '../services/aiService';
import { translations, getTranslation } from '../locales/translations';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  emails: Email[];
  applications: Application[];
  reminders: Reminder[];
  notifications: NotificationItem[];
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  isAnalysing: boolean;
  analysisProgress: { step: number; total: number; message: string };
  globalSearch: string;
  setGlobalSearch: (s: string) => void;
  selectedEmailId: string | null;
  setSelectedEmailId: (id: string | null) => void;
  selectedAppId: string | null;
  setSelectedAppId: (id: string | null) => void;
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;

  currentUser: import('../types').AuthUser | null;
  login: (email: string, role: import('../types').UserRole, name?: string) => void;
  logout: () => void;
  switchRole: (role: import('../types').UserRole) => void;
  approveApplication: (appId: string) => void;
  rejectApplication: (appId: string, reason?: string) => void;

  // Actions
  loadDemoData: () => void;
  resetDemoData: () => void;
  analyseEmails: () => Promise<void>;
  reanalyseSingleEmail: (emailId: string) => Promise<void>;
  addPastedEmail: (emailData: { subject: string; body: string; senderEmail?: string; senderName?: string; company?: string; jobTitle?: string }) => Promise<void>;
  updateEmailScamStatus: (emailId: string, correction: 'CONFIRMED_SCAM' | 'NOT_A_SCAM' | 'FALSE_POSITIVE' | null) => void;
  
  // Application Actions
  addApplication: (appData: Omit<Application, 'id' | 'createdAt' | 'updatedAt' | 'history'>) => void;
  updateApplication: (app: Application) => void;
  deleteApplication: (appId: string) => void;

  // Reminder Actions
  markReminderCompleted: (reminderId: string) => void;
  snoozeReminder: (reminderId: string, days: number) => void;
  dismissReminder: (reminderId: string) => void;

  // Notification Actions
  markNotificationRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Clear & Export
  purgeAllData: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonStr: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  EMAILS: 'jobshield_emails_v1',
  APPLICATIONS: 'jobshield_applications_v1',
  REMINDERS: 'jobshield_reminders_v1',
  NOTIFICATIONS: 'jobshield_notifications_v1',
  LANG: 'jobshield_language_v1',
  API_KEY: 'jobshield_gemini_key_v1',
  INITIALIZED: 'jobshield_initialized_v1',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'en';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [geminiApiKey, setGeminiApiKeyState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
  });

  const [emails, setEmails] = useState<Email[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EMAILS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return SAMPLE_EMAILS;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    // Initial extraction from sample emails
    return processEmailsIntoApplications(SAMPLE_EMAILS);
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    const initialApps = processEmailsIntoApplications(SAMPLE_EMAILS);
    return generateFollowUpReminders(initialApps);
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    const initialApps = processEmailsIntoApplications(SAMPLE_EMAILS);
    const initialRems = generateFollowUpReminders(initialApps);
    return generateNotifications(SAMPLE_EMAILS, initialRems);
  });

  const [currentUser, setCurrentUser] = useState<import('../types').AuthUser | null>(() => {
    const saved = localStorage.getItem('jobshield_auth_user_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    // Default logged in as user (can switch to admin anytime)
    return { id: 'usr-1', name: 'Candidate User', email: 'candidate@taaltalent.com', role: 'user' };
  });

  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(SAMPLE_EMAILS[0]?.id || null);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState({ step: 0, total: 4, message: '' });
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Auth Actions
  const login = (email: string, role: import('../types').UserRole, name?: string) => {
    const user: import('../types').AuthUser = {
      id: `usr-${Date.now()}`,
      name: name || (role === 'admin' ? 'Admin Reviewer' : 'Candidate'),
      email,
      role
    };
    setCurrentUser(user);
    localStorage.setItem('jobshield_auth_user_v1', JSON.stringify(user));
    showToast(
      language === 'hi' 
        ? `${role === 'admin' ? 'एडमिन' : 'उम्मीदवार'} के रूप में लॉगिन सफल!` 
        : `Signed in successfully as ${role === 'admin' ? 'HR Admin' : 'Candidate User'}!`, 
      'success'
    );
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('jobshield_auth_user_v1');
    showToast(language === 'hi' ? 'लॉगआउट सफल' : 'Signed out successfully', 'info');
  };

  const switchRole = (newRole: import('../types').UserRole) => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      role: newRole,
      name: newRole === 'admin' ? 'Admin Reviewer' : 'Candidate User',
      email: newRole === 'admin' ? 'admin@taaltalent.com' : 'candidate@taaltalent.com'
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('jobshield_auth_user_v1', JSON.stringify(updatedUser));
    showToast(
      language === 'hi'
        ? `भूमिका बदली गई: ${newRole === 'admin' ? 'एडमिन' : 'उम्मीदवार'}`
        : `Switched role to ${newRole === 'admin' ? 'HR Admin' : 'Candidate User'}`,
      'info'
    );
  };

  // Application Approval Actions
  const approveApplication = (appId: string) => {
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === appId) {
          const updated: Application = {
            ...a,
            approvalStatus: 'approved',
            updatedAt: new Date().toISOString(),
            history: [
              ...a.history,
              {
                id: `hist-appr-${Date.now()}`,
                date: new Date().toISOString(),
                title: 'Application Approved by Admin',
                description: 'HR Admin reviewed and approved candidate application into active tracker.',
                type: 'status_change'
              }
            ]
          };
          return updated;
        }
        return a;
      })
    );
    showToast(
      language === 'hi' ? 'आवेदन एडमिन द्वारा स्वीकृत किया गया!' : 'Application approved into active pipeline!',
      'success'
    );
  };

  const rejectApplication = (appId: string, reason?: string) => {
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === appId) {
          return {
            ...a,
            approvalStatus: 'rejected',
            approvalNotes: reason || 'Application request declined by reviewer.',
            updatedAt: new Date().toISOString()
          };
        }
        return a;
      })
    );
    showToast(
      language === 'hi' ? 'आवेदन अस्वीकृत किया गया।' : 'Application request declined.',
      'warning'
    );
  };

  // Persist Language
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  };

  // Persist API Key
  const setGeminiApiKey = (key: string) => {
    setGeminiApiKeyState(key);
    localStorage.setItem(STORAGE_KEYS.API_KEY, key);
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(emails));
  }, [emails]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Toast Helpers
  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const t = (key: keyof typeof translations['en']) => {
    return getTranslation(language, key);
  };

  // Load demo data
  const loadDemoData = () => {
    const freshEmails = [...SAMPLE_EMAILS];
    const freshApps = processEmailsIntoApplications(freshEmails);
    const freshReminders = generateFollowUpReminders(freshApps);
    const freshNotifs = generateNotifications(freshEmails, freshReminders);

    setEmails(freshEmails);
    setApplications(freshApps);
    setReminders(freshReminders);
    setNotifications(freshNotifs);
    setSelectedEmailId(freshEmails[0]?.id || null);
    showToast(language === 'hi' ? '20 नमूना ईमेल और आवेदन लोड किए गए!' : 'Loaded 20 sample recruitment emails and applications!', 'success');
  };

  // Reset demo
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.EMAILS);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.REMINDERS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    loadDemoData();
  };

  // Batch Analyse all emails
  const analyseEmails = async () => {
    setIsAnalysing(true);
    setAnalysisProgress({ step: 1, total: 4, message: language === 'hi' ? 'ईमेल सामग्री और प्रेषकों का विश्लेषण...' : 'Reading email text and sender domains...' });

    // Simulate multi-step pipeline for clear user transparency
    await new Promise((r) => setTimeout(r, 600));

    setAnalysisProgress({ step: 2, total: 4, message: language === 'hi' ? 'भर्ती धोखाधड़ी और भुगतान मांगों की जांच...' : 'Scanning for recruitment fraud, advance fees & OTP phishing...' });
    await new Promise((r) => setTimeout(r, 600));

    setAnalysisProgress({ step: 3, total: 4, message: language === 'hi' ? 'आवेदन रिकॉर्ड्स और टाइमलाइन अपडेट करना...' : 'Deduplicating applications and updating pipeline status...' });

    const updatedEmails = emails.map((em) => {
      const localRes = analyzeEmailLocally(em.body, em.subject, em.senderEmail, em.senderName);
      return {
        ...em,
        company: em.company || localRes.company,
        jobTitle: em.jobTitle || localRes.jobTitle,
        classification: localRes.classification,
        summary: localRes.summary,
        summaryHi: localRes.summaryHi,
        scamAssessment: {
          ...localRes.scamAssessment,
          reviewed: em.scamAssessment.reviewed,
          userCorrection: em.scamAssessment.userCorrection
        }
      };
    });

    const updatedApps = processEmailsIntoApplications(updatedEmails, applications);
    const updatedReminders = generateFollowUpReminders(updatedApps);
    const updatedNotifs = generateNotifications(updatedEmails, updatedReminders);

    await new Promise((r) => setTimeout(r, 500));
    setAnalysisProgress({ step: 4, total: 4, message: language === 'hi' ? '7-दिवसीय फॉलो-अप रिमाइंडर जनरेट किए गए!' : 'Generated 7-day follow-up reminders!' });
    await new Promise((r) => setTimeout(r, 400));

    setEmails(updatedEmails);
    setApplications(updatedApps);
    setReminders(updatedReminders);
    setNotifications(updatedNotifs);
    setIsAnalysing(false);
    showToast(t('analysisCompleteToast'), 'success');
  };

  // Re-analyse a single email
  const reanalyseSingleEmail = async (emailId: string) => {
    const em = emails.find((e) => e.id === emailId);
    if (!em) return;

    showToast(language === 'hi' ? 'ईमेल का एआई से विश्लेषण हो रहा है...' : 'Re-analysing email with AI engine...', 'info');

    let analysisRes;
    if (geminiApiKey) {
      analysisRes = await analyzeEmailWithGemini(geminiApiKey, {
        subject: em.subject,
        body: em.body,
        senderEmail: em.senderEmail,
        senderName: em.senderName
      });
    } else {
      analysisRes = analyzeEmailLocally(em.body, em.subject, em.senderEmail, em.senderName);
    }

    const updatedEmails = emails.map((item) => {
      if (item.id === emailId) {
        return {
          ...item,
          company: analysisRes.company || item.company,
          jobTitle: analysisRes.jobTitle || item.jobTitle,
          classification: analysisRes.classification,
          summary: analysisRes.summary,
          summaryHi: analysisRes.summaryHi,
          scamAssessment: analysisRes.scamAssessment
        };
      }
      return item;
    });

    const updatedApps = processEmailsIntoApplications(updatedEmails, applications);
    const updatedReminders = generateFollowUpReminders(updatedApps);

    setEmails(updatedEmails);
    setApplications(updatedApps);
    setReminders(updatedReminders);

    showToast(language === 'hi' ? 'ईमेल विश्लेषण पूर्ण हुआ!' : 'Email re-analysed successfully!', 'success');
  };

  // Add Pasted Email
  const addPastedEmail = async (emailData: {
    subject: string;
    body: string;
    senderEmail?: string;
    senderName?: string;
    company?: string;
    jobTitle?: string;
  }) => {
    const senderEmail = emailData.senderEmail || 'recruiter@company-talent.com';
    const senderName = emailData.senderName || 'Hiring Coordinator';
    
    let analysisRes;
    if (geminiApiKey) {
      analysisRes = await analyzeEmailWithGemini(geminiApiKey, {
        subject: emailData.subject,
        body: emailData.body,
        senderEmail,
        senderName
      });
    } else {
      analysisRes = analyzeEmailLocally(emailData.body, emailData.subject, senderEmail, senderName);
    }

    const newEmail: Email = {
      id: `em-user-${Date.now()}`,
      senderName,
      senderEmail,
      company: emailData.company || analysisRes.company,
      jobTitle: emailData.jobTitle || analysisRes.jobTitle,
      subject: emailData.subject || 'Recruitment Message',
      body: emailData.body,
      receivedAt: new Date().toISOString(),
      classification: analysisRes.classification,
      summary: analysisRes.summary,
      summaryHi: analysisRes.summaryHi,
      isRead: false,
      scamAssessment: analysisRes.scamAssessment
    };

    const newEmails = [newEmail, ...emails];
    const updatedApps = processEmailsIntoApplications(newEmails, applications);
    const updatedReminders = generateFollowUpReminders(updatedApps);
    const updatedNotifs = generateNotifications(newEmails, updatedReminders);

    setEmails(newEmails);
    setApplications(updatedApps);
    setReminders(updatedReminders);
    setNotifications(updatedNotifs);
    setSelectedEmailId(newEmail.id);

    showToast(
      language === 'hi'
        ? `नया ईमेल जोड़ा गया: ${newEmail.company} (${newEmail.scamAssessment.riskLevel} जोखिम)`
        : `Email processed: ${newEmail.company} (${newEmail.scamAssessment.riskLevel} Risk)`,
      newEmail.scamAssessment.riskLevel === 'HIGH' ? 'warning' : 'success'
    );
  };

  // Scam User Corrections
  const updateEmailScamStatus = (emailId: string, correction: 'CONFIRMED_SCAM' | 'NOT_A_SCAM' | 'FALSE_POSITIVE' | null) => {
    setEmails((prev) =>
      prev.map((em) => {
        if (em.id === emailId) {
          const newLevel: ScamRiskLevel = correction === 'NOT_A_SCAM' ? 'LOW' : correction === 'CONFIRMED_SCAM' ? 'HIGH' : em.scamAssessment.riskLevel;
          const newScore = correction === 'NOT_A_SCAM' ? 5 : correction === 'CONFIRMED_SCAM' ? 95 : em.scamAssessment.riskScore;
          return {
            ...em,
            scamAssessment: {
              ...em.scamAssessment,
              reviewed: true,
              userCorrection: correction,
              riskLevel: newLevel,
              riskScore: newScore
            }
          };
        }
        return em;
      })
    );

    showToast(
      language === 'hi'
        ? 'धोखाधड़ी समीक्षा स्थिति सहेजी गई'
        : 'Scam feedback recorded and review marked complete.',
      'info'
    );
  };

  // Application CRUD
  const addApplication = (appData: Omit<Application, 'id' | 'createdAt' | 'updatedAt' | 'history'>) => {
    const now = new Date().toISOString();
    const isCandidate = currentUser?.role === 'user';
    const newApp: Application = {
      ...appData,
      id: `app-custom-${Date.now()}`,
      approvalStatus: isCandidate ? 'pending' : 'approved',
      submittedBy: currentUser?.name || (isCandidate ? 'Candidate User' : 'HR Admin'),
      createdAt: now,
      updatedAt: now,
      history: [
        {
          id: `hist-${Date.now()}`,
          date: now,
          title: isCandidate ? 'Application Submitted (Pending Approval)' : 'Application Added (Approved)',
          description: isCandidate 
            ? `Candidate logged application for ${appData.jobTitle} at ${appData.company}. Awaiting Admin Approval.` 
            : `HR Admin logged application for ${appData.jobTitle} at ${appData.company}`,
          type: 'status_change'
        }
      ]
    };

    const newApps = [newApp, ...applications];
    setApplications(newApps);
    setReminders(generateFollowUpReminders(newApps));
    showToast(
      isCandidate
        ? (language === 'hi' ? `आवेदन प्रस्तुत! एडमिन अनुमोदन की प्रतीक्षा: ${newApp.company}` : `Application submitted! Pending Admin Approval: ${newApp.company}`)
        : (language === 'hi' ? `नया आवेदन जोड़ा गया: ${newApp.company}` : `Added application for ${newApp.company}`),
      'success'
    );
  };

  const updateApplication = (updatedApp: Application) => {
    setApplications((prev) => {
      const exists = prev.some((a) => a.id === updatedApp.id);
      let nextApps: Application[];
      if (exists) {
        nextApps = prev.map((a) => (a.id === updatedApp.id ? { ...updatedApp, updatedAt: new Date().toISOString() } : a));
      } else {
        nextApps = [updatedApp, ...prev];
      }
      setReminders(generateFollowUpReminders(nextApps));
      return nextApps;
    });
    showToast(language === 'hi' ? 'आवेदन अपडेट किया गया' : 'Application updated successfully', 'success');
  };

  const deleteApplication = (appId: string) => {
    setApplications((prev) => {
      const nextApps = prev.filter((a) => a.id !== appId);
      setReminders(generateFollowUpReminders(nextApps));
      return nextApps;
    });
    showToast(language === 'hi' ? 'आवेदन हटा दिया गया' : 'Application deleted', 'info');
  };

  // Reminder Actions
  const markReminderCompleted = (reminderId: string) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === reminderId
          ? { ...r, status: 'Completed', completedAt: new Date().toISOString() }
          : r
      )
    );
    showToast(language === 'hi' ? 'फॉलो-अप पूर्ण चिह्नित किया गया!' : 'Follow-up marked as completed!', 'success');
  };

  const snoozeReminder = (reminderId: string, days: number) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    setReminders((prev) =>
      prev.map((r) =>
        r.id === reminderId
          ? {
              ...r,
              status: 'Upcoming',
              dueDate: futureDate.toISOString().split('T')[0],
              snoozedUntil: futureDate.toISOString()
            }
          : r
      )
    );
    showToast(language === 'hi' ? `रिमाइंडर ${days} दिन के लिए स्थगित किया गया` : `Reminder snoozed for ${days} days`, 'info');
  };

  const dismissReminder = (reminderId: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === reminderId ? { ...r, status: 'Dismissed' } : r))
    );
    showToast(language === 'hi' ? 'रिमाइंडर खारिज किया गया' : 'Reminder dismissed', 'info');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Purge & Export
  const purgeAllData = () => {
    localStorage.clear();
    setEmails([]);
    setApplications([]);
    setReminders([]);
    setNotifications([]);
    setSelectedEmailId(null);
    setSelectedAppId(null);
    showToast(language === 'hi' ? 'सभी स्थानीय डेटा मिटा दिया गया।' : 'All local data cleared.', 'info');
  };

  const exportDataJson = () => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      emails,
      applications,
      reminders
    };
    return JSON.stringify(backup, null, 2);
  };

  const importDataJson = (contentStr: string): boolean => {
    try {
      const trimmed = contentStr.trim();
      
      // Case 1: .mbox format (plain text email messages separated by "From ")
      if (trimmed.startsWith('From ') || trimmed.includes('\nFrom ')) {
        const rawMessages = trimmed.split(/(?:^|\n)From\s+[^\n]+\n/);
        const importedEmails: Email[] = [];

        rawMessages.forEach((raw, idx) => {
          if (!raw.trim()) return;
          const subjectMatch = raw.match(/^Subject:\s*(.+)$/im);
          const fromMatch = raw.match(/^From:\s*(?:([^<]+)<)?([^>\n]+)>?$/im);
          const dateMatch = raw.match(/^Date:\s*(.+)$/im);
          
          const subject = subjectMatch ? subjectMatch[1].trim() : `Imported Email #${idx + 1}`;
          const senderName = fromMatch && fromMatch[1] ? fromMatch[1].trim() : 'Recruiter';
          const senderEmail = fromMatch && fromMatch[2] ? fromMatch[2].trim() : 'recruiter@company.com';
          const receivedAt = dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString();

          // Body is text after first double newline
          const bodyParts = raw.split(/\r?\n\r?\n/);
          const body = bodyParts.slice(1).join('\n\n').trim() || raw;

          const analysis = analyzeEmailLocally(body, subject, senderEmail, senderName);

          importedEmails.push({
            id: `em-mbox-${Date.now()}-${idx}`,
            senderName,
            senderEmail,
            company: analysis.company,
            jobTitle: analysis.jobTitle,
            subject,
            body,
            receivedAt,
            classification: analysis.classification,
            summary: analysis.summary,
            summaryHi: analysis.summaryHi,
            isRead: false,
            scamAssessment: analysis.scamAssessment
          });
        });

        if (importedEmails.length > 0) {
          const newEmails = [...importedEmails, ...emails];
          const newApps = processEmailsIntoApplications(newEmails, applications);
          const newRems = generateFollowUpReminders(newApps);
          const newNotifs = generateNotifications(newEmails, newRems);

          setEmails(newEmails);
          setApplications(newApps);
          setReminders(newRems);
          setNotifications(newNotifs);
          setSelectedEmailId(importedEmails[0].id);

          showToast(
            language === 'hi'
              ? `${importedEmails.length} .mbox ईमेल आयात किए गए और प्रोसेस हुए!`
              : `Imported & processed ${importedEmails.length} emails from .mbox file!`,
            'success'
          );
          return true;
        }
      }

      // Case 2: JSON format
      const data = JSON.parse(contentStr);

      // Subcase 2A: Plain array of emails (like sample_inbox.json)
      if (Array.isArray(data)) {
        const parsedEmails: Email[] = data.map((item: any, idx: number) => {
          const body = item.body || '';
          const subject = item.subject || 'Recruitment Email';
          const senderEmail = item.from || item.senderEmail || 'recruiter@company.com';
          const senderName = item.senderName || (item.from ? item.from.split('@')[0] : 'Talent Team');
          const receivedAt = item.date 
            ? (item.date.includes('T') ? item.date : `${item.date}T10:00:00Z`)
            : (item.receivedAt || new Date().toISOString());
          const analysis = analyzeEmailLocally(body, subject, senderEmail, senderName);

          return {
            id: String(item.id || `em-json-${Date.now()}-${idx}`),
            senderName,
            senderEmail,
            company: item.company || analysis.company,
            jobTitle: item.jobTitle || analysis.jobTitle,
            subject,
            body,
            receivedAt,
            classification: item.classification || analysis.classification,
            summary: item.summary || analysis.summary,
            summaryHi: item.summaryHi || analysis.summaryHi,
            isRead: item.isRead ?? false,
            scamAssessment: item.scamAssessment || analysis.scamAssessment
          };
        });

        const newApps = processEmailsIntoApplications(parsedEmails, applications);
        const newRems = generateFollowUpReminders(newApps);
        const newNotifs = generateNotifications(parsedEmails, newRems);

        setEmails(parsedEmails);
        setApplications(newApps);
        setReminders(newRems);
        setNotifications(newNotifs);
        setSelectedEmailId(parsedEmails[0]?.id || null);

        showToast(
          language === 'hi'
            ? `${parsedEmails.length} ईमेल आयात एवं विश्लेषण किए गए!`
            : `Loaded & processed ${parsedEmails.length} emails from JSON!`,
          'success'
        );
        return true;
      }

      // Subcase 2B: Full Backup Object
      if (Array.isArray(data.emails)) setEmails(data.emails);
      if (Array.isArray(data.applications)) setApplications(data.applications);
      if (Array.isArray(data.reminders)) setReminders(data.reminders);
      showToast(language === 'hi' ? 'डेटा सफलतापूर्वक पुनर्स्थापित हुआ!' : 'Backup restored successfully!', 'success');
      return true;
    } catch (err) {
      showToast(language === 'hi' ? 'अमान्य JSON अथवा .mbox फ़ाइल!' : 'Invalid JSON or .mbox file format!', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        activeTab,
        setActiveTab,
        emails,
        applications,
        reminders,
        notifications,
        geminiApiKey,
        setGeminiApiKey,
        isAnalysing,
        analysisProgress,
        globalSearch,
        setGlobalSearch,
        selectedEmailId,
        setSelectedEmailId,
        selectedAppId,
        setSelectedAppId,
        currentUser,
        login,
        logout,
        switchRole,
        approveApplication,
        rejectApplication,
        toasts,
        showToast,
        removeToast,
        loadDemoData,
        resetDemoData,
        analyseEmails,
        reanalyseSingleEmail,
        addPastedEmail,
        updateEmailScamStatus,
        addApplication,
        updateApplication,
        deleteApplication,
        markReminderCompleted,
        snoozeReminder,
        dismissReminder,
        markNotificationRead,
        dismissNotification,
        markAllNotificationsRead,
        purgeAllData,
        exportDataJson,
        importDataJson,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
