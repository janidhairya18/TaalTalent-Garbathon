import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, CheckCircle2, ShieldCheck, Mail, Calendar } from 'lucide-react';

export const AnalysisProgressModal: React.FC = () => {
  const { isAnalysing, analysisProgress, language } = useApp();

  if (!isAnalysing) return null;

  const steps = [
    { num: 1, labelEn: 'Read email headers & sender verification', labelHi: 'ईमेल हेडर एवं प्रेषक सत्यापन' },
    { num: 2, labelEn: 'Recruitment scam & fee demand detection', labelHi: 'भर्ती धोखाधड़ी एवं शुल्क मांग जांच' },
    { num: 3, labelEn: 'Application pipeline status extraction', labelHi: 'आवेदन पाइपलाइन स्थिति निष्कर्षण' },
    { num: 4, labelEn: '7-day follow-up reminder scheduling', labelHi: '7-दिवसीय फॉलो-अप रिमाइंडर शेड्यूलिंग' },
  ];

  const percent = Math.round((analysisProgress.step / analysisProgress.total) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-center space-y-5">
        
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-bounce">
          <Sparkles className="w-7 h-7" />
        </div>

        <div>
          <h3 className="font-heading font-extrabold text-lg text-slate-900">
            {language === 'hi' ? 'एआई भर्ती विश्लेषण प्रगति पर है' : 'TaalTalent AI Engine Processing'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {analysisProgress.message}
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-bold text-slate-600">
            <span>{language === 'hi' ? 'प्रगति' : 'Pipeline Progress'}</span>
            <span className="text-indigo-600">{percent}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Step checklist */}
        <div className="text-left space-y-2 pt-2 border-t border-slate-100">
          {steps.map((st) => {
            const isCompleted = analysisProgress.step > st.num;
            const isCurrent = analysisProgress.step === st.num;
            return (
              <div
                key={st.num}
                className={`flex items-center gap-2.5 text-xs transition-colors ${
                  isCurrent
                    ? 'text-indigo-600 font-bold'
                    : isCompleted
                    ? 'text-emerald-700 font-medium'
                    : 'text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <div
                    className={`w-4 h-4 rounded-full border text-[10px] flex items-center justify-center shrink-0 ${
                      isCurrent
                        ? 'border-indigo-600 text-indigo-600 font-bold animate-spin'
                        : 'border-slate-300 text-slate-400'
                    }`}
                  >
                    {isCurrent ? '•' : st.num}
                  </div>
                )}
                <span>{language === 'hi' ? st.labelHi : st.labelEn}</span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
