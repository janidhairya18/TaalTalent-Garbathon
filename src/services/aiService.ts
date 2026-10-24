import { Email, EmailClassification, ScamAssessment, ScamRiskLevel } from '../types';

export interface AIAnalysisResult {
  company: string;
  jobTitle: string;
  classification: EmailClassification;
  summary: string;
  summaryHi: string;
  scamAssessment: ScamAssessment;
  interviewDate?: string;
}

/**
 * Deterministic heuristic analysis engine for local analysis and fallback
 */
export function analyzeEmailLocally(body: string, subject: string, senderEmail: string, senderName: string): AIAnalysisResult {
  const text = `${subject} \n ${body}`.toLowerCase();

  // Extract Company Name heuristics
  let company = 'Unknown Company';
  const companyPatterns = [
    /(?:at|with|to|from)\s+([A-Z][a-zA-Z0-9\s&]{2,20})(?:\s+team|\s+careers|\s+recruiting|\s+talent|[.,!\n])/i,
    /(?:company|organization):\s*([A-Za-z0-9\s&]{2,25})/i,
    /([A-Z][a-zA-Z0-9]+)\s+(?:application|interview|offer|career)/i,
  ];
  for (const pat of companyPatterns) {
    const match = `${subject} ${body}`.match(pat);
    if (match && match[1] && !['the', 'our', 'this', 'your', 'dear'].includes(match[1].toLowerCase().trim())) {
      company = match[1].trim();
      break;
    }
  }

  // Fallback domain extraction
  if (company === 'Unknown Company' && senderEmail.includes('@')) {
    const domainPart = senderEmail.split('@')[1]?.split('.')[0] || '';
    if (domainPart && !['gmail', 'yahoo', 'hotmail', 'outlook', 'protonmail'].includes(domainPart.toLowerCase())) {
      company = domainPart.charAt(0).toUpperCase() + domainPart.slice(1);
    }
  }

  // Extract Job Title heuristics
  let jobTitle = 'Software Role';
  const rolePatterns = [
    /(?:role|position|for the position of|opening for|for the)\s+([A-Z][A-Za-z0-9\s/()\-]{3,35})(?:\s+role|\s+at|[.,!\n])/i,
    /(?:senior|junior|staff|lead|principal)?\s*(?:frontend|backend|full\s*stack|software|cloud|devops|product|ui|mobile|data)\s+(?:engineer|developer|designer|architect|manager|specialist|analyst)/i
  ];
  for (const pat of rolePatterns) {
    const match = `${subject} ${body}`.match(pat);
    if (match) {
      jobTitle = (match[1] || match[0]).trim();
      break;
    }
  }

  // Scam Indicator Evaluation
  const suspiciousPhrases: string[] = [];
  const reasons: string[] = [];
  const reasonsHi: string[] = [];
  const evidence: string[] = [];
  const recommendedActions: string[] = [];
  const recommendedActionsHi: string[] = [];

  let riskScore = 5;

  // 1. Payment demands (Extremely high risk indicator)
  const paymentMarkers = [
    { regex: /(?:security\s*deposit|equipment\s*deposit|software\s*license\s*fee|registration\s*fee|training\s*fee|processing\s*fee|clearance\s*fee|refundable\s*fee)/i, phrase: 'Payment or training/registration fee required for employment' },
    { regex: /(?:zelle|cashapp|bitcoin|crypto\s*wallet|western\s*union|wire\s*transfer\s*to)/i, phrase: 'Non-reversible money transfer method (Zelle/Crypto/Western Union)' },
    { regex: /(?:\$|Rs\.?|₹|INR)\s*\d{2,6}(?:,\d{3})*(?:\.\d{2})?\s*(?:fee|deposit|refundable|training)/i, phrase: 'Explicit monetary fee or deposit demanded from candidate' },
    { regex: /(?:pay\s*(?:Rs\.?|₹|INR|\$)\s*\d{2,6})/i, phrase: 'Demand to pay fee before joining or receiving offer' }
  ];

  let hasPaymentRequest = false;
  for (const pm of paymentMarkers) {
    const m = `${subject} ${body}`.match(pm.regex);
    if (m) {
      hasPaymentRequest = true;
      riskScore += 45;
      suspiciousPhrases.push(m[0]);
      evidence.push(`Found payment demand: "${m[0]}"`);
      reasons.push(pm.phrase);
      reasonsHi.push('रोजगार या प्रशिक्षण के लिए अग्रिम भुगतान की मांग');
    }
  }

  // 2. Sensitive credential & identity document requests
  const credentialMarkers = [
    { regex: /(?:online\s*banking\s*login|bank\s*password|temporary\s*password\s*and|sms\s*otp|6-digit\s*(?:sms\s*)?otp)/i, phrase: 'Requests banking credentials or one-time verification password (OTP)' },
    { regex: /(?:credit\s*card\s*number|cvv|pin\s*number)/i, phrase: 'Requests credit card or PIN details' },
    { regex: /(?:aadhaar\s*(?:card)?\s*(?:and|&)\s*pan|send\s*aadhaar|pan\s*card\s*to\s*confirm|identity\s*documents\s*to\s*confirm\s*your\s*joining)/i, phrase: 'Premature request for sensitive government IDs (Aadhaar/PAN) before legitimate interview' }
  ];

  let hasCredentialRequest = false;
  for (const cm of credentialMarkers) {
    const m = `${subject} ${body}`.match(cm.regex);
    if (m) {
      hasCredentialRequest = true;
      riskScore += 50;
      suspiciousPhrases.push(m[0]);
      evidence.push(`Direct credential or sensitive ID demand: "${m[0]}"`);
      reasons.push(cm.phrase);
      reasonsHi.push('संवेदनशील पहचान दस्तावेज़ (आधार / पैन) अथवा ओटीपी की अवांछित मांग');
    }
  }

  // 3. Impersonation of major IT companies using free webmail (@gmail.com)
  const isFreeWebmail = senderEmail.endsWith('@gmail.com') || senderEmail.endsWith('@yahoo.com') || senderEmail.endsWith('@hotmail.com');
  const knownEnterprises = ['infosys', 'tcs', 'wipro', 'google', 'microsoft', 'amazon', 'hcl', 'cognizant'];
  const impersonated = knownEnterprises.some(corp => `${senderEmail} ${subject} ${body}`.toLowerCase().includes(corp));

  if (isFreeWebmail && impersonated) {
    riskScore += 45;
    suspiciousPhrases.push(senderEmail);
    evidence.push(`Corporate recruiter using generic free webmail: "${senderEmail}"`);
    reasons.push('Impersonation: Official corporate recruitment sent from generic free webmail (@gmail.com)');
    reasonsHi.push('कॉर्पोरेट भर्ती के लिए गैर-आधिकारिक मुफ़्त वेबमेल (@gmail.com) का उपयोग');
  }

  // 4. Suspicious recruitment behavior
  const behaviorMarkers = [
    { regex: /(?:selected\s*without\s*(?:further\s*)?interview|hired\s*without\s*interview|no\s*interview\s*needed|you\s*are\s*selected)/i, phrase: 'Guaranteed hiring without technical screening or interview' },
    { regex: /(?:telegram|whatsapp)\s*(?:app|username|chat|channel)?:\s*@[a-zA-Z0-9_]+/i, phrase: 'Directs candidate to unmonitored Telegram/WhatsApp communication' },
    { regex: /(?:must\s*pay\s*within\s*24\s*hours|permanently\s*revoked|immediate\s*action\s*required\s*by\s*5|confirm\s*your\s*joining)/i, phrase: 'High artificial urgency and ultimatum tactics' },
    { regex: /\.(?:biz|info|work|xyz|top|site|click|rest)\b/i, phrase: 'Suspicious cheap or mismatched top-level domain' }
  ];

  for (const bm of behaviorMarkers) {
    const m = `${subject} ${body}`.match(bm.regex);
    if (m) {
      riskScore += 25;
      suspiciousPhrases.push(m[0]);
      evidence.push(`Suspicious hiring practice: "${m[0]}"`);
      reasons.push(bm.phrase);
      reasonsHi.push('संदिग्ध भर्ती प्रक्रिया (अवास्तविक चयन अथवा अनौपचारिक चैनल)');
    }
  }

  // Contextual Guardrail: Legitimate background check / compensation
  const isLegitimateContext = text.includes('hireright') || text.includes('docusign') || text.includes('atlassian.com') || text.includes('calendly.stripe.com');
  if (isLegitimateContext && !hasPaymentRequest && !hasCredentialRequest) {
    riskScore = Math.min(riskScore, 12);
    reasons.length = 0;
    reasonsHi.length = 0;
    reasons.push('Verified enterprise domain with official ATS / screening workflow');
    reasons.push('Document requests occur strictly through accredited third-party portal (HireRight/DocuSign)');
    reasonsHi.push('सत्यापित कॉर्पोरेट डोमेन एवं आधिकारिक एटीएस वर्कफ़्लो');
    reasonsHi.push('दस्तावेज़ अनुरोध केवल मान्यता प्राप्त तीसरे पक्ष के पोर्टल के माध्यम से होते हैं');
  }

  // Determine Risk Level
  let riskLevel: ScamRiskLevel = 'LOW';
  if (riskScore >= 75) {
    riskLevel = 'HIGH';
    recommendedActions.push('DO NOT send any money, cryptocurrency, or gift cards.');
    recommendedActions.push('NEVER share banking passwords, OTPs, or credit card info.');
    recommendedActions.push('Verify recruiter identity independently via the official corporate website.');
    recommendedActionsHi.push('कोई भी पैसा, क्रिप्टोकरेंसी या गिफ्ट कार्ड न भेजें।');
    recommendedActionsHi.push('बैंकिंग पासवर्ड, ओटीपी या कार्ड विवरण कभी साझा न करें।');
    recommendedActionsHi.push('कंपनी की आधिकारिक वेबसाइट पर रिक्रूटर की प्रामाणिकता जांचें।');
  } else if (riskScore >= 40) {
    riskLevel = 'MEDIUM';
    recommendedActions.push('Request an official corporate email address from the recruiter.');
    recommendedActions.push('Do not conduct corporate interviews over Telegram or personal chat apps.');
    recommendedActions.push('Confirm company registration on public corporate registries.');
    recommendedActionsHi.push('रिक्रूटर से आधिकारिक कॉर्पोरेट ईमेल पते का अनुरोध करें।');
    recommendedActionsHi.push('टेलीग्राम या पर्सनल चैट ऐप्स पर इंटरव्यू आयोजित न करें।');
    recommendedActionsHi.push('सार्वजनिक कॉर्पोरेट रजिस्ट्रियों पर कंपनी पंजीकरण की पुष्टि करें।');
  } else {
    riskLevel = 'LOW';
    riskScore = Math.min(riskScore, 15);
    reasons.push('No significant recruitment fraud markers detected.');
    reasonsHi.push('कोई महत्वपूर्ण भर्ती धोखाधड़ी संकेत नहीं मिला।');
    recommendedActions.push('Standard recruitment process. Follow standard candidate etiquette.');
    recommendedActionsHi.push('मानक भर्ती प्रक्रिया। उम्मीदवार शिष्टाचार का पालन करें।');
  }

  // Determine Classification
  let classification: EmailClassification = 'Recruiter Response';
  if (riskLevel === 'HIGH' || riskScore >= 70) {
    classification = 'Potential Scam';
  } else if (text.includes('offer letter') || text.includes('pleasure to extend an offer') || text.includes('offer of employment')) {
    classification = 'Job Offer';
  } else if (text.includes('decided not to move forward') || text.includes('other candidates') || text.includes('not moving forward') || text.includes('unable to offer you')) {
    classification = 'Rejection';
  } else if (text.includes('interview invitation') || text.includes('invite you to') || text.includes('phone screen') || text.includes('technical loop') || text.includes('schedule a call') || text.includes('calendly.com')) {
    classification = 'Interview Invitation';
  } else if (text.includes('rescheduled') || text.includes('interview update') || text.includes('following up on your successful') || text.includes('system architecture and distributed systems')) {
    classification = 'Interview Update';
  } else if (text.includes('application received') || text.includes('thank you for applying') || text.includes('confirming receipt') || text.includes('thank you for your interest')) {
    classification = 'Application Confirmation';
  } else if (text.includes('additional portfolio') || text.includes('portfolio details requested') || text.includes('could you share') || text.includes('request for information')) {
    classification = 'Request for Information';
  } else if (text.includes('checking in') || text.includes('follow up') || text.includes('following up')) {
    classification = 'Follow-up';
  }

  // Extract interview date if present
  let interviewDate: string | undefined = undefined;
  const dateMatch = body.match(/(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)?,?\s*(?:october|november|december)\s+\d{1,2}(?:,\s*\d{4})?/i);
  if (dateMatch) {
    interviewDate = dateMatch[0].trim();
  }

  // Summaries
  let summary = `Email from ${company} regarding ${jobTitle} (${classification}).`;
  let summaryHi = `${company} से ${jobTitle} हेतु ईमेल (${classification})।`;

  if (classification === 'Job Offer') {
    summary = `Formal job offer received for ${jobTitle} at ${company}.`;
    summaryHi = `${company} में ${jobTitle} के लिए औपचारिक नौकरी का प्रस्ताव प्राप्त हुआ।`;
  } else if (classification === 'Interview Invitation' || classification === 'Interview Update') {
    summary = `Interview stage active with ${company} for ${jobTitle}.`;
    summaryHi = `${company} के साथ ${jobTitle} के लिए इंटरव्यू चरण सक्रिय।`;
  } else if (classification === 'Rejection') {
    summary = `Application closed by ${company} for ${jobTitle}.`;
    summaryHi = `${company} द्वारा ${jobTitle} के लिए आवेदन समाप्त।`;
  } else if (classification === 'Potential Scam') {
    summary = `HIGH RISK SCAM WARNING: Suspicious email from ${company} flagged for fraud indicators.`;
    summaryHi = `उच्च जोखिम चेतावनी: ${company} से प्राप्त ईमेल में धोखाधड़ी के संकेत मिले।`;
  }

  return {
    company,
    jobTitle,
    classification,
    summary,
    summaryHi,
    scamAssessment: {
      riskLevel,
      riskScore: Math.min(100, Math.max(0, riskScore)),
      reasons,
      reasonsHi,
      evidence,
      recommendedActions,
      recommendedActionsHi,
      reviewed: false,
      suspiciousPhrases
    },
    interviewDate
  };
}

/**
 * Live Google Gemini LLM API integration with structured prompt
 */
export async function analyzeEmailWithGemini(
  apiKey: string,
  email: { subject: string; body: string; senderEmail: string; senderName: string }
): Promise<AIAnalysisResult> {
  const prompt = `You are TaalTalent AI, an expert cybersecurity and recruitment fraud analysis engine.
Analyze the following recruitment email:
Sender: ${email.senderName} <${email.senderEmail}>
Subject: ${email.subject}
Body:
${email.body}

Return a valid, strict JSON object with EXACTLY this structure (no markdown fences, just JSON):
{
  "company": "Company Name extracted or inferred",
  "jobTitle": "Job Title or Role",
  "classification": "Application Confirmation" | "Recruiter Response" | "Interview Invitation" | "Interview Update" | "Rejection" | "Job Offer" | "Request for Information" | "Follow-up" | "Potential Scam" | "Other",
  "summary": "Brief 1-2 sentence English summary of the email",
  "summaryHi": "Brief 1-2 sentence Hindi translation of the summary",
  "interviewDate": "Extracted interview date/time string or null",
  "scamAssessment": {
    "riskLevel": "LOW" | "MEDIUM" | "HIGH",
    "riskScore": 0 to 100,
    "reasons": ["List of clear, transparent reasons in English"],
    "reasonsHi": ["List of reasons in Hindi"],
    "evidence": ["Exact quotes or phrases from the email showing suspicious demands or legitimate indicators"],
    "recommendedActions": ["List of specific candidate safety recommendations in English"],
    "recommendedActionsHi": ["List of recommendations in Hindi"],
    "suspiciousPhrases": ["Short trigger phrases highlighted in email text"]
  }
}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Empty response from Gemini API');
    }

    const cleanJson = candidateText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleanJson);

    // Validate parsed fields
    return {
      company: parsed.company || 'Unknown Company',
      jobTitle: parsed.jobTitle || 'Software Role',
      classification: parsed.classification || 'Recruiter Response',
      summary: parsed.summary || 'Recruitment email processed.',
      summaryHi: parsed.summaryHi || 'ईमेल का विश्लेषण किया गया।',
      interviewDate: parsed.interviewDate || undefined,
      scamAssessment: {
        riskLevel: ['LOW', 'MEDIUM', 'HIGH'].includes(parsed.scamAssessment?.riskLevel) ? parsed.scamAssessment.riskLevel : 'LOW',
        riskScore: typeof parsed.scamAssessment?.riskScore === 'number' ? parsed.scamAssessment.riskScore : 10,
        reasons: Array.isArray(parsed.scamAssessment?.reasons) ? parsed.scamAssessment.reasons : [],
        reasonsHi: Array.isArray(parsed.scamAssessment?.reasonsHi) ? parsed.scamAssessment.reasonsHi : [],
        evidence: Array.isArray(parsed.scamAssessment?.evidence) ? parsed.scamAssessment.evidence : [],
        recommendedActions: Array.isArray(parsed.scamAssessment?.recommendedActions) ? parsed.scamAssessment.recommendedActions : [],
        recommendedActionsHi: Array.isArray(parsed.scamAssessment?.recommendedActionsHi) ? parsed.scamAssessment.recommendedActionsHi : [],
        reviewed: false,
        suspiciousPhrases: Array.isArray(parsed.scamAssessment?.suspiciousPhrases) ? parsed.scamAssessment.suspiciousPhrases : []
      }
    };
  } catch (err) {
    console.warn('Gemini API call failed, falling back to local deterministic analysis:', err);
    return analyzeEmailLocally(email.body, email.subject, email.senderEmail, email.senderName);
  }
}
