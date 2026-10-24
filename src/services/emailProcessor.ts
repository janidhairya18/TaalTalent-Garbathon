import { Application, ApplicationHistoryItem, ApplicationStatus, Email, NotificationItem, Reminder, ScamRiskLevel } from '../types';

// Demonstration reference date: October 24, 2026
export const DEMO_REFERENCE_DATE = new Date('2026-10-24T12:00:00Z');

/**
 * Normalizes company names to match email threads
 */
export function normalizeCompanyName(name: string): string {
  const clean = name.trim();
  const lower = clean.toLowerCase();
  if (lower.includes('zentech')) return 'Zentech';
  if (lower.includes('infosys')) return 'Infosys';
  if (lower.includes('finly')) return 'Finly';
  if (lower.includes('stripe')) return 'Stripe';
  if (lower.includes('figma')) return 'Figma';
  if (lower.includes('datadog')) return 'Datadog';
  if (lower.includes('airbnb')) return 'Airbnb';
  if (lower.includes('notion')) return 'Notion';
  if (lower.includes('spotify')) return 'Spotify';
  if (lower.includes('google')) return 'Google';
  if (lower.includes('netflix')) return 'Netflix';
  if (lower.includes('amazon') || lower.includes('aws')) return 'Amazon AWS';
  if (lower.includes('apex global')) return 'Apex Global Remote Careers';
  if (lower.includes('vertex')) return 'Apex Vertex Talent';
  if (lower.includes('global hire')) return 'Global Hire Staffing';
  if (lower.includes('canva')) return 'Canva';
  if (lower.includes('uber')) return 'Uber';
  if (lower.includes('microsoft')) return 'Microsoft';
  if (lower.includes('atlassian')) return 'Atlassian';
  if (lower.includes('linear')) return 'Linear';
  if (lower.includes('slack') || lower.includes('salesforce')) return 'Slack';
  if (lower.includes('vercel')) return 'Vercel';
  return clean;
}

/**
 * Status priority hierarchy to avoid downgrading upon out-of-order analysis
 */
const STATUS_PRIORITY: Record<ApplicationStatus, number> = {
  'Applied': 1,
  'No Response': 1,
  'Assessment': 2,
  'Interview': 3,
  'Rejected': 4,
  'Withdrawn': 4,
  'Offer': 5
};

/**
 * Maps emails to Application records without duplicating
 */
export function processEmailsIntoApplications(emails: Email[], existingApps: Application[] = []): Application[] {
  const appMap = new Map<string, Application>();

  // Seed with existing applications
  for (const app of existingApps) {
    const key = `${normalizeCompanyName(app.company).toLowerCase()}::${app.jobTitle.toLowerCase()}`;
    appMap.set(key, { ...app });
  }

  // Sort emails chronologically
  const sortedEmails = [...emails].sort((a, b) => new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime());

  for (const email of sortedEmails) {
    // If it's a confirmed high-risk scam, we don't treat it as a legitimate career application unless needed
    const isHighScam = email.scamAssessment.riskLevel === 'HIGH';
    const normCompany = normalizeCompanyName(email.company);
    const key = `${normCompany.toLowerCase()}::${email.jobTitle.toLowerCase()}`;

    let app = appMap.get(key);
    const emailDate = email.receivedAt;

    let targetStatus: ApplicationStatus = 'Applied';
    if (email.classification === 'Job Offer') {
      targetStatus = 'Offer';
    } else if (email.classification === 'Interview Invitation' || email.classification === 'Interview Update') {
      targetStatus = 'Interview';
    } else if (email.classification === 'Rejection') {
      targetStatus = 'Rejected';
    } else if (email.classification === 'Recruiter Response' || email.classification === 'Request for Information') {
      targetStatus = 'Assessment';
    } else if (email.classification === 'Potential Scam') {
      targetStatus = 'Applied';
    }

    if (!app) {
      // Create new application
      const history: ApplicationHistoryItem[] = [
        {
          id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          date: emailDate,
          title: `Application Initiated (${normCompany})`,
          description: `Discovered from message: "${email.subject}"`,
          type: 'email_received'
        }
      ];

      if (targetStatus !== 'Applied') {
        history.push({
          id: `hist-st-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          date: emailDate,
          title: `Status set to ${targetStatus}`,
          description: `Extracted from email: ${email.classification}`,
          type: 'status_change'
        });
      }

      app = {
        id: `app-${normCompany.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.random().toString(36).substring(2, 6)}`,
        company: normCompany,
        jobTitle: email.jobTitle,
        applicationDate: emailDate.split('T')[0],
        status: targetStatus,
        lastMeaningfulResponseAt: emailDate,
        recruiterEmail: email.senderEmail,
        recruiterName: email.senderName,
        emailIds: [email.id],
        scamRisk: email.scamAssessment.riskLevel,
        history,
        approvalStatus: normCompany === 'Zentech' ? 'pending' : 'approved',
        submittedBy: normCompany === 'Zentech' ? 'Candidate User' : 'Verified Recruiter',
        createdAt: emailDate,
        updatedAt: emailDate,
        notes: isHighScam ? '⚠️ Flagged by TaalTalent Scam Protection engine.' : ''
      };
      appMap.set(key, app);
    } else {
      // Update existing application
      if (!app.emailIds.includes(email.id)) {
        app.emailIds.push(email.id);
      }

      // Maintain higher scam risk if flagged
      if (email.scamAssessment.riskLevel === 'HIGH') {
        app.scamRisk = 'HIGH';
      } else if (email.scamAssessment.riskLevel === 'MEDIUM' && app.scamRisk === 'LOW') {
        app.scamRisk = 'MEDIUM';
      }

      // Check if status should update
      const currentPriority = STATUS_PRIORITY[app.status] || 0;
      const newPriority = STATUS_PRIORITY[targetStatus] || 0;

      // Only advance or update status if reasonable
      if (newPriority >= currentPriority || targetStatus === 'Rejected') {
        if (app.status !== targetStatus) {
          app.status = targetStatus;
          app.history.push({
            id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            date: emailDate,
            title: `Status updated to ${targetStatus}`,
            description: `Recruiter update: ${email.subject}`,
            type: 'status_change'
          });
        }
      }

      // Update last meaningful response
      if (new Date(emailDate).getTime() > new Date(app.lastMeaningfulResponseAt || app.applicationDate).getTime()) {
        app.lastMeaningfulResponseAt = emailDate;
      }
      app.updatedAt = new Date().toISOString();
    }

    // Link back to email
    email.linkedApplicationId = app.id;
  }

  return Array.from(appMap.values());
}

/**
 * Calculates 7-day follow-up reminders
 */
export function generateFollowUpReminders(applications: Application[], referenceDate: Date = DEMO_REFERENCE_DATE): Reminder[] {
  const reminders: Reminder[] = [];

  for (const app of applications) {
    // Exclude rejected, offer, or withdrawn applications
    if (['Offer', 'Rejected', 'Withdrawn'].includes(app.status)) {
      continue;
    }

    // Also skip high scam applications from standard recruiter follow-up
    if (app.scamRisk === 'HIGH') {
      continue;
    }

    // If an interview is already confirmed, no generic 7-day reminder
    if (app.status === 'Interview') {
      continue;
    }

    const appDate = new Date(app.applicationDate);
    const diffTime = referenceDate.getTime() - appDate.getTime();
    const daysSince = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Calculate due date (application date + 7 days)
    const dueDateObj = new Date(appDate);
    dueDateObj.setDate(dueDateObj.getDate() + 7);
    const dueDateStr = dueDateObj.toISOString().split('T')[0];

    let reminderStatus: 'Upcoming' | 'Due Today' | 'Overdue' = 'Upcoming';
    if (daysSince >= 9) {
      reminderStatus = 'Overdue';
    } else if (daysSince >= 7) {
      reminderStatus = 'Due Today';
    } else {
      reminderStatus = 'Upcoming';
    }

    const enTemplate = `Subject: Follow-up on ${app.jobTitle} Application

Dear ${app.company} Hiring Team,

I hope you are having a productive week. I am following up on my application for the ${app.jobTitle} position submitted on ${app.applicationDate}.

I remain very excited about the opportunity to contribute to ${app.company} and would welcome any updates regarding the status of my application.

Thank you very much for your time and consideration.

Best regards,
Candidate Name`;

    const hiTemplate = `विषय: ${app.jobTitle} आवेदन के संबंध में विनम्र फॉलो-अप

प्रिय ${app.company} हायरिंग टीम,

आशा है आप सकुशल होंगे। मैं ${app.applicationDate} को दिए गए अपने ${app.jobTitle} पद के आवेदन के संबंध में संपर्क कर रहा/रही हूँ।

मैं ${app.company} में योगदान देने के अवसर को लेकर अत्यंत उत्साहित हूँ और अपने आवेदन की वर्तमान स्थिति के बारे में जानकारी पाकर कृतज्ञ रहूँगा/रहूँगी।

आपके बहुमूल्य समय एवं विचार हेतु हार्दिक धन्यवाद।

सादर,
उम्मीदवार का नाम`;

    reminders.push({
      id: `rem-${app.id}`,
      applicationId: app.id,
      company: app.company,
      jobTitle: app.jobTitle,
      applicationDate: app.applicationDate,
      daysSinceApplication: daysSince,
      dueDate: dueDateStr,
      status: reminderStatus,
      suggestedMessage: {
        en: enTemplate,
        hi: hiTemplate
      },
      createdAt: app.applicationDate
    });
  }

  // Sort: Overdue first, then Due Today, then Upcoming
  const order = { 'Overdue': 1, 'Due Today': 2, 'Upcoming': 3, 'Completed': 4, 'Dismissed': 5 };
  return reminders.sort((a, b) => (order[a.status] || 9) - (order[b.status] || 9));
}

/**
 * Generates proactive notifications from state
 */
export function generateNotifications(emails: Email[], reminders: Reminder[]): NotificationItem[] {
  const notifications: NotificationItem[] = [];

  // Scam alerts
  const highScams = emails.filter(e => e.scamAssessment.riskLevel === 'HIGH' && !e.scamAssessment.reviewed);
  for (const scam of highScams) {
    notifications.push({
      id: `notif-scam-${scam.id}`,
      type: 'scam',
      titleEn: 'High Risk Recruitment Scam Flagged',
      titleHi: 'उच्च जोखिम भर्ती धोखाधड़ी ईमेल चिह्नित',
      messageEn: `Suspicious payment/credential request detected in email from "${scam.company}".`,
      messageHi: `"${scam.company}" से प्राप्त ईमेल में संदिग्ध भुगतान अथवा क्रेडेंशियल की मांग पकड़ी गई।`,
      timestamp: scam.receivedAt,
      read: false,
      dismissed: false,
      linkedId: scam.id,
      viewTarget: 'scam'
    });
  }

  // Interview notifications
  const interviews = emails.filter(e => e.classification === 'Interview Invitation' || e.classification === 'Interview Update');
  for (const iv of interviews) {
    notifications.push({
      id: `notif-iv-${iv.id}`,
      type: 'interview',
      titleEn: `Interview Round: ${iv.company}`,
      titleHi: `इंटरव्यू का नया राउंड: ${iv.company}`,
      messageEn: `Recruiter invited you for ${iv.jobTitle}. Check your calendar and prep notes!`,
      messageHi: `${iv.jobTitle} के लिए रिक्रूटर ने आपको आमंत्रित किया है। समय और तैयारी की जांच करें!`,
      timestamp: iv.receivedAt,
      read: false,
      dismissed: false,
      linkedId: iv.id,
      viewTarget: 'tracker'
    });
  }

  // Overdue reminders
  const overdueReminders = reminders.filter(r => r.status === 'Overdue');
  for (const rem of overdueReminders) {
    notifications.push({
      id: `notif-rem-${rem.id}`,
      type: 'followup',
      titleEn: `Follow-up Overdue: ${rem.company}`,
      titleHi: `फॉलो-अप का समय बीत चुका: ${rem.company}`,
      messageEn: `No response from ${rem.company} for ${rem.daysSinceApplication} days. Send a polite check-in today.`,
      messageHi: `${rem.company} से ${rem.daysSinceApplication} दिनों से कोई जवाब नहीं आया है। आज फॉलो-अप भेजें।`,
      timestamp: new Date().toISOString(),
      read: false,
      dismissed: false,
      linkedId: rem.id,
      viewTarget: 'reminders'
    });
  }

  return notifications;
}
