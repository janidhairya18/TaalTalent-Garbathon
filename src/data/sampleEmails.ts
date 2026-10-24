import { Email } from '../types';

export const SAMPLE_EMAILS: Email[] = [
  {
    id: 'em-zen-01',
    senderName: 'Zentech Careers',
    senderEmail: 'careers@zentech.in',
    company: 'Zentech',
    jobTitle: 'Backend Engineer',
    subject: 'Application received: Backend Engineer',
    receivedAt: '2026-10-10T10:00:00Z',
    classification: 'Application Confirmation',
    summary: 'Application received for Backend Engineer. Awaiting recruiter review (14 days ago).',
    summaryHi: 'बैकएंड इंजीनियर पद के लिए आवेदन प्राप्त हुआ। 14 दिन से कोई जवाब नहीं, फॉलो-अप देय।',
    isRead: false,
    scamAssessment: {
      riskLevel: 'LOW',
      riskScore: 2,
      reasons: ['Legitimate corporate Indian tech domain (@zentech.in)', 'Standard polite application receipt'],
      reasonsHi: ['वैध कॉर्पोरेट डोमेन (@zentech.in)', 'मानक आवेदन पावती'],
      evidence: [],
      recommendedActions: ['Follow-up is overdue by 7 days under the 7-day rule.'],
      recommendedActionsHi: ['7-दिवसीय नियम के तहत फॉलो-अप में 7 दिन की देरी हो चुकी है।'],
      reviewed: false,
      suspiciousPhrases: []
    },
    body: `Thanks for applying. We will get back to you...

Zentech Talent Acquisition Team
https://zentech.in`
  },
  {
    id: 'em-inf-02',
    senderName: 'Infosys HR Desk',
    senderEmail: 'hr.infosys.jobs@gmail.com',
    company: 'Infosys',
    jobTitle: 'Software Engineer',
    subject: 'Offer letter - pay Rs 4,999 training fee',
    receivedAt: '2026-10-14T11:30:00Z',
    classification: 'Potential Scam',
    summary: 'HIGH RISK SCAM: Demand for Rs 4,999 training fee & Aadhaar/PAN from free Gmail address claiming to be Infosys.',
    summaryHi: 'उच्च जोखिम धोखाधड़ी: इंफोसिस के नाम पर जीमेल से ₹4,999 प्रशिक्षण शुल्क और आधार/पैन कार्ड की मांग।',
    isRead: false,
    scamAssessment: {
      riskLevel: 'HIGH',
      riskScore: 99,
      reasons: [
        'Demands Rs 4,999 training fee before joining confirmation',
        'Premature demand for sensitive government identity documents (Aadhaar and PAN)',
        'Impersonation: Official corporate recruitment sent from generic free webmail (hr.infosys.jobs@gmail.com)',
        'Guaranteed selection without technical interview'
      ],
      reasonsHi: [
        'जॉइनिंग पुष्टिकरण से पहले ₹4,999 प्रशिक्षण शुल्क की मांग',
        'संवेदनशील पहचान दस्तावेज़ों (आधार और पैन) की अवांछित मांग',
        'इंफोसिस के नाम पर मुफ़्त जीमेल (hr.infosys.jobs@gmail.com) से फर्जीवाड़ा',
        'बिना इंटरव्यू के सीधे चयन का झूठा दावा'
      ],
      evidence: [
        'pay Rs 4,999 training fee',
        'You are selected. Pay the refundable fee and send Aadhaar and PAN to confirm your joining...',
        'hr.infosys.jobs@gmail.com'
      ],
      recommendedActions: [
        'DO NOT pay Rs 4,999 or any training fees.',
        'DO NOT share Aadhaar or PAN card copies.',
        'Infosys never uses @gmail.com for recruitment and never charges candidates.'
      ],
      recommendedActionsHi: [
        '₹4,999 या कोई प्रशिक्षण शुल्क बिल्कुल न दें।',
        'आधार अथवा पैन कार्ड की प्रति कतई साझा न करें।',
        'इंफोसिस कभी जीमेल का उपयोग नहीं करता और न ही शुल्क लेता है।'
      ],
      reviewed: false,
      suspiciousPhrases: [
        'pay Rs 4,999 training fee',
        'Pay the refundable fee',
        'send Aadhaar and PAN to confirm your joining',
        'hr.infosys.jobs@gmail.com'
      ]
    },
    body: `You are selected. Pay the refundable fee and send Aadhaar and PAN to confirm your joining...

Please deposit Rs 4,999 via UPI to complete your training induction onboarding within 24 hours.

HR Talent Division
hr.infosys.jobs@gmail.com`
  },
  {
    id: 'em-fin-03',
    senderName: 'Finly Talent',
    senderEmail: 'talent@finly.co',
    company: 'Finly',
    jobTitle: 'Full Stack Engineer',
    subject: 'Interview invite: Round 1 on 27 Oct',
    receivedAt: '2026-10-18T14:00:00Z',
    classification: 'Interview Invitation',
    summary: 'Round 1 technical interview invitation scheduled for Oct 27, 2026 (45-minute call).',
    summaryHi: '27 अक्टूबर 2026 को 45 मिनट के राउंड 1 तकनीकी इंटरव्यू हेतु आमंत्रण।',
    isRead: true,
    scamAssessment: {
      riskLevel: 'LOW',
      riskScore: 2,
      reasons: ['Authenticated fintech domain (@finly.co)', 'Standard screening interview invitation without financial demands'],
      reasonsHi: ['सत्यापित डोमेन (@finly.co)', 'मानक स्क्रीनिंग इंटरव्यू आमंत्रण'],
      evidence: [],
      recommendedActions: ['Select your preferred interview slot for Oct 27.', 'Prepare system design and frontend questions.'],
      recommendedActionsHi: ['27 अक्टूबर के लिए अपना पसंदीदा स्लॉट चुनें।', 'इंटरव्यू की तैयारी करें।'],
      reviewed: true,
      suspiciousPhrases: []
    },
    body: `Please pick a slot for a 45-minute call...

Hi, we loved your profile and would like to invite you for Round 1 technical interview on 27 Oct.

Scheduling link: https://calendly.com/finly-talent/round-1

Best,
Finly Recruiting Team`
  },
  {
    id: 'em-01',
    senderName: 'Sarah Jenkins',
    senderEmail: 'sjenkins@recruiting.stripe.com',
    company: 'Stripe',
    jobTitle: 'Senior Frontend Engineer',
    subject: 'Application Received: Senior Frontend Engineer at Stripe',
    receivedAt: '2026-10-20T09:15:00Z',
    classification: 'Application Confirmation',
    summary: 'Confirmation that your application for Senior Frontend Engineer has been received by Stripe engineering recruitment.',
    summaryHi: 'स्ट्राइप इंजीनियरिंग भर्ती टीम को सीनियर फ्रंटएंड इंजीनियर पद के लिए आपका आवेदन प्राप्त होने की पुष्टि।',
    isRead: true,
    scamAssessment: {
      riskLevel: 'LOW',
      riskScore: 4,
      reasons: [
        'Legitimate corporate domain (@recruiting.stripe.com)',
        'Standard confirmation language without requests for money or sensitive data',
        'Official applicant tracking link provided'
      ],
      reasonsHi: [
        'वैध कॉर्पोरेट डोमेन (@recruiting.stripe.com)',
        'पैसों या संवेदनशील डेटा के बिना मानक पावती भाषा',
        'आधिकारिक आवेदक ट्रैकिंग लिंक प्रदान किया गया'
      ],
      evidence: [],
      recommendedActions: [
        'No defensive action required. Wait for recruiter review.',
        'Follow up if no update within 7-10 business days.'
      ],
      recommendedActionsHi: [
        'किसी सुरक्षा कार्रवाई की आवश्यकता नहीं। रिक्रूटर समीक्षा की प्रतीक्षा करें।',
        'यदि 7-10 कार्यदिवसों में कोई अपडेट न मिले तो फॉलो-अप करें।'
      ],
      reviewed: true,
      suspiciousPhrases: []
    },
    body: `Hi there,

Thank you for your interest in Stripe! We have received your application for the Senior Frontend Engineer role (Req #ST-89211).

Our engineering hiring team is currently reviewing your background and portfolio. If there is a strong match with our team's current focus areas, a recruiter will reach out within the next 3-5 business days to coordinate an initial conversation.

In the meantime, you can review our engineering blog at stripe.com/blog/engineering to learn more about how we build financial infrastructure for the internet.

Best regards,
Sarah Jenkins
Technical Talent Partner | Stripe
https://stripe.com/jobs`
  },
  {
    id: 'em-02',
    senderName: 'Sarah Jenkins',
    senderEmail: 'sjenkins@recruiting.stripe.com',
    company: 'Stripe',
    jobTitle: 'Senior Frontend Engineer',
    subject: 'Stripe Interview Invitation: Senior Frontend Engineer Phone Screen',
    receivedAt: '2026-10-22T14:30:00Z',
    classification: 'Interview Invitation',
    summary: 'Recruiter screen scheduled for Oct 26, 2026 at 11:00 AM PST via Google Meet.',
    summaryHi: '26 अक्टूबर 2026 को सुबह 11:00 बजे गूगल मीट के माध्यम से रिक्रूटर स्क्रीन निर्धारित।',
    isRead: true,
    scamAssessment: {
      riskLevel: 'LOW',
      riskScore: 2,
      reasons: [
        'Matches existing verified recruitment chain',
        'Provides calendar scheduling link on official corporate domain',
        'Zero financial or credential requests'
      ],
      reasonsHi: [
        'मौजूदा सत्यापित भर्ती श्रृंखला से मेल खाता है',
        'आधिकारिक कॉर्पोरेट डोमेन पर कैलेंडर शेड्यूलिंग लिंक',
        'कोई वित्तीय या क्रेडेंशियल अनुरोध नहीं'
      ],
      evidence: [],
      recommendedActions: [
        'Confirm your interview time slot via the provided calendar link.',
        'Review your previous React/TypeScript projects in preparation.'
      ],
      recommendedActionsHi: [
        'दिए गए कैलेंडर लिंक के माध्यम से अपना इंटरव्यू समय स्लॉट पुष्ट करें।',
        'तैयारी में अपनी पिछली रिएक्ट/टाइपस्क्रिप्ट परियोजनाओं की समीक्षा करें।'
      ],
      reviewed: true,
      suspiciousPhrases: []
    },
    body: `Hello!

Great news! The team thoroughly enjoyed reviewing your GitHub repositories and architecture experience. We would love to invite you to an initial 45-minute recruiter screen for the Senior Frontend Engineer role.

During this call, we will discuss your background, what you're looking for in your next role, and dive into Stripe's engineering culture and roadmap.

Please pick a time that works best for your schedule here:
https://calendly.stripe.com/sjenkins/frontend-screen-30

Looking forward to speaking with you!

Warmly,
Sarah Jenkins
Stripe Recruiting Team`
  },
  {
    id: 'em-03',
    senderName: 'Figma Careers',
    senderEmail: 'no-reply@greenhouse-figma.io',
    company: 'Figma',
    jobTitle: 'Product Designer',
    subject: 'Thank you for applying to Figma — Product Designer',
    receivedAt: '2026-10-08T11:20:00Z',
    classification: 'Application Confirmation',
    summary: 'Application submitted 16 days ago. No recruiter response has been received.',
    summaryHi: '16 दिन पूर्व आवेदन जमा किया गया। कोई रिक्रूटर प्रतिक्रिया प्राप्त नहीं हुई है।',
    isRead: false,
    scamAssessment: {
      riskLevel: 'LOW',
      riskScore: 3,
      reasons: ['Standard Greenhouse ATS confirmation from verified vendor'],
      reasonsHi: ['सत्यापित वेंडर से मानक ग्रीनहाउस एटीएस पावती'],
      evidence: [],
      recommendedActions: ['Send polite follow-up email as 16 days have elapsed.'],
      recommendedActionsHi: ['16 दिन बीत जाने पर विनम्र फॉलो-अप ईमेल भेजें।'],
      reviewed: false,
      suspiciousPhrases: []
    },
    body: `Hi,

Thank you for submitting your application for the Product Designer role at Figma. 

We know that looking for a new role takes time and energy, and we appreciate you considering Figma. We review every application carefully. If your background aligns with what we need, a member of our recruiting team will be in touch.

You can check the status of your application anytime in your Figma Applicant Portal.

The Figma Talent Team`
  },
  {
    id: 'em-04',
    senderName: 'Marcus Vance',
    senderEmail: 'mvance@datadoghq.com',
    company: 'Datadog',
    jobTitle: 'Full Stack Developer',
    subject: 'Datadog: Next Steps for Full Stack Developer — Technical Assessment',
    receivedAt: '2026-10-18T16:45:00Z',
    classification: 'Recruiter Response',
    summary: 'Invitation to complete a 90-minute technical coding challenge on HackerRank within 7 days.',
    summaryHi: '7 दिनों के भीतर हैकररैंक पर 90 मिनट की तकनीकी कोडिंग चुनौती पूरी करने का निमंत्रण।',
    isRead: true,
    scamAssessment: {
      riskLevel: 'LOW',
      riskScore: 5,
      reasons: [
        'Legitimate domain @datadoghq.com',
        'Standard technical screening test hosted on accredited platform (HackerRank)',
        'No fees requested for testing'
      ],
      reasonsHi: [
        'वैध डोमेन @datadoghq.com',
        'मान्यता प्राप्त प्लेटफॉर्म (हैकररैंक) पर मानक तकनीकी स्क्रीनिंग टेस्ट',
        'परीक्षण हेतु कोई शुल्क नहीं'
      ],
      evidence: [],
      recommendedActions: [
        'Complete the HackerRank challenge before Oct 25, 2026 deadline.',
        'Review algorithmic problem solving and REST APIs.'
      ],
      recommendedActionsHi: [
        '25 अक्टूबर 2026 की समय सीमा से पहले हैकररैंक चुनौती पूरी करें।',
        'एल्गोरिदमिक समस्या समाधान और रेस्ट एपीआई की समीक्षा करें।'
      ],
      reviewed: true,
      suspiciousPhrases: []
    },
    body: `Hi,

Thank you for applying for the Full Stack Developer position at Datadog! We were impressed with your credentials.

As a next step, we would like to invite you to take our online technical assessment on HackerRank. The assessment consists of two coding challenges and takes approximately 90 minutes.

Assessment Link: https://www.hackerrank.com/datadog-eng-eval-88231
Deadline: Please complete this within 7 calendar days.

Let me know if you require any accessibility accommodations.

Best regards,
Marcus Vance
Datadog Tech Recruiting`
  },
  {
    id: 'em-05',
    senderName: 'Chloe Bennett',
    senderEmail: 'chloe.bennett@airbnb.com',
    company: 'Airbnb',
    jobTitle: 'Staff Software Engineer',
    subject: 'Airbnb Engineering: Update on Staff Software Engineer Technical Round',
    receivedAt: '2026-10-21T18:00:00Z',
    classification: 'Interview Update',
    summary: 'System Architecture interview confirmed for Oct 27, 2026 at 2:00 PM PST with Principal Architect.',
    summaryHi: '27 अक्टूबर 2026 को दोपहर 2:00 बजे प्रिंसिपल आर्किटेक्ट के साथ सिस्टम आर्किटेक्चर इंटरव्यू की पुष्टि।',
    isRead: true,
    scamAssessment: {
      riskLevel: 'LOW',
      riskScore: 2,
      reasons: ['Authenticated airbnb.com enterprise email and internal calendar invite'],
      reasonsHi: ['सत्यापित airbnb.com एंटरप्राइज ईमेल और आंतरिक कैलेंडर आमंत्रण'],
      evidence: [],
      recommendedActions: ['Prepare system design concepts (distributed caching, event streaming).'],
      recommendedActionsHi: ['सिस्टम डिज़ाइन अवधारणाओं (वितरित कैशिंग, इवेंट स्ट्रीमिंग) की तैयारी करें।'],
      reviewed: true,
      suspiciousPhrases: []
    },
    body: `Hi,

Following up on your successful coding interview last week, we are excited to move forward to the System Architecture and Distributed Systems round for the Staff Software Engineer opening.

Your interview is scheduled with David Ortiz (Principal Architect):
Date: Tuesday, October 27, 2026
Time: 2:00 PM – 3:15 PM PST
Platform: Zoom (Link: https://airbnb.zoom.us/j/9842104928)

Please find the interview prep guide attached to help you understand our design evaluation framework.

Best,
Chloe Bennett
Staff Engineering Recruiting, Airbnb`
  },
  {
    id: 'em-06',
    senderName: 'Elena Rostova',
    senderEmail: 'elena@m.notion.so',
    company: 'Notion',
    jobTitle: 'Engineering Manager',
    subject: 'Offer Letter: Engineering Manager at Notion!',
    receivedAt: '2026-10-23T11:00:00Z',
    classification: 'Job Offer',
    summary: 'Official offer letter for Engineering Manager: $185,000 base + equity + health benefits.',
    summaryHi: 'इंजीनियरिंग मैनेजर के लिए आधिकारिक ऑफर लेटर: $185,000 बेस + इक्विटी + स्वास्थ्य लाभ।',
    isRead: true,
    scamAssessment: {
      riskLevel: 'LOW',
      riskScore: 1,
      reasons: [
        'Formal offer generated through Notion Workday portal',
        'Standard compensation structure with no preliminary fee deductions',
        'Signed by VP of Engineering'
      ],
      reasonsHi: [
        'नोशन वर्कडे पोर्टल के माध्यम से औपचारिक ऑफर',
        'बिना किसी प्रारंभिक शुल्क कटौती के मानक मुआवजा संरचना',
        'वीपी ऑफ इंजीनियरिंग द्वारा हस्ताक्षरित'
      ],
      evidence: [],
      recommendedActions: [
        'Review offer details and equity vesting schedule.',
        'Respond before offer expiration date: Nov 3, 2026.'
      ],
      recommendedActionsHi: [
        'ऑफर विवरण और इक्विटी वेस्टिंग अनुसूची की समीक्षा करें।',
        'ऑफर समाप्ति तिथि 3 नवंबर 2026 से पहले जवाब दें।'
      ],
      reviewed: true,
      suspiciousPhrases: []
    },
    body: `Dear Candidate,

On behalf of the entire Notion team, it is my absolute pleasure to extend an offer of employment for the position of Engineering Manager, Core Infrastructure!

Key Offer Highlights:
- Annual Base Salary: $185,000 USD
- Equity Grant: 18,000 RSUs (standard 4-year vesting schedule)
- Annual Performance Bonus: Target 15%
- Comprehensive medical, dental, vision, and 401(k) matching
- Location: San Francisco, CA / Remote Flexible

You can review and electronically sign the full formal agreement via DocuSign at:
https://notion.docusign.net/offers/NM-40918-2026

We would love to have your acceptance by Friday, November 3, 2026. Please let me know if you would like to schedule a call with our VP of Engineering to discuss any questions!

Warm regards,
Elena Rostova
Head of Talent, Notion`
  },
  {
    id: 'em-07',
    senderName: 'Spotify Recruiting',
    senderEmail: 'talent@spotify.com',
    company: 'Spotify',
    jobTitle: 'Backend Engineer',
    subject: 'Your application with Spotify — Backend Engineer, Personalization',
    receivedAt: '2026-10-19T13:10:00Z',
    classification: 'Rejection',
    summary: 'Candidate rejected after final round interview due to headcount allocation changes.',
    summaryHi: 'हेडकाउंट आवंटन में बदलाव के कारण अंतिम दौर के इंटरव्यू के बाद उम्मीदवार को अस्वीकार किया गया।',
    isRead: true,
    scamAssessment: {
      riskLevel: 'LOW',
      riskScore: 2,
      reasons: ['Standard corporate notification from official Spotify talent address'],
      reasonsHi: ['आधिकारिक स्पॉटीफाई टैलेंट पते से मानक कॉर्पोरेट अधिसूचना'],
      evidence: [],
      recommendedActions: ['Keep contact open for future backend openings; request constructive feedback.'],
      recommendedActionsHi: ['भविष्य के बैकएंड अवसरों के लिए संपर्क खुला रखें; रचनात्मक फीडबैक का अनुरोध करें।'],
      reviewed: true,
      suspiciousPhrases: []
    },
    body: `Hi,

Thank you for taking the time to speak with our engineering team throughout the interview process for the Backend Engineer position in our Personalization Band.

While the interview panel was very impressed by your distributed systems knowledge, we have decided not to move forward with an offer at this stage as we are prioritizing a candidate whose recent experience aligns more directly with our immediate audio-streaming protocol requirements.

We will keep your profile in our talent community for upcoming openings that match your skill set. We wish you the very best in your search!

Sincerely,
Spotify Talent Acquisition Team`
  },
  {
    id: 'em-08',
    senderName: 'Google Staffing',
    senderEmail: 'noreply@google.com',
    company: 'Google',
    jobTitle: 'Senior Software Engineer',
    subject: 'Google Application Received: Senior Software Engineer (L5)',
    receivedAt: '2026-10-02T10:00:00Z',
    classification: 'Application Confirmation',
    summary: 'Application submitted 22 days ago with no recruiter response. Eligible for follow-up.',
    summaryHi: '22 दिन पूर्व आवेदन जमा किया गया था और कोई प्रतिक्रिया नहीं मिली। फॉलो-अप के योग्य।',
    isRead: false,
    scamAssessment: {
      riskLevel: 'LOW',
      riskScore: 2,
      reasons: ['Authenticated google.com automated careers receipt'],
      reasonsHi: ['सत्यापित google.com स्वचालित करियर रसीद'],
      evidence: [],
      recommendedActions: ['Send polite status inquiry or reach out to team hiring managers on LinkedIn.'],
      recommendedActionsHi: ['विनम्र स्थिति पूछताछ भेजें या लिंक्डइन पर हायरिंग प्रबंधकों से संपर्क करें।'],
      reviewed: false,
      suspiciousPhrases: []
    },
    body: `Hello,

Thank you for your interest in employment opportunities at Google. We have received your application for the Senior Software Engineer (L5) role in Cloud Infrastructure.

Due to the volume of applications we receive, we are unable to provide individualized status updates during early review. If your qualifications match an open requisition, a recruiter will reach out directly.

You can monitor your application status at https://careers.google.com/applications.

Google Staffing`
  },
  {
    id: 'em-09',
    senderName: 'Tariq Al-Mansoor',
    senderEmail: 'talmansoor@netflix.com',
    company: 'Netflix',
    jobTitle: 'UI Engineer',
    subject: 'Netflix UI Engineering: Additional portfolio details requested',
    receivedAt: '2026-10-17T15:20:00Z',
    classification: 'Request for Information',
    summary: 'Recruiter requesting public GitHub repository links and interactive web demo examples.',
    summaryHi: 'रिक्रूटर द्वारा सार्वजनिक गिटहब रिपॉजिटरी लिंक और इंटरैक्टिव वेब डेमो उदाहरणों का अनुरोध।',
    isRead: true,
    scamAssessment: {
      riskLevel: 'LOW',
      riskScore: 6,
      reasons: [
        'Legitimate @netflix.com address',
        'Requests ordinary public work samples (GitHub/web link) typical of frontend hiring',
        'No sensitive PII, passport numbers, or fees requested'
      ],
      reasonsHi: [
        'वैध @netflix.com पता',
        'फ्रंटएंड भर्ती में सामान्य सार्वजनिक कार्य नमूनों (गिटहब/वेब लिंक) का अनुरोध',
        'कोई संवेदनशील पीआईआई, पासपोर्ट नंबर या शुल्क नहीं मांगा गया'
      ],
      evidence: [],
      recommendedActions: ['Send links to top 2-3 production-quality web applications.'],
      recommendedActionsHi: ['शीर्ष 2-3 प्रोडक्शन-गुणवत्ता वाले वेब अनुप्रयोगों के लिंक भेजें।'],
      reviewed: true,
      suspiciousPhrases: []
    },
    body: `Hello,

I came across your application for the UI Engineer position within our Streaming Experience team and was really intrigued by your background in micro-frontends and performance optimization.

Could you share 1 or 2 live project links or public GitHub repositories showcasing your component architecture and unit test coverage? Our engineering hiring manager wants to take a quick look before we set up a technical discussion.

Thanks, and looking forward to hearing from you!

Tariq Al-Mansoor
Technical Recruiter | Netflix`
  },
  {
    id: 'em-10',
    senderName: 'AWS Talent Delivery',
    senderEmail: 'aws-careers@amazon.com',
    company: 'Amazon AWS',
    jobTitle: 'Solutions Architect',
    subject: 'Thank you for your application to Amazon Web Services',
    receivedAt: '2026-10-16T11:45:00Z',
    classification: 'Application Confirmation',
    summary: 'Application submitted 8 days ago. Follow-up is due today under the 7-day rule.',
    summaryHi: '8 दिन पूर्व आवेदन जमा हुआ। 7-दिवसीय नियम के तहत आज फॉलो-अप देय है।',
    isRead: false,
    scamAssessment: {
      riskLevel: 'LOW',
      riskScore: 3,
      reasons: ['Official amazon.com ATS email confirmation'],
      reasonsHi: ['आधिकारिक amazon.com एटीएस ईमेल पावती'],
      evidence: [],
      recommendedActions: ['Follow-up due today. Use the pre-composed follow-up template.'],
      recommendedActionsHi: ['आज फॉलो-अप देय है। पहले से तैयार किए गए फॉलो-अप प्रारूप का उपयोग करें।'],
      reviewed: false,
      suspiciousPhrases: []
    },
    body: `Dear Candidate,

Thank you for applying for the Solutions Architect (Enterprise FinTech) position at Amazon Web Services (Job ID: 2948102).

Your resume is under consideration by our talent team. Amazon is an equal opportunity employer committed to a diverse workforce.

Track your status on amazon.jobs anytime.

Amazon Web Services Recruitment`
  },
  {
    id: 'em-11',
    senderName: 'Apex Global HR Desk',
    senderEmail: 'hr-verify@apex-global-careers-secure.biz',
    company: 'Apex Global Remote Careers',
    jobTitle: 'Remote Data Entry & Operations Specialist',
    subject: 'URGENT: IMMEDIATE JOB OFFER - $52.00/Hour - Registration Deposit Required',
    receivedAt: '2026-10-23T08:10:00Z',
    classification: 'Potential Scam',
    summary: 'HIGH RISK SCAM: Guaranteed job offer with no interview, demanding a $250 "Mandatory Training & Software License Deposit" via Zelle/Crypto.',
    summaryHi: 'उच्च जोखिम धोखाधड़ी: बिना इंटरव्यू के नौकरी का ऑफर, ज़ेल/क्रिप्टो के माध्यम से $250 "सॉफ्टवेयर लाइसेंस एवं प्रशिक्षण शुल्क" की मांग।',
    isRead: false,
    scamAssessment: {
      riskLevel: 'HIGH',
      riskScore: 96,
      reasons: [
        'Requests advance payment ($250 refundable deposit) to secure employment',
        'Suspicious non-corporate domain (.biz with hyphens)',
        'Guaranteed job offer without any formal technical or human interview',
        'High urgency tactics ("must pay within 24 hours to secure seat")',
        'Requests payment via non-reversible methods (Zelle, crypto)'
      ],
      reasonsHi: [
        'नौकरी पाने के लिए अग्रिम भुगतान ($250 वापसी योग्य जमा) की मांग',
        'संदिग्ध गैर-कॉर्पोरेट डोमेन (हाइफ़न वाला .biz)',
        'बिना किसी औपचारिक या तकनीकी इंटरव्यू के सीधे चयन का दावा',
        'अत्यधिक जल्दबाजी की रणनीति ("24 घंटे के भीतर सीट सुरक्षित करें")',
        'अपरिवर्तनीय तरीकों (ज़ेल, क्रिप्टोकरेंसी) से पैसे भेजने का अनुरोध'
      ],
      evidence: [
        'Congratulations! You have been selected without further interview',
        'pay a 100% refundable software licensing & equipment security fee of $250.00',
        'Payment must be completed via Zelle, CashApp, or Bitcoin wallet within 24 hours'
      ],
      recommendedActions: [
        'DO NOT send any money or cryptocurrency.',
        'Do not click any embedded links in this email.',
        'Mark email as spam and report fraudulent sender.',
        'Legitimate companies never ask candidates to pay for software or equipment upfront.'
      ],
      recommendedActionsHi: [
        'कोई भी पैसा या क्रिप्टोकरेंसी बिल्कुल न भेजें।',
        'इस ईमेल में दिए गए किसी भी लिंक पर क्लिक न करें।',
        'ईमेल को स्पैम के रूप में चिह्नित करें और प्रेषक की रिपोर्ट करें।',
        'वैध कंपनियां कभी भी उम्मीदवारों से सॉफ्टवेयर या उपकरण के पैसे पहले नहीं मांगतीं।'
      ],
      reviewed: false,
      suspiciousPhrases: [
        'selected without further interview',
        'software licensing & equipment security fee of $250.00',
        'Zelle, CashApp, or Bitcoin wallet',
        'within 24 hours to secure your spot'
      ]
    },
    body: `DEAR CANDIDATE,

CONGRATULATIONS! We reviewed your profile online and you have been SELECTED WITHOUT FURTHER INTERVIEW for the prestigious position of Remote Data Entry & Operations Specialist at Apex Global.

SALARY & PERKS:
- Starting Pay: $52.00 per hour (paid weekly)
- Flexible 20-40 hours per week
- Company Apple MacBook Pro and dual monitors provided

NEXT CRITICAL STEP:
To disburse your home-office equipment and configure your proprietary data portal access, you must pay a 100% refundable software licensing & equipment security fee of $250.00. This amount will be fully credited back on your very first payroll check!

Payment must be completed via Zelle, CashApp, or Bitcoin wallet within 24 hours to secure your spot, otherwise your job offer will be permanently revoked and offered to the next applicant in line.

Send confirmation of deposit to this email immediately.

Warmest Congratulations,
Apex Global Careers HR Onboarding Desk`
  },
  {
    id: 'em-12',
    senderName: 'Vertex Talent Group',
    senderEmail: 'onboarding@vertex-quickhire-portal.info',
    company: 'Apex Vertex Talent',
    jobTitle: 'Virtual Executive Assistant',
    subject: 'Direct Deposit Verification & Background Check Payment Required',
    receivedAt: '2026-10-21T07:30:00Z',
    classification: 'Potential Scam',
    summary: 'HIGH RISK SCAM: Requesting $350 wire transfer for background verification fee plus online banking password / OTP for direct deposit setup.',
    summaryHi: 'उच्च जोखिम धोखाधड़ी: बैकग्राउंड वेरिफिकेशन के नाम पर $350 वायर ट्रांसफर तथा बैंक लॉगिन/ओटीपी की मांग।',
    isRead: false,
    scamAssessment: {
      riskLevel: 'HIGH',
      riskScore: 98,
      reasons: [
        'Explicitly requests banking passwords and One-Time Passwords (OTP)',
        'Demands $350 fee for standard background investigation',
        'Suspicious free/cheap top-level domain (.info)',
        'Critical phishing and financial fraud indicators'
      ],
      reasonsHi: [
        'स्पष्ट रूप से बैंकिंग पासवर्ड और वन-टाइम पासवर्ड (ओटीपी) मांगना',
        'बैकग्राउंड जांच के नाम पर $350 शुल्क की मांग',
        'संदिग्ध डोमेन (.info)',
        'गंभीर फ़िशिंग और वित्तीय धोखाधड़ी के स्पष्ट संकेत'
      ],
      evidence: [
        'send your online banking login ID, temporary password and the 6-digit SMS OTP',
        'pay the mandatory $350 background screening clearance fee via Western Union'
      ],
      recommendedActions: [
        'NEVER share bank passwords or OTPs with any employer or recruiter.',
        'Do not wire any money via Western Union.',
        'Block sender and preserve communication for law enforcement reporting.'
      ],
      recommendedActionsHi: [
        'किसी भी नियोक्ता या रिक्रूटर के साथ बैंक पासवर्ड या ओटीपी कभी साझा न करें।',
        'वेस्टर्न यूनियन के जरिए कोई पैसा न भेजें।',
        'प्रेषक को तुरंत ब्लॉक करें।'
      ],
      reviewed: false,
      suspiciousPhrases: [
        'online banking login ID, temporary password and the 6-digit SMS OTP',
        '$350 background screening clearance fee',
        'Western Union wire transfer'
      ]
    },
    body: `Hello Applicant,

Your hiring process for the Virtual Executive Assistant position has been approved by senior management.

Before your employment contract can be executed, our finance division requires your direct deposit setup. Please reply directly with:
1. Your Full Bank Name & Account Number
2. Your Online Banking Login ID, temporary password and the 6-digit SMS OTP that will be sent to your phone.
3. Also pay the mandatory $350 background screening clearance fee via Western Union to our compliance officer in Manila.

Failure to provide these details by 5:00 PM today will cancel your appointment.

Vertex Talent Payroll Division`
  },
  {
    id: 'em-13',
    senderName: 'Global Hire Staffing',
    senderEmail: 'recruiter.globalhire@gmail.com',
    company: 'Global Hire Staffing',
    jobTitle: 'International Project Coordinator',
    subject: 'Interview on Telegram: High Paying Part-Time Job Opportunity',
    receivedAt: '2026-10-22T06:15:00Z',
    classification: 'Potential Scam',
    summary: 'MEDIUM RISK: Free webmail sender asking to conduct job interview over Telegram messaging with vague requirements and inflated pay.',
    summaryHi: 'मध्यम जोखिम: मुफ़्त जीमेल प्रेषक द्वारा टेलीग्राम पर इंटरव्यू आयोजित करने का अनुरोध, अस्पष्ट पद और अवास्तविक वेतन।',
    isRead: false,
    scamAssessment: {
      riskLevel: 'MEDIUM',
      riskScore: 68,
      reasons: [
        'Recruiter using generic free webmail (@gmail.com) for corporate hiring',
        'Directs candidate to communicate via unmonitored Telegram channel (@recruiter_telegram99)',
        'Unrealistic compensation ($45-$85/hr part-time) for minimal qualifications',
        'Vague company details with no verifiable physical address'
      ],
      reasonsHi: [
        'कॉर्पोरेट भर्ती के लिए रिक्रूटर द्वारा सामान्य मुफ़्त वेबमेल (@gmail.com) का उपयोग',
        'उम्मीदवार को टेलीग्राम चैनल (@recruiter_telegram99) पर बात करने का निर्देश',
        'न्यूनतम योग्यता के लिए अवास्तविक वेतन ($45-$85/घंटा पार्ट-टाइम)',
        'बिना किसी सत्यापन योग्य पते के अस्पष्ट कंपनी विवरण'
      ],
      evidence: [
        'Add our Chief Hiring Manager on Telegram: @recruiter_telegram99',
        'Pay is $4,500 every two weeks for simple 10 hours work'
      ],
      recommendedActions: [
        'Do not switch to Telegram or WhatsApp for corporate interviews.',
        'Request an official corporate email address and LinkedIn profile for verification.',
        'Be extremely skeptical of inflated wages for minimal hours.'
      ],
      recommendedActionsHi: [
        'कॉर्पोरेट इंटरव्यू के लिए टेलीग्राम या व्हाट्सएप पर न जाएं।',
        'सत्यापन के लिए आधिकारिक कॉर्पोरेट ईमेल पते और लिंक्डइन प्रोफ़ाइल का अनुरोध करें।',
        'कम काम के लिए अत्यधिक वेतन के वादों से सावधान रहें।'
      ],
      reviewed: false,
      suspiciousPhrases: [
        'Telegram: @recruiter_telegram99',
        '$4,500 every two weeks for simple 10 hours work',
        'Immediate online chat interview'
      ]
    },
    body: `Hello,

We came across your profile and think you are an ideal fit for our International Project Coordinator role.

Pay is $4,500 every two weeks for simple 10 hours work from home. No prior experience is required as full online mentoring is provided.

To conduct your immediate online chat interview, please download the Telegram app and message our Chief Hiring Manager directly:
Telegram username: @recruiter_telegram99
Interview Code: #GH-9021

Do not reply to this email, message on Telegram right away.

Global Hire Staffing Team`
  },
  {
    id: 'em-14',
    senderName: 'Canva Talent Team',
    senderEmail: 'careers@canva.com',
    company: 'Canva',
    jobTitle: 'Frontend Engineer',
    subject: 'We received your application for Frontend Engineer at Canva!',
    receivedAt: '2026-10-15T09:00:00Z',
    classification: 'Application Confirmation',
    summary: 'Application submitted 9 days ago. Follow-up reminder active.',
    summaryHi: '9 दिन पूर्व आवेदन जमा हुआ। फॉलो-अप रिमाइंडर सक्रिय है।',
    isRead: true,
    scamAssessment: {
      riskLevel: 'LOW',
      riskScore: 2,
      reasons: ['Authenticated canva.com domain and standard acknowledgement'],
      reasonsHi: ['सत्यापित canva.com डोमेन और मानक पावती'],
      evidence: [],
      recommendedActions: ['Follow-up is recommended as 9 days have elapsed without updates.'],
      recommendedActionsHi: ['फॉलो-अप की सिफारिश की जाती है क्योंकि 9 दिन बीत चुके हैं।'],
      reviewed: true,
      suspiciousPhrases: []
    },
    body: `Hi there,

Thanks for applying to Canva! We are thrilled that you want to help empower the world to design.

Our engineering team is actively reviewing submissions for the Frontend Engineer position in our Core Editor team. If your experience aligns with our needs, one of our recruiters will reach out to schedule an introductory call.

In the meantime, feel free to explore our engineering culture at canva.dev.

Warmly,
The Canva Talent Acquisition Team`
  },
  {
    id: 'em-15',
    senderName: 'Uber University & Tech Recruiting',
    senderEmail: 'donotreply@uber.com',
    company: 'Uber',
    jobTitle: 'Mobile Engineer (iOS/Android)',
    subject: 'Update regarding your application with Uber',
    receivedAt: '2026-10-14T17:10:00Z',
    classification: 'Rejection',
    summary: 'Polite rejection after initial resume screening.',
    summaryHi: 'प्रारंभिक बायोडाटा स्क्रीनिंग के बाद विनम्र अस्वीकृति संदेश।',
    isRead: true,
    scamAssessment: {
      riskLevel: 'LOW',
      riskScore: 1,
      reasons: ['Standard ATS automated rejection from verified uber.com address'],
      reasonsHi: ['सत्यापित uber.com पते से मानक एटीएस अस्वीकृति'],
      evidence: [],
      recommendedActions: ['No action required. Reapplication permitted after 6 months.'],
      recommendedActionsHi: ['किसी कार्रवाई की आवश्यकता नहीं। 6 महीने बाद पुनः आवेदन मान्य।'],
      reviewed: true,
      suspiciousPhrases: []
    },
    body: `Hello,

Thank you for your interest in Uber and for taking the time to apply for the Mobile Engineer position.

We reviewed your qualifications carefully, and while we appreciate your experience, we have decided not to move forward with your candidacy for this role at this time due to high competition for this position.

We encourage you to continue checking our careers page at uber.com/careers for future positions that match your skills.

Sincerely,
Uber Talent Acquisition`
  },
  {
    id: 'em-16',
    senderName: 'Sanjay Nair',
    senderEmail: 'sanjaynair@microsoft.com',
    company: 'Microsoft',
    jobTitle: 'Cloud Engineer',
    subject: 'Microsoft Azure Core: Scheduling your Technical Loop Interviews',
    receivedAt: '2026-10-22T19:30:00Z',
    classification: 'Interview Invitation',
    summary: 'Virtual technical loop of 3 rounds scheduled for Oct 29, 2026 via Microsoft Teams.',
    summaryHi: '29 अक्टूबर 2026 को माइक्रोसॉफ्ट टीम्स के माध्यम से 3 राउंड का तकनीकी लूप निर्धारित।',
    isRead: true,
    scamAssessment: {
      riskLevel: 'LOW',
      riskScore: 3,
      reasons: [
        'Direct email from verified microsoft.com corporate tenant',
        'Official Microsoft Teams video conference invite provided',
        'Standard hiring process for Azure infrastructure'
      ],
      reasonsHi: [
        'सत्यापित microsoft.com कॉर्पोरेट टेनेंट से सीधा ईमेल',
        'आधिकारिक माइक्रोसॉफ्ट टीम्स वीडियो कॉन्फ्रेंस आमंत्रण',
        'अज़ूर इंफ्रास्ट्रक्चर के लिए मानक भर्ती प्रक्रिया'
      ],
      evidence: [],
      recommendedActions: ['Confirm attendance and test Microsoft Teams audio/video setup.'],
      recommendedActionsHi: ['उपस्थिति की पुष्टि करें और माइक्रोसॉफ्ट टीम्स सेटअप का परीक्षण करें।'],
      reviewed: true,
      suspiciousPhrases: []
    },
    body: `Hi,

Following up on your phone screen with our engineering director last Friday, we are delighted to invite you to our virtual Technical Loop for the Cloud Engineer position within Azure Core.

Loop Details:
- Date: Thursday, October 29, 2026
- Format: 3 rounds (Coding, Cloud Architecture, Culture & Collaboration)
- Time: 9:00 AM – 1:30 PM PST with a 45-minute break
- Meeting Link: Official Microsoft Teams invite will be sent directly to your calendar.

Please review the attached guide on preparing for Microsoft technical interviews. Let me know if you have any questions or timing conflicts.

Best regards,
Sanjay Nair
Senior Talent Advisor | Microsoft Azure Engineering`
  },
  {
    id: 'em-17',
    senderName: 'Kylie Ward',
    senderEmail: 'kward@atlassian.com',
    company: 'Atlassian',
    jobTitle: 'Principal Engineer',
    subject: 'Atlassian Next Steps: Compensation Discussions & Background Verification',
    receivedAt: '2026-10-23T16:20:00Z',
    classification: 'Recruiter Response',
    summary: 'Legitimate request: Recruiter discussing compensation expectations and requesting standard proof of identity (passport/work authorization) for background check.',
    summaryHi: 'वैध अनुरोध: रिक्रूटर वेतन अपेक्षाओं पर चर्चा कर रहे हैं और सत्यापन हेतु वैध पासपोर्ट/पहचान प्रमाण मांग रहे हैं।',
    isRead: true,
    scamAssessment: {
      riskLevel: 'LOW',
      riskScore: 12,
      reasons: [
        'Legitimate corporate domain (@atlassian.com) verified with SPF/DKIM',
        'Requests identity documentation at an appropriate stage (post-final interview)',
        'Uses accredited third-party background screening portal (HireRight)',
        'Does NOT request banking passwords, OTPs, or upfront fees',
        'Clear distinction: legitimate documentation requests occur through secure third-party portals with explicit consent'
      ],
      reasonsHi: [
        'सत्यापित कॉर्पोरेट डोमेन (@atlassian.com)',
        'उचित चरण (अंतिम इंटरव्यू के बाद) में पहचान दस्तावेज़ों का अनुरोध',
        'मान्यता प्राप्त थर्ड-पार्टी पोर्टल (HireRight) का उपयोग',
        'बैंकिंग पासवर्ड, ओटीपी या अग्रिम शुल्क की कोई मांग नहीं',
        'स्पष्ट अंतर: वैध दस्तावेज़ अनुरोध सुरक्षित पोर्टल के माध्यम से होते हैं'
      ],
      evidence: [],
      recommendedActions: [
        'Complete the background verification directly inside the HireRight secure portal.',
        'Schedule your compensation call with Kylie for early next week.'
      ],
      recommendedActionsHi: [
        'HireRight सुरक्षित पोर्टल के अंदर सीधे सत्यापन पूरा करें।',
        'अगले सप्ताह की शुरुआत के लिए कायली के साथ कॉल शेड्यूल करें।'
      ],
      reviewed: true,
      suspiciousPhrases: []
    },
    body: `Hi,

Huge congratulations on completing your final engineering loop yesterday! The feedback from the interview panel was outstanding, and we are preparing to move to an offer for the Principal Engineer role.

Before our VP signs off on the final compensation package (targeting base of $210,000 + equity), our People Operations team initiates our standard pre-employment verification via HireRight.

You will receive an automated invitation from HireRight shortly. They will ask you to upload a scan of your government-issued ID (passport or state ID) and proof of work authorization. 

Please note: Atlassian and HireRight will NEVER ask you for bank account passwords or money for a background check.

Let me know your availability on Monday afternoon for a quick call to talk numbers!

Cheers,
Kylie Ward
Principal Talent Partner | Atlassian`
  },
  {
    id: 'em-18',
    senderName: 'Liam O\'Connor',
    senderEmail: 'liam@linear.app',
    company: 'Linear',
    jobTitle: 'Software Engineer',
    subject: 'Linear: Checking in regarding your software engineer application',
    receivedAt: '2026-10-23T15:00:00Z',
    classification: 'Recruiter Response',
    summary: 'Recruiter proactively reaching out to check candidate availability for next week chat.',
    summaryHi: 'अगले सप्ताह की बातचीत के लिए उम्मीदवार की उपलब्धता की जांच हेतु रिक्रूटर का संदेश।',
    isRead: true,
    scamAssessment: {
      riskLevel: 'LOW',
      riskScore: 2,
      reasons: ['Authenticated linear.app domain and direct personal outreach'],
      reasonsHi: ['सत्यापित linear.app डोमेन और सीधा व्यक्तिगत संपर्क'],
      evidence: [],
      recommendedActions: ['Respond promptly with your calendar availability for next week.'],
      recommendedActionsHi: ['अगले सप्ताह के लिए अपनी कैलेंडर उपलब्धता के साथ तुरंत उत्तर दें।'],
      reviewed: true,
      suspiciousPhrases: []
    },
    body: `Hey there,

I am Liam from the engineering team at Linear. We went through your application for the Software Engineer position and loved your work on high-performance web frontends.

We are a small, fast-paced team and would love to have a relaxed 30-minute chat with you next week to show you how we work and hear more about what problems you enjoy solving.

Do you have any 30-minute windows open on Wednesday or Thursday afternoon?

Cheers,
Liam
Linear | linear.app`
  },
  {
    id: 'em-19',
    senderName: 'Salesforce & Slack Careers',
    senderEmail: 'recruiting@slack-corp.com',
    company: 'Slack',
    jobTitle: 'Frontend Specialist',
    subject: 'Application Confirmation: Frontend Specialist, Slack Desktop',
    receivedAt: '2026-10-10T12:00:00Z',
    classification: 'Application Confirmation',
    summary: 'Application submitted 14 days ago. 14 days with no response, overdue follow-up reminder active.',
    summaryHi: '14 दिन पूर्व आवेदन जमा हुआ था। बिना जवाब के 14 दिन बीत चुके हैं, फॉलो-अप आवश्यक है।',
    isRead: false,
    scamAssessment: {
      riskLevel: 'LOW',
      riskScore: 3,
      reasons: ['Authentic ATS confirmation from Slack/Salesforce recruitment'],
      reasonsHi: ['स्लैक/सेल्सफोर्स भर्ती से प्रामाणिक एटीएस पावती'],
      evidence: [],
      recommendedActions: ['Follow-up is overdue by 7 days. Send polite inquiry.'],
      recommendedActionsHi: ['फॉलो-अप में 7 दिन की देरी हो चुकी है। विनम्र पूछताछ भेजें।'],
      reviewed: false,
      suspiciousPhrases: []
    },
    body: `Hello,

We are confirming receipt of your job application for Frontend Specialist on the Slack Desktop application team.

Our talent partners are reviewing candidates on a rolling basis. If your qualifications match our current roadmap, we will contact you.

You can monitor application progress on the Salesforce Candidate Portal.

Thank you,
Slack Recruitment Team`
  },
  {
    id: 'em-20',
    senderName: 'Guillermo Rauch & Vercel Talent',
    senderEmail: 'recruiting@vercel.com',
    company: 'Vercel',
    jobTitle: 'Developer Experience Advocate',
    subject: 'Interview Scheduled: Developer Experience Advocate at Vercel',
    receivedAt: '2026-10-24T08:00:00Z',
    classification: 'Interview Invitation',
    summary: 'Introductory conversation scheduled for tomorrow (Oct 25, 2026) at 10:00 AM PST.',
    summaryHi: 'कल (25 अक्टूबर 2026) सुबह 10:00 बजे परिचयात्मक बातचीत निर्धारित।',
    isRead: true,
    scamAssessment: {
      riskLevel: 'LOW',
      riskScore: 2,
      reasons: ['Authenticated vercel.com domain with official Google Meet calendar integration'],
      reasonsHi: ['सत्यापित vercel.com डोमेन और आधिकारिक गूगल मीट कैलेंडर एकीकरण'],
      evidence: [],
      recommendedActions: ['Review Next.js ecosystem updates and community case studies before call.'],
      recommendedActionsHi: ['कॉल से पहले Next.js इकोसिस्टम अपडेट और केस स्टडीज की समीक्षा करें।'],
      reviewed: true,
      suspiciousPhrases: []
    },
    body: `Hi!

We are excited to chat about the Developer Experience Advocate role at Vercel! Your open-source contributions and community tutorials caught our eye.

Your interview is scheduled for tomorrow:
Date: Sunday, October 25, 2026
Time: 10:00 AM – 10:45 AM PST
Meet Link: https://meet.google.com/ver-cel-dxa

We will chat about developer ergonomics, Next.js App Router insights, and what gets you most excited about web performance.

See you on screen!
Vercel Talent Team`
  }
];
