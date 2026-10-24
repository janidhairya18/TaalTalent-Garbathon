import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Shield, 
  Search, 
  Globe, 
  Bell, 
  RotateCcw, 
  CheckCheck, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  X,
  User,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { 
    language, 
    setLanguage, 
    t, 
    globalSearch, 
    setGlobalSearch, 
    notifications, 
    markNotificationRead, 
    dismissNotification, 
    markAllNotificationsRead,
    resetDemoData,
    setActiveTab,
    setSelectedEmailId,
    currentUser,
    switchRole,
    logout
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read && !n.dismissed).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationRead(notif.id);
    if (notif.viewTarget) {
      setActiveTab(notif.viewTarget);
    }
    if (notif.linkedId) {
      setSelectedEmailId(notif.linkedId);
    }
    setShowNotifications(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3 transition-colors w-full">
      <div className="w-full flex items-center justify-between gap-4">
        
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <div 
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Taal<span className="text-indigo-600">Talent</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Sparkles className="w-2.5 h-2.5" />
                  {t('aiProtected')}
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 font-medium -mt-0.5">
                {t('appTagline')}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-sm text-slate-800 placeholder-slate-400 pl-9 pr-8 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            />
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Controls: Language Toggle, Notifications, Reset Demo, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Language Toggle Button */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                language === 'en'
                  ? 'bg-white text-indigo-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to English"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>EN</span>
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                language === 'hi'
                  ? 'bg-white text-indigo-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="हिन्दी में बदलें"
            >
              <span>हिन्दी</span>
            </button>
          </div>

          {/* Reset Demo Data Quick Action */}
          <button
            onClick={resetDemoData}
            title={t('resetDemo')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50/70 rounded-xl border border-slate-200 hover:border-indigo-200 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{t('resetDemo')}</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-sm text-slate-800">
                      {t('notifications')}
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      {t('markAllRead')}
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.filter((n) => !n.dismissed).length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">
                      <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      {t('noNotifications')}
                    </div>
                  ) : (
                    notifications
                      .filter((n) => !n.dismissed)
                      .slice(0, 10)
                      .map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-start gap-3 ${
                            !n.read ? 'bg-indigo-50/40' : ''
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {n.type === 'scam' && (
                              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4" />
                              </div>
                            )}
                            {n.type === 'interview' && (
                              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                                <Calendar className="w-4 h-4" />
                              </div>
                            )}
                            {n.type === 'followup' && (
                              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Clock className="w-4 h-4" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                              {language === 'hi' ? n.titleHi : n.titleEn}
                            </p>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                              {language === 'hi' ? n.messageHi : n.messageEn}
                            </p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {new Date(n.timestamp).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissNotification(n.id);
                            }}
                            className="text-slate-300 hover:text-slate-500 p-1"
                            title={t('dismiss')}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill & Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 text-left hover:opacity-90 focus:outline-none transition"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-sm ${
                currentUser?.role === 'admin' 
                  ? 'bg-gradient-to-tr from-purple-700 to-indigo-800 ring-2 ring-purple-300' 
                  : 'bg-gradient-to-tr from-indigo-600 to-blue-600'
              }`}>
                {currentUser?.role === 'admin' ? 'AD' : 'US'}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-none">
                  {currentUser?.name || (currentUser?.role === 'admin' ? 'Admin Reviewer' : 'Candidate User')}
                </p>
                <span className={`text-[10px] font-bold mt-0.5 inline-block ${
                  currentUser?.role === 'admin' ? 'text-purple-600' : 'text-emerald-600'
                }`}>
                  {currentUser?.role === 'admin' ? 'HR Admin' : 'Candidate User'}
                </span>
              </div>
            </button>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in space-y-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl space-y-1">
                  <p className="font-bold text-slate-800">{currentUser?.name}</p>
                  <p className="text-slate-500 text-[11px] truncate">{currentUser?.email}</p>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                    currentUser?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {currentUser?.role === 'admin' ? 'HR Admin Mode' : 'Candidate Mode'}
                  </span>
                </div>

                <div className="pt-1 space-y-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      switchRole(currentUser?.role === 'admin' ? 'user' : 'admin');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 font-semibold flex items-center justify-between transition"
                  >
                    <span>Switch to {currentUser?.role === 'admin' ? 'Candidate User' : 'HR Admin'}</span>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded">1-Click</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 font-semibold flex items-center gap-1.5 transition"
                  >
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
