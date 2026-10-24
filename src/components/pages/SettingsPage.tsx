import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings as SettingsIcon, 
  Globe, 
  KeyRound, 
  ShieldCheck, 
  Trash2, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    geminiApiKey, 
    setGeminiApiKey, 
    t, 
    showToast, 
    resetDemoData, 
    purgeAllData, 
    exportDataJson, 
    importDataJson 
  } = useApp();

  const [inputKey, setInputKey] = useState(geminiApiKey);
  const [showKey, setShowKey] = useState(false);
  const [testingKey, setTestingKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSaveKey = () => {
    setGeminiApiKey(inputKey.trim());
    showToast(language === 'hi' ? 'एपीआई कुंजी सहेजी गई' : 'Gemini API Key updated', 'success');
  };

  const handleTestConnection = async () => {
    const key = inputKey.trim();
    if (!key) {
      showToast('Please enter an API key first', 'warning');
      return;
    }

    setTestingKey(true);
    setKeyStatus('idle');

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
      if (res.ok) {
        setKeyStatus('success');
        setGeminiApiKey(key);
        showToast(t('apiStatusConnected'), 'success');
      } else {
        setKeyStatus('error');
        showToast(`Connection failed: HTTP ${res.status}`, 'error');
      }
    } catch (err: any) {
      setKeyStatus('error');
      showToast(`Error connecting to Gemini API: ${err.message}`, 'error');
    } finally {
      setTestingKey(false);
    }
  };

  const handleExportJson = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taaltalent_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup JSON downloaded!', 'success');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      importDataJson(content);
    };
    reader.readAsText(file);
  };

  const handlePurge = () => {
    if (window.confirm(t('clearAllConfirm'))) {
      purgeAllData();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
        <h1 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-indigo-600" />
          <span>{t('settingsHeading')}</span>
        </h1>
        <p className="text-xs text-slate-500">
          {t('settingsSubheading')}
        </p>
      </div>

      {/* Language Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-600" />
          <h2 className="font-heading font-bold text-sm text-slate-800">
            {t('prefSection')}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              {t('langSelectLabel')}
            </label>
            <p className="text-[11px] text-slate-400">
              Instant UI translations across navigation, reminders, and scam alerts.
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-lg transition ${
                language === 'en'
                  ? 'bg-white text-indigo-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-4 py-2 rounded-lg transition ${
                language === 'hi'
                  ? 'bg-white text-indigo-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिन्दी (Hindi)
            </button>
          </div>
        </div>
      </div>

      {/* AI Configuration Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h2 className="font-heading font-bold text-sm text-slate-800">
            {t('aiConfigSection')}
          </h2>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {t('aiConfigDesc')}
        </p>

        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('geminiKeyLabel')}
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder={t('geminiKeyPlaceholder')}
                  className="w-full text-xs font-mono p-2.5 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleSaveKey}
                className="px-3.5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm"
              >
                {t('save')}
              </button>

              <button
                type="button"
                disabled={testingKey}
                onClick={handleTestConnection}
                className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition disabled:opacity-50"
              >
                {testingKey ? 'Testing...' : t('testApiKey')}
              </button>
            </div>
          </div>

          {/* Engine status indicator */}
          <div className="flex items-center gap-2 text-xs">
            {geminiApiKey ? (
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('apiStatusConnected')}</span>
              </span>
            ) : (
              <span className="text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>{t('apiStatusFallback')}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Demo Data Management */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-indigo-600" />
          <h2 className="font-heading font-bold text-sm text-slate-800">
            Demo Sandbox Controls
          </h2>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Reload the standardized 20 recruitment emails with varying dates, interviews, offers, and fraud detection scenarios.
        </p>

        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={resetDemoData}
            className="px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('resetDemo')}</span>
          </button>
        </div>
      </div>

      {/* Privacy & Data Storage */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="font-heading font-bold text-sm text-slate-800">
            {t('privacySection')}
          </h2>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {t('privacyDesc')}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('exportAllJson')}</span>
          </button>

          <label className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-1.5 cursor-pointer transition">
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('importBackup')}</span>
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>

          <button
            onClick={handlePurge}
            className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center gap-1.5 transition ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>{t('clearAllData')}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
