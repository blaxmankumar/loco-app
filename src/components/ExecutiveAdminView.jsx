import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Download,
  Edit3,
  ExternalLink,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  LayoutDashboard,
  MapPin,
  Megaphone,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { ALL_LOBBIES, ANALYTICS_DATASETS, DIVISION_LOBBIES, DIVISIONS, HELPLINES, OFFICIAL_DRIVE_DOCS_URL, ROLES } from '../data/initialData';
import { LocoLogo, OfficerAvatar } from './BrandAssets';
import LiveTrackingMap from './LiveTrackingMap';
import ImportantNumbersPanel from './ImportantNumbersPanel';

export default function ExecutiveAdminView({
  dark = false,
  onOpenContactModal,
  onOpenNoticeModal,
  onOpenUploadModal,
  onOpenIncidentModal,
  onPreviewDoc,
  onPreviewNotice,
  onOpenAuth,
}) {
  const {
    totalUsers,
    pendingApprovalsTotal,
    activeNoticesTotal,
    sharedDocsTotal,
    incidentReportsTotal,
    pendingApprovals,
    contacts,
    notices,
    documents,
    alerts,
    incidents,
    approveUser,
    rejectUser,
    deleteContact,
    deleteNotice,
    deleteDocument,
    exportReportCsv,
    resetDemo,
    t,
  } = useAppState();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [dirView, setDirView] = useState('crew'); // 'crew' | 'official'
  const [dirDivision, setDirDivision] = useState('All');
  const [dirLobby, setDirLobby] = useState('All');
  const [dirRole, setDirRole] = useState('All');
  const [dirLimit, setDirLimit] = useState(120);
  const [analyticsMode, setAnalyticsMode] = useState('By Division');
  const [notifOpen, setNotifOpen] = useState(false);

  const visibleLobbies = dirDivision === 'All' ? ALL_LOBBIES : DIVISION_LOBBIES[dirDivision] || [];

  const topTabs = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'tracking', label: t('liveTracking'), icon: MapPin, dot: true },
    { id: 'directory', label: t('crewDirectory'), icon: Users },
    { id: 'approvals', label: t('approvals'), icon: ShieldCheck, badge: pendingApprovals.length },
    { id: 'notices', label: t('notices'), icon: Megaphone },
    { id: 'documents', label: t('documents'), icon: FolderOpen },
    { id: 'helplines', label: t('helplines'), icon: Phone },
    { id: 'reports', label: t('reports'), icon: BarChart3 },
  ];

  const filteredContacts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return contacts.filter((c) => {
      if (dirDivision !== 'All' && !(c.division || '').toLowerCase().includes(dirDivision.toLowerCase())) return false;
      if (dirLobby !== 'All' && (c.lobby || '') !== dirLobby && !dirLobby.toLowerCase().includes(`(${(c.station || '').toLowerCase()})`)) return false;
      if (dirRole !== 'All' && c.role !== dirRole) return false;
      if (!q) return true;
      return `${c.name} ${c.employeeId || ''} ${c.designation || ''} ${c.station} ${c.lobby || ''} ${c.phone} ${c.division} ${c.role}`.toLowerCase().includes(q);
    });
  }, [contacts, dirDivision, dirLobby, dirRole, search]);

  const chartData = ANALYTICS_DATASETS[analyticsMode] || ANALYTICS_DATASETS['By Division'];

  const pageBg = dark ? 'bg-[#091326] text-slate-100' : 'bg-[#F3F2EF] text-[#0E2347]';
  const cardCls = dark
    ? 'bg-[#101F3C] border border-white/10 text-slate-100 shadow-lg'
    : 'bg-white border border-slate-200/90 text-[#0E2347] shadow-[0_1px_4px_rgba(14,35,71,0.06)]';
  const subText = dark ? 'text-slate-400' : 'text-slate-500';
  const softBg = dark ? 'bg-white/5 border-white/10' : 'bg-[#F8FAFC] border-slate-200/70';

  return (
    <div className={`min-h-[calc(100vh-52px)] ${pageBg} transition-colors`}>
      {/* LINKEDIN-STYLE CLEAN EXECUTIVE TOP NAV */}
      <header
        className={`sticky top-[52px] z-30 border-b ${
          dark ? 'bg-[#0D1B36]/95 border-white/10' : 'bg-white/95 border-slate-200'
        } backdrop-blur-md`}
      >
        <div className="max-w-[1380px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand + Search */}
          <div className="flex items-center gap-3 min-w-0">
            <LocoLogo size={38} />
            <div className="relative w-52 sm:w-64 lg:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className={`w-full pl-9 pr-3 py-2 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#D4A13B] ${
                  dark
                    ? 'bg-white/10 text-white placeholder:text-slate-400 border border-white/10'
                    : 'bg-[#EEF3F8] text-[#0E2347] placeholder:text-slate-500'
                }`}
              />
            </div>
          </div>

          {/* Center: Clean Icon + Label Horizontal Nav (LinkedIn Style) */}
          <nav className="hidden xl:flex items-center gap-1 h-full">
            {topTabs.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative h-full px-3.5 flex flex-col items-center justify-center gap-0.5 text-[11px] font-bold border-b-2 transition ${
                    active
                      ? dark
                        ? 'border-[#F3D27A] text-[#F3D27A]'
                        : 'border-[#0A66C2] text-[#0E2347]'
                      : dark
                      ? 'border-transparent text-slate-400 hover:text-white'
                      : 'border-transparent text-slate-500 hover:text-[#0E2347]'
                  }`}
                >
                  <div className="relative">
                    <Icon className="w-[18px] h-[18px]" />
                    {item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-[16px] px-1 rounded-full bg-red-600 text-white text-[9px] font-extrabold flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                    {item.dot && (
                      <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    )}
                  </div>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Live Notification Bell + Admin Avatar */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className={`relative w-10 h-10 rounded-xl border flex items-center justify-center transition ${
                  dark ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-[#0E2347]'
                }`}
                title="Approval Notifications & Alerts"
              >
                <Bell className="w-4 h-4" />
                {pendingApprovals.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-extrabold flex items-center justify-center animate-bounce">
                    {pendingApprovals.length}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-[#0E2347] rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-50 space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-extrabold">
                      🔔 Notifications ({pendingApprovals.length} Pending Approvals)
                    </span>
                    <button onClick={() => setNotifOpen(false)} className="text-xs text-slate-400 hover:text-slate-600">
                      Close
                    </button>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {pendingApprovals.length === 0 ? (
                      <p className="text-xs text-slate-500 py-3 text-center">No pending staff approval requests right now.</p>
                    ) : (
                      pendingApprovals.map((u) => (
                        <div key={u.id} className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-extrabold text-[#0E2347] truncate">{u.name}</p>
                            <span className="text-[10px] text-amber-700 font-bold shrink-0">{u.requestedAt}</span>
                          </div>
                          <p className="text-[11px] text-slate-600">
                            {u.role} · {u.employeeId || u.phone} · {u.lobby || u.division}
                          </p>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => approveUser(u.id)}
                              className="flex-1 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700"
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => rejectUser(u.id)}
                              className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 text-[11px] font-bold hover:bg-red-600 hover:text-white"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setNotifOpen(false);
                      setActiveTab('approvals');
                    }}
                    className="w-full py-2 rounded-xl bg-[#0E2347] text-[#F3D27A] text-xs font-extrabold"
                  >
                    Open Full Approvals Queue →
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onOpenAuth}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition ${
                dark ? 'border-white/10 hover:bg-white/10' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <OfficerAvatar name="Admin" variant="admin-chief" size={32} ring />
              <div className="text-left leading-tight hidden sm:block">
                <div className="text-xs font-extrabold">Admin</div>
                <div className={`text-[10px] ${subText}`}>SECR Control</div>
              </div>
            </button>
          </div>
        </div>

        {/* Tablet/Mobile Horizontal Scroll Nav */}
        <div className="xl:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar px-4 pb-2.5">
          {topTabs.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 ${
                  active
                    ? 'bg-[#0E2347] text-[#F3D27A]'
                    : dark
                    ? 'bg-white/10 text-slate-300'
                    : 'bg-[#EEF3F8] text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* MAIN EXECUTIVE CONTAINER */}
      <div className="max-w-[1380px] mx-auto px-4 lg:px-6 py-5">
        {activeTab === 'tracking' ? (
          <LiveTrackingMap />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT PROFILE RAIL (LinkedIn Style Identity Card) */}
            <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-[132px]">
              <div className={`rounded-2xl overflow-hidden ${cardCls}`}>
                {/* Cover Banner */}
                <div className="h-16 bg-gradient-to-r from-[#0E2347] via-[#173A73] to-[#C8922A] relative">
                  <span className="absolute top-2 right-2.5 px-2 py-0.5 rounded-full bg-black/30 text-[#F3D27A] text-[9.5px] font-bold backdrop-blur-sm">
                    SECR HQ
                  </span>
                </div>
                <div className="px-4 pb-4 -mt-8 text-center">
                  <div className="inline-block rounded-full p-1 bg-white shadow">
                    <OfficerAvatar name="Admin" variant="admin-chief" size={62} />
                  </div>
                  <h2 className="mt-2 font-extrabold text-base">LOCO Control Admin</h2>
                  <p className={`text-xs ${subText}`}>Chief Operations Controller · Bilaspur &amp; Raipur Division</p>
                  <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 text-[10.5px] font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Verified Command Center
                  </div>
                </div>

                <div className={`border-t px-4 py-3 space-y-2 text-xs ${dark ? 'border-white/10' : 'border-slate-100'}`}>
                  <button
                    onClick={() => setActiveTab('directory')}
                    className="w-full flex items-center justify-between hover:opacity-80"
                  >
                    <span className={subText}>{t('totalUsers')}</span>
                    <span className="font-extrabold text-[#0A66C2]">{totalUsers.toLocaleString()}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('approvals')}
                    className="w-full flex items-center justify-between hover:opacity-80"
                  >
                    <span className={subText}>{t('pendingApprovals')}</span>
                    <span className="font-extrabold text-[#D4A13B]">{pendingApprovalsTotal}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('tracking')}
                    className="w-full flex items-center justify-between hover:opacity-80"
                  >
                    <span className={subText}>Live Tracked Trains</span>
                    <span className="font-extrabold text-emerald-600">4 Active</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('documents')}
                    className="w-full flex items-center justify-between hover:opacity-80"
                  >
                    <span className={subText}>{t('sharedDocuments')}</span>
                    <span className="font-extrabold">{sharedDocsTotal}</span>
                  </button>
                </div>
              </div>

              {/* Quick Tools Card */}
              <div className={`rounded-2xl p-4 space-y-2 ${cardCls}`}>
                <h3 className={`text-xs font-extrabold uppercase tracking-wider ${subText}`}>Command Shortcuts</h3>
                <button
                  onClick={() => onOpenContactModal(null)}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#D4A13B] to-[#E8BD5A] text-[#0E2347] text-xs font-extrabold flex items-center justify-center gap-2 hover:brightness-95 transition"
                >
                  <Camera className="w-4 h-4" /> {t('addContactPhoto')}
                </button>
                <button
                  onClick={() => setActiveTab('tracking')}
                  className="w-full py-2 px-3 rounded-xl bg-[#0E2347] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#17366B] transition"
                >
                  <MapPin className="w-4 h-4 text-[#F3D27A]" /> Open Live Train Map
                </button>
                <button
                  onClick={exportReportCsv}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                    dark ? 'border-white/15 hover:bg-white/10' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Download className="w-4 h-4" /> {t('exportReport')}
                </button>
              </div>
            </aside>

            {/* CENTER MAIN FEED / WORKSPACE */}
            <main className="lg:col-span-6 space-y-4">
              {/* LINKEDIN-STYLE POST / ACTION COMPOSER */}
              <div className={`rounded-2xl p-4 space-y-3 ${cardCls}`}>
                <div className="flex items-center gap-3">
                  <OfficerAvatar name="Admin" variant="admin-chief" size={44} />
                  <button
                    onClick={onOpenNoticeModal}
                    className={`flex-1 text-left px-4 py-2.5 rounded-full border text-xs font-semibold transition ${
                      dark
                        ? 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10'
                        : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Broadcast an official railway notice, duty roster, or safety circular...
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  <button
                    onClick={onOpenUploadModal}
                    className={`py-2 rounded-xl text-[11.5px] font-bold flex items-center justify-center gap-1.5 ${
                      dark ? 'hover:bg-white/10 text-blue-300' : 'hover:bg-slate-100 text-[#0A66C2]'
                    }`}
                  >
                    <Upload className="w-4 h-4" /> Circular
                  </button>
                  <button
                    onClick={() => onOpenContactModal(null)}
                    className={`py-2 rounded-xl text-[11.5px] font-bold flex items-center justify-center gap-1.5 ${
                      dark ? 'hover:bg-white/10 text-emerald-300' : 'hover:bg-slate-100 text-emerald-700'
                    }`}
                  >
                    <Camera className="w-4 h-4" /> Crew Photo
                  </button>
                  <button
                    onClick={onOpenNoticeModal}
                    className={`py-2 rounded-xl text-[11.5px] font-bold flex items-center justify-center gap-1.5 ${
                      dark ? 'hover:bg-white/10 text-amber-300' : 'hover:bg-slate-100 text-amber-700'
                    }`}
                  >
                    <Megaphone className="w-4 h-4" /> Notice
                  </button>
                  <button
                    onClick={onOpenIncidentModal}
                    className={`py-2 rounded-xl text-[11.5px] font-bold flex items-center justify-center gap-1.5 ${
                      dark ? 'hover:bg-white/10 text-red-300' : 'hover:bg-slate-100 text-red-600'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" /> Incident
                  </button>
                </div>
              </div>

              {/* DASHBOARD FEED */}
              {activeTab === 'dashboard' && (
                <>
                  {/* KPI Mini Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: t('totalUsers'), val: totalUsers.toLocaleString(), badge: '+2.4%', tone: 'text-emerald-600' },
                      { label: t('pendingApprovals'), val: pendingApprovalsTotal, badge: 'Queue', tone: 'text-amber-600' },
                      { label: t('activeNotices'), val: activeNoticesTotal, badge: 'Live', tone: 'text-[#0A66C2]' },
                      { label: t('incidentReports'), val: incidentReportsTotal, badge: '-25%', tone: 'text-red-500' },
                    ].map((k) => (
                      <div key={k.label} className={`rounded-2xl p-3.5 ${cardCls}`}>
                        <p className={`text-[11px] font-bold ${subText}`}>{k.label}</p>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-xl font-extrabold">{k.val}</span>
                          <span className={`text-[10.5px] font-extrabold ${k.tone}`}>{k.badge}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pending Approvals Card (LinkedIn Invitation Style!) */}
                  <section className={`rounded-2xl p-4 space-y-3 ${cardCls}`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#D4A13B]" />
                        {t('pendingApprovals')} ({pendingApprovals.length})
                      </h3>
                      <button
                        onClick={() => setActiveTab('approvals')}
                        className="text-xs font-bold text-[#0A66C2] hover:underline"
                      >
                        {t('viewAll')}
                      </button>
                    </div>
                    <div className={`divide-y ${dark ? 'divide-white/10' : 'divide-slate-100'}`}>
                      {pendingApprovals.slice(0, 4).map((u) => (
                        <div key={u.id} className="py-2.5 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <OfficerAvatar photo={u.photo} name={u.name} variant={u.avatarVariant} size={42} />
                            <div className="min-w-0">
                              <p className="text-sm font-bold truncate">{u.name}</p>
                              <p className={`text-xs truncate ${subText}`}>
                                {u.role} · {u.division} ({u.station})
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => rejectUser(u.id)}
                              className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                                dark ? 'border-white/20 text-slate-300 hover:bg-white/10' : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {t('reject')}
                            </button>
                            <button
                              onClick={() => approveUser(u.id)}
                              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#0A66C2] text-white hover:bg-[#084e96] transition"
                            >
                              {t('approve')}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Crew Analytics Bar Chart */}
                  <section className={`rounded-2xl p-4 space-y-3 ${cardCls}`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-[#D4A13B]" />
                        {t('crewAnalytics')} – {analyticsMode}
                      </h3>
                      <select
                        value={analyticsMode}
                        onChange={(e) => setAnalyticsMode(e.target.value)}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border ${
                          dark ? 'bg-[#091326] border-white/15 text-white' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        {Object.keys(ANALYTICS_DATASETS).map((k) => (
                          <option key={k}>{k}</option>
                        ))}
                      </select>
                    </div>
                    <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
                      {chartData.map((bar) => {
                        const pct = Math.max(15, Math.round((bar.value / 1500) * 100));
                        return (
                          <div key={bar.label} className="flex-1 flex flex-col items-center justify-end h-full">
                            <span className="text-[11px] font-extrabold mb-1">{bar.value}</span>
                            <div
                              style={{ height: `${pct}%` }}
                              className="w-full max-w-[46px] rounded-t-xl bg-gradient-to-b from-[#0A66C2] to-[#0E2347] hover:from-[#F3D27A] hover:to-[#C8922A] transition-all"
                            />
                            <span className={`text-[11px] font-bold mt-1.5 ${subText}`}>{bar.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* Official Circulars Feed */}
                  {notices.slice(0, 2).map((n) => (
                    <article key={n.id} className={`rounded-2xl p-4 space-y-2.5 ${cardCls}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <LocoLogo size={36} />
                          <div>
                            <h4 className="font-extrabold text-sm">{n.author}</h4>
                            <p className={`text-[11px] ${subText}`}>
                              {n.category} Circular · {n.timeLabel}
                            </p>
                          </div>
                        </div>
                        {n.priority && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 text-[10px] font-extrabold">
                            Priority
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-[15px]">{n.title}</h3>
                      <p className={`text-xs leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{n.body}</p>
                      <div className={`pt-2 border-t flex items-center justify-between ${dark ? 'border-white/10' : 'border-slate-100'}`}>
                        <button
                          onClick={() => onPreviewNotice(n)}
                          className="text-xs font-bold text-[#0A66C2] hover:underline flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" /> View Circular &amp; Download
                        </button>
                      </div>
                    </article>
                  ))}
                </>
              )}

              {/* DIRECTORY TAB */}
              {activeTab === 'directory' && (
                <div className={`rounded-2xl p-4 space-y-4 ${cardCls}`}>
                  {/* Clear Section Switcher: Crew Staff vs Official 126 Call Book */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/70">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setDirView('crew')}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition ${
                          dirView === 'crew'
                            ? 'bg-[#0E2347] text-[#F3D27A]'
                            : dark
                            ? 'bg-white/10 text-slate-300'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Crew Staff ({filteredContacts.length})
                      </button>
                      <button
                        onClick={() => setDirView('official')}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition ${
                          dirView === 'official'
                            ? 'bg-[#0E2347] text-[#F3D27A]'
                            : dark
                            ? 'bg-white/10 text-slate-300'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Official Lobby &amp; TLC Call Book (126)
                      </button>
                    </div>
                    <button
                      onClick={() => onOpenContactModal(null)}
                      className="px-3.5 py-1.5 rounded-full bg-[#0A66C2] text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" /> {t('addContactPhoto')}
                    </button>
                  </div>

                  {/* Division + Lobby + Role Filter Bar */}
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={dirDivision}
                      onChange={(e) => {
                        setDirDivision(e.target.value);
                        setDirLobby('All');
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                        dark ? 'bg-[#091326] border-white/15' : 'bg-white border-slate-200'
                      }`}
                    >
                      <option value="All">All Divisions (SECR)</option>
                      {DIVISIONS.map((d) => (
                        <option key={d} value={d}>{d} Division</option>
                      ))}
                    </select>
                    <select
                      value={dirLobby}
                      onChange={(e) => setDirLobby(e.target.value)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                        dark ? 'bg-[#091326] border-white/15' : 'bg-white border-slate-200'
                      }`}
                    >
                      <option value="All">All Lobbies</option>
                      {visibleLobbies.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                    {dirView === 'crew' && (
                      <select
                        value={dirRole}
                        onChange={(e) => setDirRole(e.target.value)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                          dark ? 'bg-[#091326] border-white/15' : 'bg-white border-slate-200'
                        }`}
                      >
                        <option value="All">All Roles</option>
                        {ROLES.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* 1-Click Role Filter Chips when in Crew View */}
                  {dirView === 'crew' && (
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                      {['All', ...ROLES].map((r) => (
                        <button
                          key={r}
                          onClick={() => setDirRole(r)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap border transition ${
                            dirRole === r
                              ? 'bg-[#D4A13B] text-[#0E2347] border-[#D4A13B]'
                              : dark
                              ? 'bg-white/5 text-slate-300 border-white/10'
                              : 'bg-[#F4F7FC] text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {r === 'All' ? 'All Staff' : r}
                        </button>
                      ))}
                    </div>
                  )}

                  {dirView === 'official' ? (
                    <ImportantNumbersPanel compact dark={dark} divisionFilter={dirDivision} lobbyFilter={dirLobby} />
                  ) : (
                    <div className="space-y-2.5">
                    {filteredContacts.length === 0 && (
                      <div className={`p-5 rounded-xl border text-center space-y-2 ${softBg}`}>
                        <p className="text-xs font-bold">No staff contact matches this exact lobby &amp; role yet.</p>
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setDirDivision('All');
                              setDirLobby('All');
                              setDirRole('All');
                              setSearch('');
                            }}
                            className="px-3 py-1.5 rounded-full bg-[#0E2347] text-white text-xs font-bold"
                          >
                            Show All Staff
                          </button>
                          <button
                            onClick={() => onOpenContactModal(null)}
                            className="px-3 py-1.5 rounded-full bg-[#D4A13B] text-[#0E2347] text-xs font-bold"
                          >
                            + Add Contact Here
                          </button>
                        </div>
                      </div>
                    )}
                    {filteredContacts.slice(0, dirLimit).map((c) => (
                      <div key={c.id} className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${softBg}`}>
                        <div className="flex items-center gap-3 min-w-0">
                          <button onClick={() => onOpenContactModal(c)} className="relative shrink-0" title="Attach photo">
                            <OfficerAvatar photo={c.photo} name={c.name} variant={c.avatarVariant} size={48} ring={Boolean(c.photo)} />
                            <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#D4A13B] text-[#0E2347] flex items-center justify-center border border-white">
                              <Camera className="w-2.5 h-2.5" />
                            </span>
                          </button>
                          <div className="min-w-0">
                            <p className="font-extrabold text-sm truncate">{c.name}</p>
                            <p className={`text-xs truncate ${subText}`}>
                              <span className="font-mono font-bold text-[#C8922A]">{c.employeeId}</span> · {c.designation || c.role} · {c.lobby || c.station}
                            </p>
                            <p className="text-xs font-mono font-semibold mt-0.5">{c.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <a href={`tel:${c.phone}`} className="p-2 rounded-full bg-[#0A66C2] text-white" title="Call">
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`https://wa.me/91${c.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-full bg-emerald-600 text-white"
                            title="WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          <button onClick={() => onOpenContactModal(c)} className="p-2 rounded-full hover:bg-slate-200/50">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => deleteContact(c.id)} className="p-2 rounded-full text-red-500 hover:bg-red-500/10">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {filteredContacts.length > dirLimit && (
                      <div className="flex items-center justify-center gap-2 pt-2">
                        <button
                          onClick={() => setDirLimit((n) => n + 200)}
                          className="px-4 py-2 rounded-full bg-[#0E2347] text-[#F3D27A] text-xs font-extrabold"
                        >
                          Load More (+200)
                        </button>
                        <button
                          onClick={() => setDirLimit(filteredContacts.length)}
                          className={`px-4 py-2 rounded-full border text-xs font-extrabold ${
                            dark ? 'border-white/20 text-white' : 'border-slate-300 text-[#0E2347]'
                          }`}
                        >
                          Show All ({filteredContacts.length})
                        </button>
                      </div>
                    )}
                    </div>
                  )}
                </div>
              )}

              {/* APPROVALS TAB */}
              {activeTab === 'approvals' && (
                <div className={`rounded-2xl p-4 space-y-3 ${cardCls}`}>
                  <h3 className="font-extrabold text-base">{t('pendingApprovals')} ({pendingApprovals.length})</h3>
                  {pendingApprovals.map((u) => (
                    <div key={u.id} className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${softBg}`}>
                      <div className="flex items-center gap-3">
                        <OfficerAvatar photo={u.photo} name={u.name} variant={u.avatarVariant} size={42} />
                        <div>
                          <p className="font-bold text-sm">{u.name}</p>
                          <p className={`text-xs ${subText}`}>
                            {u.role} · {u.station} · {u.division}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={() => rejectUser(u.id)} className="px-3 py-1 rounded-full border border-slate-300 text-xs font-bold">
                          {t('reject')}
                        </button>
                        <button onClick={() => approveUser(u.id)} className="px-3.5 py-1 rounded-full bg-[#0A66C2] text-white text-xs font-bold">
                          {t('approve')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* NOTICES TAB */}
              {activeTab === 'notices' && (
                <div className="space-y-3">
                  {notices.map((n) => (
                    <div key={n.id} className={`rounded-2xl p-4 space-y-2 ${cardCls}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase text-[#D4A13B]">{n.category}</span>
                          <h3 className="font-extrabold text-sm">{n.title}</h3>
                        </div>
                        <button onClick={() => deleteNotice(n.id)} className="text-red-500 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className={`text-xs ${subText}`}>{n.body}</p>
                      <button onClick={() => onPreviewNotice(n)} className="text-xs font-bold text-[#0A66C2]">
                        Open Preview →
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* DOCUMENTS TAB */}
              {activeTab === 'documents' && (
                <div className={`rounded-2xl p-4 space-y-3 ${cardCls}`}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-sm">{t('docVault')}</h3>
                    <button onClick={onOpenUploadModal} className="px-3 py-1.5 rounded-full bg-[#0A66C2] text-white text-xs font-bold">
                      + Upload
                    </button>
                  </div>
                  {/* Featured Official Google Drive Repository */}
                  <a
                    href={OFFICIAL_DRIVE_DOCS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-[#0E2347] via-[#17366B] to-[#0B1C3A] text-white border border-[#D4A13B]/45 hover:brightness-105 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#D4A13B]/20 border border-[#F3D27A]/40 text-[#F3D27A] flex items-center justify-center shrink-0">
                        <FolderOpen className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                          Official Google Drive Repository
                        </p>
                        <p className="font-extrabold text-sm truncate">
                          SECR All Official Folders, Circulars &amp; Railway Files
                        </p>
                      </div>
                    </div>
                    <span className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#D4A13B] to-[#F3D27A] text-[#0E2347] text-xs font-extrabold inline-flex items-center gap-1.5 shrink-0">
                      Open Drive <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </a>
                  {documents.map((d) => (
                    <div key={d.id} className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${softBg}`}>
                      <button onClick={() => onPreviewDoc(d)} className="flex items-center gap-3 text-left min-w-0">
                        <span
                          className={`w-9 h-9 rounded-lg text-white text-[10px] font-extrabold flex items-center justify-center shrink-0 ${
                            d.type === 'DRV' ? 'bg-emerald-600' : d.type === 'IMG' ? 'bg-sky-500' : d.type === 'DOC' ? 'bg-[#0A66C2]' : 'bg-red-600'
                          }`}
                        >
                          {d.type}
                        </span>
                        <div className="min-w-0">
                          <p className="font-bold text-xs truncate">{d.fileName}</p>
                          <p className={`text-[11px] truncate ${subText}`}>
                            {d.category} · {d.size} · {d.uploader}
                          </p>
                        </div>
                      </button>
                      <div className="flex items-center gap-1 shrink-0">
                        {d.externalUrl && (
                          <a
                            href={d.externalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-[#D4A13B] hover:bg-amber-500/10"
                            title="Open link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button onClick={() => deleteDocument(d.id)} className="text-red-500 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* HELPLINES & IMPORTANT NUMBERS TAB */}
              {activeTab === 'helplines' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {HELPLINES.map((h) => (
                      <a key={h.id} href={`tel:${h.number}`} className={`rounded-2xl p-4 flex items-center justify-between ${cardCls}`}>
                        <div>
                          <p className="text-xs font-bold text-[#D4A13B]">{h.name}</p>
                          <p className="text-xl font-extrabold">{h.number}</p>
                          <p className={`text-[11px] ${subText}`}>{h.desc}</p>
                        </div>
                        <Phone className="w-5 h-5 text-[#0A66C2] shrink-0" />
                      </a>
                    ))}
                  </div>
                  <ImportantNumbersPanel dark={dark} />
                </div>
              )}

              {/* REPORTS TAB */}
              {activeTab === 'reports' && (
                <div className={`rounded-2xl p-4 space-y-3 ${cardCls}`}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-sm">{t('incidentReports')}</h3>
                    <button onClick={onOpenIncidentModal} className="px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold">
                      + Report Incident
                    </button>
                  </div>
                  {incidents.map((inc) => (
                    <div key={inc.id} className={`p-3 rounded-xl border ${softBg}`}>
                      <p className="font-bold text-xs">{inc.title}</p>
                      <p className={`text-[11px] mt-0.5 ${subText}`}>
                        {inc.station} · {inc.reportedBy} · {inc.time}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </main>

            {/* RIGHT RAIL: RAIL NEWS / ALERTS & DOCUMENT ACTIVITY (LinkedIn News Style!) */}
            <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-[132px]">
              {/* Live Rail Alerts */}
              <div className={`rounded-2xl p-4 space-y-3 ${cardCls}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#D4A13B]" /> Rail News &amp; {t('alerts')}
                  </h3>
                </div>
                <div className="space-y-2.5">
                  {alerts.map((a) => (
                    <div key={a.id} className={`p-2.5 rounded-xl border ${softBg}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${a.severity === 'critical' ? 'bg-red-500' : 'bg-amber-500'}`} />
                          {a.title}
                        </span>
                        <span className={`text-[10px] ${subText}`}>{a.time}</span>
                      </div>
                      <p className={`text-[11px] mt-1 leading-snug ${subText}`}>{a.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Documents */}
              <div className={`rounded-2xl p-4 space-y-2.5 ${cardCls}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm">{t('documentActivity')}</h3>
                  <button onClick={() => setActiveTab('documents')} className="text-xs font-bold text-[#0A66C2]">
                    {t('viewAll')}
                  </button>
                </div>
                <div className="space-y-2">
                  {documents.slice(0, 4).map((d) => (
                    <button
                      key={d.id}
                      onClick={() => onPreviewDoc(d)}
                      className={`w-full text-left p-2 rounded-xl border flex items-center gap-2.5 transition hover:border-[#D4A13B] ${softBg}`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg text-[9px] font-extrabold text-white flex items-center justify-center shrink-0 ${
                          d.type === 'PDF' ? 'bg-red-600' : d.type === 'IMG' ? 'bg-sky-500' : 'bg-[#0A66C2]'
                        }`}
                      >
                        {d.type === 'IMG' ? <ImageIcon className="w-3.5 h-3.5" /> : d.type}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold truncate">{d.fileName}</p>
                        <p className={`text-[10px] ${subText}`}>
                          {d.uploader} · {d.date}
                        </p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Demo Button */}
              <button
                onClick={resetDemo}
                className={`w-full py-2 rounded-xl text-[11px] font-bold border ${
                  dark ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-500 hover:bg-white'
                }`}
              >
                Reset Demo Data
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
