import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Download,
  Edit3,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  LayoutDashboard,
  MapPin,
  Megaphone,
  MessageCircle,
  Phone,
  Plus,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  Upload,
  UserCheck,
  UserPlus,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { ANALYTICS_DATASETS, DISTRICTS, HELPLINES, ROLES } from '../data/initialData';
import { LocoLogo, OfficerAvatar, TrainSilhouette } from './BrandAssets';
import LiveTrackingMap from './LiveTrackingMap';

export default function AdminPortal({
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
    notify,
    t,
  } = useAppState();

  const [activeNav, setActiveNav] = useState('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');
  const [analyticsMode, setAnalyticsMode] = useState('By Division');
  const [dirDistrict, setDirDistrict] = useState('All');
  const [dirRole, setDirRole] = useState('All');
  const [dirQuery, setDirQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'tracking', label: t('liveTracking'), icon: MapPin, liveDot: true },
    { id: 'users', label: t('users'), icon: Users },
    { id: 'approvals', label: t('approvals'), icon: ShieldCheck, badge: pendingApprovals.length },
    { id: 'directory', label: t('crewDirectory'), icon: UserCheck },
    { id: 'notices', label: t('notices'), icon: Megaphone },
    { id: 'documents', label: t('documents'), icon: FolderOpen },
    { id: 'helplines', label: t('helplines'), icon: Phone },
    { id: 'reports', label: t('reports'), icon: BarChart3 },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  const filteredContacts = useMemo(() => {
    const q = (dirQuery || globalSearch).trim().toLowerCase();
    return contacts.filter((c) => {
      if (dirDistrict !== 'All' && c.district !== dirDistrict) return false;
      if (dirRole !== 'All' && c.role !== dirRole) return false;
      if (!q) return true;
      return `${c.name} ${c.station} ${c.phone} ${c.district} ${c.role}`.toLowerCase().includes(q);
    });
  }, [contacts, dirDistrict, dirRole, dirQuery, globalSearch]);

  const chartData = ANALYTICS_DATASETS[analyticsMode] || ANALYTICS_DATASETS['By Division'];
  const chartMax = 1500;

  const pageMeta = {
    dashboard: { title: t('dashboard'), sub: t('dashSub') },
    tracking: { title: t('liveTracking'), sub: t('trackSub') },
    users: { title: t('users'), sub: 'Active staff accounts, role permissions & onboarding status' },
    approvals: { title: t('pendingApprovals'), sub: 'Verify railway staff IDs before granting LOCO access' },
    directory: { title: t('crewDirectory'), sub: t('dirSub') },
    notices: { title: t('notices'), sub: t('noticesSub') },
    documents: { title: t('docVault'), sub: t('docsSub') },
    helplines: { title: t('emergencyHelplines'), sub: 'One-tap railway control & national emergency numbers' },
    reports: { title: t('reports'), sub: 'Division analytics, operational incidents & CSV exports' },
    settings: { title: t('settings'), sub: 'LOCO Admin Control Center configuration & demo controls' },
  }[activeNav];

  return (
    <div className="flex min-h-[calc(100vh-52px)] bg-[#F2F5FA] text-[#0E2347]">
      {/* LEFT NAVY SIDEBAR */}
      <aside className="w-[238px] shrink-0 bg-gradient-to-b from-[#102750] via-[#0E2347] to-[#0A1A36] text-white flex flex-col justify-between relative overflow-hidden select-none">
        <div className="relative z-10">
          {/* Brand Lockup */}
          <div className="px-5 pt-5 pb-4 flex items-center gap-3">
            <LocoLogo size={42} variant="inline" />
            <div className="min-w-0">
              <div className="text-[20px] font-extrabold tracking-tight leading-none text-white">LOCO</div>
              <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-[#D4A13B] to-[#F3D27A] text-[#0E2347] shadow-sm">
                {t('adminControlCenter')}
              </span>
            </div>
          </div>

          {/* Nav Menu */}
          <nav className="mt-3 px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-[#FDF2D0] via-[#F7E3AC] to-[#E8C56E] text-[#0E2347] shadow-md'
                      : 'text-blue-100/85 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className={`w-[18px] h-[18px] ${active ? 'text-[#0E2347]' : 'text-blue-200/80'}`} />
                    <span>{item.label}</span>
                  </span>
                  {item.badge > 0 && (
                    <span
                      className={`min-w-[22px] h-[22px] px-1.5 rounded-full text-[11px] font-extrabold flex items-center justify-center ${
                        active ? 'bg-[#0E2347] text-[#F3D27A]' : 'bg-[#D99B2B] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.liveDot && (
                    <span className="inline-flex items-center gap-1 text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      GPS
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Train Silhouette & Version */}
        <div className="relative pt-10 pb-3 px-4">
          <TrainSilhouette className="w-full text-blue-300 pointer-events-none" />
          <div className="relative z-10 mt-1 flex items-center justify-between text-[10px] text-blue-200/60 border-t border-white/10 pt-2">
            <span>LOCO Ops Suite v2.4</span>
            <span className="inline-flex items-center gap-1 text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
            </span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* TOP HEADER WITH NAVY/GOLD WAVE ACCENT */}
        <header className="admin-header-bg px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/70">
          <div className="min-w-[220px]">
            <h1 className="text-[24px] font-extrabold tracking-tight text-[#0E2347] leading-tight">
              {pageMeta.title}
            </h1>
            <p className="text-[12.5px] font-medium text-slate-600 mt-0.5">{pageMeta.sub}</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Pill */}
            <div className="relative w-64 xl:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-9 pr-3 py-2 rounded-full bg-white/95 text-[12.5px] text-[#0E2347] placeholder:text-slate-400 shadow-sm border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#F3D27A]"
              />
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="relative w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F3D27A] border-2 border-[#11274D] absolute top-1.5 right-1.5" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-40">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-extrabold text-[#0E2347]">Live Operational Alerts</span>
                    <button onClick={() => setNotifOpen(false)} className="text-xs text-slate-400 hover:text-slate-600">
                      Close
                    </button>
                  </div>
                  <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                    {alerts.map((a) => (
                      <div key={a.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex justify-between text-xs font-bold text-[#0E2347]">
                          <span>{a.title}</span>
                          <span className="text-[10px] text-slate-400">{a.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{a.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Date Pill */}
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-[#F3D27A]" />
              <span>Tue, 04 Feb 2025</span>
            </div>

            {/* Admin Avatar */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition"
              title="Open Login / Registration Demo"
            >
              <OfficerAvatar name="Admin" variant="admin-chief" size={34} ring />
              <div className="text-left leading-tight hidden sm:block">
                <div className="text-xs font-bold flex items-center gap-1">
                  Admin <ChevronDown className="w-3 h-3 opacity-80" />
                </div>
                <div className="text-[10px] text-blue-200/80">System Administrator</div>
              </div>
            </button>
          </div>
          <div className="admin-header-gold-strip h-[3px] w-full absolute bottom-0 left-0" />
        </header>

        {/* WORKSPACE BODY */}
        <main className="p-5 xl:p-6 space-y-5 flex-1">
          {activeNav === 'tracking' && <LiveTrackingMap />}

          {activeNav === 'dashboard' && (
            <>
              {/* ROW 1: 5 KPI CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                <KpiCard
                  icon={Users}
                  iconBg="bg-blue-50 text-[#1A3F7A]"
                  label={t('totalUsers')}
                  value={totalUsers.toLocaleString()}
                  trend={`▲ +2.4% ${t('vsLastMonth')}`}
                  trendColor="text-emerald-600"
                  onClick={() => setActiveNav('users')}
                />
                <KpiCard
                  icon={ClipboardCheck}
                  iconBg="bg-[#FDF4DF] text-[#C8922A]"
                  label={t('pendingApprovals')}
                  value={pendingApprovalsTotal}
                  trend={`▲ +${pendingApprovals.length} ${t('inQueue')}`}
                  trendColor="text-amber-600"
                  onClick={() => setActiveNav('approvals')}
                />
                <KpiCard
                  icon={Megaphone}
                  iconBg="bg-[#FDF4DF] text-[#C8922A]"
                  label={t('activeNotices')}
                  value={activeNoticesTotal}
                  trend={`▲ +20% ${t('vsLastMonth')}`}
                  trendColor="text-emerald-600"
                  onClick={() => setActiveNav('notices')}
                />
                <KpiCard
                  icon={FolderOpen}
                  iconBg="bg-[#FDF4DF] text-[#C8922A]"
                  label={t('sharedDocuments')}
                  value={sharedDocsTotal}
                  trend={`▲ +12% ${t('vsLastMonth')}`}
                  trendColor="text-emerald-600"
                  onClick={() => setActiveNav('documents')}
                />
                <KpiCard
                  icon={AlertTriangle}
                  iconBg="bg-red-50 text-red-600"
                  label={t('incidentReports')}
                  value={incidentReportsTotal}
                  trend={`▼ -25% ${t('vsLastMonth')}`}
                  trendColor="text-red-600"
                  onClick={() => setActiveNav('reports')}
                />
              </div>

              {/* ROW 2: PENDING APPROVALS + CREW ANALYTICS + RECENT NOTICES */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Pending Approvals */}
                <section className="lg:col-span-5 bg-white rounded-2xl shadow-card border border-slate-200/70 p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[15px] font-extrabold text-[#0E2347] flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#FDF4DF] text-[#C8922A] flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4" />
                      </span>
                      Pending Approvals ({pendingApprovalsTotal})
                    </h2>
                    <button
                      onClick={() => setActiveNav('approvals')}
                      className="text-xs font-bold text-[#1D428A] hover:underline flex items-center gap-0.5"
                    >
                      View All <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 flex-1">
                    {pendingApprovals.length === 0 ? (
                      <div className="py-10 text-center text-sm text-slate-500">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        All pending staff requests cleared!
                      </div>
                    ) : (
                      pendingApprovals.slice(0, 4).map((u) => (
                        <div key={u.id} className="py-2.5 flex items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <OfficerAvatar photo={u.photo} name={u.name} variant={u.avatarVariant} size={38} />
                            <div className="min-w-0">
                              <p className="text-[13.5px] font-bold text-[#0E2347] truncate">{u.name}</p>
                              <p className="text-[11px] text-slate-500 truncate">
                                {u.role} · {u.division}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => approveUser(u.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition"
                            >
                              <Check className="w-3 h-3" /> Approve
                            </button>
                            <button
                              onClick={() => rejectUser(u.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11.5px] font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white transition"
                            >
                              <X className="w-3 h-3" /> Reject
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                {/* Crew Analytics Bar Chart */}
                <section className="lg:col-span-4 bg-white rounded-2xl shadow-card border border-slate-200/70 p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <h2 className="text-[15px] font-extrabold text-[#0E2347] flex items-center gap-2 truncate">
                      <BarChart3 className="w-4 h-4 text-[#C8922A] shrink-0" />
                      <span className="truncate">Crew Analytics – {analyticsMode}</span>
                    </h2>
                    <select
                      value={analyticsMode}
                      onChange={(e) => setAnalyticsMode(e.target.value)}
                      className="text-[11.5px] font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[#0E2347] focus:outline-none"
                    >
                      {Object.keys(ANALYTICS_DATASETS).map((k) => (
                        <option key={k}>{k}</option>
                      ))}
                    </select>
                  </div>

                  {/* Chart Canvas */}
                  <div className="flex-1 flex flex-col justify-end pt-3">
                    <div className="relative h-48 flex items-end justify-between gap-3 pl-9 pr-2 pb-1">
                      {/* Horizontal gridlines */}
                      {[1500, 1250, 1000, 750, 500, 250, 0].map((tick) => {
                        const pct = (tick / chartMax) * 100;
                        return (
                          <div
                            key={tick}
                            style={{ bottom: `${pct}%` }}
                            className="absolute left-0 right-0 flex items-center pointer-events-none"
                          >
                            <span className="w-8 text-right pr-2 text-[10px] font-medium text-slate-400">
                              {tick.toLocaleString()}
                            </span>
                            <div className="flex-1 border-b border-dashed border-slate-200/80" />
                          </div>
                        );
                      })}

                      {/* Bars */}
                      {chartData.map((bar) => {
                        const heightPct = Math.max(12, Math.round((bar.value / chartMax) * 100));
                        return (
                          <div
                            key={bar.label}
                            className="relative z-10 flex-1 flex flex-col items-center justify-end h-full group"
                            title={`${bar.full}: ${bar.value.toLocaleString()} staff`}
                          >
                            <span className="text-[11px] font-extrabold text-[#0E2347] mb-1">
                              {bar.value.toLocaleString()}
                            </span>
                            <div
                              style={{ height: `${heightPct}%` }}
                              className="w-full max-w-[44px] rounded-t-lg bg-gradient-to-b from-[#254E96] via-[#17356B] to-[#0E2347] group-hover:from-[#D4A13B] group-hover:to-[#B58222] transition-all duration-300 shadow-sm"
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between pl-9 pr-2 pt-2 border-t border-slate-200">
                      {chartData.map((bar) => (
                        <div key={bar.label} className="flex-1 text-center">
                          <div className="text-[11.5px] font-extrabold text-[#0E2347]">{bar.label}</div>
                          <div className="text-[10.5px] font-semibold text-slate-500">{bar.value.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Recent Notices */}
                <section className="lg:col-span-3 bg-white rounded-2xl shadow-card border border-slate-200/70 p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[15px] font-extrabold text-[#0E2347] flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-[#C8922A]" />
                      Recent Notices
                    </h2>
                    <button
                      onClick={() => setActiveNav('notices')}
                      className="text-xs font-bold text-[#1D428A] hover:underline flex items-center gap-0.5"
                    >
                      View All <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2.5 flex-1">
                    {notices.slice(0, 3).map((n) => (
                      <button
                        key={n.id}
                        onClick={() => onPreviewNotice(n)}
                        className="w-full text-left p-2.5 rounded-xl bg-[#F8FAFD] hover:bg-[#FDF6E4] border border-slate-100 hover:border-[#D4A13B]/40 flex items-center justify-between gap-2 transition group"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#FDF4DF] text-[#C8922A] flex items-center justify-center shrink-0 mt-0.5">
                            <Megaphone className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12.5px] font-bold text-[#0E2347] truncate group-hover:text-[#0E2347]">
                              {n.title}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{n.timeLabel}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              {/* ROW 3: DOCUMENT ACTIVITY + ALERTS + QUICK ACTIONS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Document Activity Table */}
                <section className="lg:col-span-5 bg-white rounded-2xl shadow-card border border-slate-200/70 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[15px] font-extrabold text-[#0E2347] flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#C8922A]" />
                      Document Activity <span className="font-semibold text-slate-400 text-xs">(Recent)</span>
                    </h2>
                    <button
                      onClick={() => setActiveNav('documents')}
                      className="text-xs font-bold text-[#1D428A] hover:underline flex items-center gap-0.5"
                    >
                      View All <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#F4F7FC] text-[11px] font-bold text-slate-500 uppercase">
                          <th className="py-2 px-2.5 rounded-l-lg">File Name</th>
                          <th className="py-2 px-2">Uploader</th>
                          <th className="py-2 px-2">Status</th>
                          <th className="py-2 px-2.5 rounded-r-lg text-right">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-[12.5px]">
                        {documents.slice(0, 4).map((d) => (
                          <tr
                            key={d.id}
                            onClick={() => onPreviewDoc(d)}
                            className="hover:bg-slate-50 cursor-pointer transition"
                          >
                            <td className="py-2.5 px-2.5 font-semibold text-[#0E2347] flex items-center gap-2">
                              <FileBadge type={d.type} />
                              <span className="truncate max-w-[165px]">{d.fileName}</span>
                            </td>
                            <td className="py-2.5 px-2 text-slate-600 whitespace-nowrap">{d.uploader}</td>
                            <td className="py-2.5 px-2">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                                  d.status === 'Viewed'
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-emerald-50 text-emerald-700'
                                }`}
                              >
                                {d.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-2.5 text-right text-slate-500 text-[11.5px] whitespace-nowrap">
                              {d.date}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Alerts */}
                <section className="lg:col-span-4 bg-white rounded-2xl shadow-card border border-slate-200/70 p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[15px] font-extrabold text-[#0E2347] flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      Alerts
                    </h2>
                    <button
                      onClick={() => setActiveNav('reports')}
                      className="text-xs font-bold text-[#1D428A] hover:underline flex items-center gap-0.5"
                    >
                      View All <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-3 flex-1">
                    {alerts.slice(0, 3).map((a) => (
                      <div
                        key={a.id}
                        className={`p-3 rounded-xl border flex items-start gap-3 ${
                          a.severity === 'critical'
                            ? 'bg-red-50/60 border-red-100'
                            : 'bg-amber-50/70 border-amber-100'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            a.severity === 'critical'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-amber-100 text-amber-600'
                          }`}
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[13px] font-bold text-[#0E2347] truncate">{a.title}</p>
                            <span className="text-[10.5px] text-slate-500 shrink-0">{a.time}</span>
                          </div>
                          <p className="text-[11.5px] text-slate-600 mt-0.5 leading-snug">{a.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Quick Actions 2x2 */}
                <section className="lg:col-span-3 bg-white rounded-2xl shadow-card border border-slate-200/70 p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[15px] font-extrabold text-[#0E2347] flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#D4A13B]" />
                      {t('quickActions')}
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-3 flex-1">
                    <button
                      onClick={onOpenNoticeModal}
                      className="rounded-xl bg-gradient-to-br from-[#1B3C73] to-[#0E2347] text-white p-3.5 flex flex-col items-center justify-center gap-2 shadow-sm hover:brightness-110 active:scale-[0.98] transition"
                    >
                      <Megaphone className="w-6 h-6" />
                      <span className="text-[12px] font-bold">{t('addNotice')}</span>
                    </button>
                    <button
                      onClick={() => {
                        if (pendingApprovals.length > 0) {
                          approveUser(pendingApprovals[0].id);
                        } else {
                          onOpenContactModal(null);
                        }
                      }}
                      className="rounded-xl bg-gradient-to-br from-[#E2B44A] to-[#C28D26] text-white p-3.5 flex flex-col items-center justify-center gap-2 shadow-sm hover:brightness-105 active:scale-[0.98] transition"
                    >
                      <UserPlus className="w-6 h-6" />
                      <span className="text-[12px] font-bold">{t('approveUser')}</span>
                    </button>
                    <button
                      onClick={onOpenUploadModal}
                      className="rounded-xl bg-gradient-to-br from-[#D6A53D] to-[#B88322] text-white p-3.5 flex flex-col items-center justify-center gap-2 shadow-sm hover:brightness-105 active:scale-[0.98] transition"
                    >
                      <Upload className="w-6 h-6" />
                      <span className="text-[12px] font-bold">{t('uploadCircular')}</span>
                    </button>
                    <button
                      onClick={exportReportCsv}
                      className="rounded-xl bg-gradient-to-br from-[#17366B] to-[#0B1C3A] text-white p-3.5 flex flex-col items-center justify-center gap-2 shadow-sm hover:brightness-110 active:scale-[0.98] transition"
                    >
                      <BarChart3 className="w-6 h-6" />
                      <span className="text-[12px] font-bold">{t('exportReport')}</span>
                    </button>
                  </div>
                </section>
              </div>
            </>
          )}

          {/* CREW DIRECTORY & USERS PAGE (WITH CONTACT PHOTO UPLOAD!) */}
          {(activeNav === 'directory' || activeNav === 'users') && (
            <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5 flex-1">
                  <div className="relative min-w-[220px] flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={dirQuery}
                      onChange={(e) => setDirQuery(e.target.value)}
                      placeholder="Search name, station (BSP), phone..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A13B]/50"
                    />
                  </div>
                  <select
                    value={dirDistrict}
                    onChange={(e) => setDirDistrict(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  >
                    <option value="All">All Districts (28 CG)</option>
                    {DISTRICTS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                  <select
                    value={dirRole}
                    onChange={(e) => setDirRole(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  >
                    <option value="All">All Roles</option>
                    {ROLES.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => onOpenContactModal(null)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A13B] to-[#E5B84B] text-[#0E2347] font-bold text-xs shadow-sm hover:brightness-95 transition"
                >
                  <Camera className="w-4 h-4" />
                  Add Contact + Photo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredContacts.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-[#FAFBFD] hover:bg-white hover:shadow-cardHover transition flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => onOpenContactModal(c)}
                        className="relative group shrink-0"
                        title="Click to attach or change contact photo"
                      >
                        <OfficerAvatar photo={c.photo} name={c.name} variant={c.avatarVariant} size={54} ring={Boolean(c.photo)} />
                        <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0E2347] text-[#F3D27A] border-2 border-white flex items-center justify-center opacity-90 group-hover:scale-110 transition">
                          <Camera className="w-3 h-3" />
                        </span>
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-extrabold text-sm text-[#0E2347] truncate">{c.name}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 shrink-0">
                            {c.status}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#C8922A]">{c.role}</p>
                        <p className="text-[11.5px] text-slate-500 mt-0.5">
                          Lobby <span className="font-bold text-[#0E2347]">{c.station}</span> · {c.district}
                        </p>
                        <p className="text-xs font-mono font-semibold text-slate-700 mt-1">{c.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/70">
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${c.phone}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0E2347] text-white text-[11px] font-bold hover:bg-[#17366B]"
                        >
                          <Phone className="w-3 h-3" /> Call
                        </a>
                        <a
                          href={`https://wa.me/91${c.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700"
                        >
                          <MessageCircle className="w-3 h-3" /> WhatsApp
                        </a>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onOpenContactModal(c)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200/70 hover:text-[#0E2347]"
                          title="Edit contact / photo"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteContact(c.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                          title="Delete contact"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* APPROVALS FULL VIEW */}
          {activeNav === 'approvals' && (
            <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-extrabold text-base text-[#0E2347]">
                    Staff Verification Queue ({pendingApprovals.length} live requests)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Approved accounts automatically appear in LOCO Crew Directory & get mobile app access.
                  </p>
                </div>
                <button
                  onClick={onOpenAuth}
                  className="px-3.5 py-2 rounded-xl bg-[#0E2347] text-white text-xs font-bold hover:bg-[#17366B]"
                >
                  + Simulate New Staff Registration
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {pendingApprovals.map((u) => (
                  <div key={u.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <OfficerAvatar photo={u.photo} name={u.name} variant={u.avatarVariant} size={44} />
                      <div>
                        <p className="font-bold text-sm text-[#0E2347]">
                          {u.name} <span className="text-xs font-mono text-slate-400 ml-1">({u.employeeId})</span>
                        </p>
                        <p className="text-xs text-slate-500">
                          {u.role} · {u.station} ({u.district}) · {u.division} · Requested {u.requestedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => approveUser(u.id)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve Access
                      </button>
                      <button
                        onClick={() => rejectUser(u.id)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
                {pendingApprovals.length === 0 && (
                  <p className="py-8 text-center text-sm text-slate-500">No pending approval requests right now.</p>
                )}
              </div>
            </div>
          )}

          {/* NOTICES FULL VIEW */}
          {activeNav === 'notices' && (
            <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-extrabold text-base text-[#0E2347]">Official Notices & Circulars</h2>
                <button
                  onClick={onOpenNoticeModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0E2347] text-white text-xs font-bold hover:bg-[#17366B]"
                >
                  <Plus className="w-4 h-4" /> Publish Notice
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notices.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 rounded-2xl border ${
                      n.priority ? 'bg-[#FDF6E4] border-[#D4A13B]/50' : 'bg-[#FAFBFD] border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0E2347] text-[#F3D27A] mb-1.5">
                          {n.category} {n.priority ? '• PRIORITY' : ''}
                        </span>
                        <h3 className="font-extrabold text-sm text-[#0E2347]">{n.title}</h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {n.date} · {n.author}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteNotice(n.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600"
                        title="Delete notice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-700 mt-2.5 leading-relaxed">{n.body}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <button
                        onClick={() => onPreviewNotice(n)}
                        className="text-xs font-bold text-[#1B3C73] hover:underline"
                      >
                        Preview & Download Attachment →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DOCUMENTS FULL VIEW */}
          {activeNav === 'documents' && (
            <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-extrabold text-base text-[#0E2347]">Document Vault (HRMS & Circulars)</h2>
                <button
                  onClick={onOpenUploadModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4A13B] to-[#E5B84B] text-[#0E2347] text-xs font-bold"
                >
                  <Upload className="w-4 h-4" /> Upload File
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {documents.map((d) => (
                  <div key={d.id} className="p-4 rounded-2xl border border-slate-200 bg-[#FAFBFD] flex flex-col justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <FileBadge type={d.type} large />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-[#0E2347] truncate">{d.fileName}</p>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{d.description}</p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {d.category} · {d.size} · {d.uploader} · {d.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <button
                        onClick={() => onPreviewDoc(d)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#0E2347] hover:text-[#C8922A]"
                      >
                        <Download className="w-3.5 h-3.5" /> Open Preview
                      </button>
                      <button onClick={() => deleteDocument(d.id)} className="text-slate-400 hover:text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HELPLINES FULL VIEW */}
          {activeNav === 'helplines' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {HELPLINES.map((h) => (
                <div key={h.id} className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-5 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C8922A]">{h.name}</span>
                    <div className="text-3xl font-extrabold text-[#0E2347] mt-1">{h.number}</div>
                    <p className="text-xs text-slate-500 mt-1">{h.desc}</p>
                  </div>
                  <a
                    href={`tel:${h.number}`}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm ${
                      h.color === 'gold' ? 'bg-[#D4A13B]' : h.color === 'red' ? 'bg-red-600' : 'bg-[#0E2347]'
                    }`}
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* REPORTS & INCIDENTS */}
          {activeNav === 'reports' && (
            <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-extrabold text-base text-[#0E2347]">Incident Reports & Operational Logs</h2>
                <div className="flex gap-2">
                  <button
                    onClick={onOpenIncidentModal}
                    className="px-3.5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                  >
                    + Log Incident
                  </button>
                  <button
                    onClick={exportReportCsv}
                    className="px-3.5 py-2 rounded-xl bg-[#0E2347] text-white text-xs font-bold hover:bg-[#17366B]"
                  >
                    Export CSV Report
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {incidents.map((inc) => (
                  <div key={inc.id} className="p-4 rounded-xl border border-slate-200 bg-[#FAFBFD] flex flex-wrap justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inc.severity === 'High'
                              ? 'bg-red-100 text-red-700'
                              : inc.severity === 'Medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {inc.severity}
                        </span>
                        <h3 className="font-bold text-sm text-[#0E2347]">{inc.title}</h3>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{inc.notes}</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {inc.station} · Reported by {inc.reportedBy} · {inc.time}
                      </p>
                    </div>
                    <span className="self-start px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200/70 text-[#0E2347]">
                      {inc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeNav === 'settings' && (
            <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-6 max-w-2xl space-y-5">
              <div>
                <h2 className="font-extrabold text-base text-[#0E2347]">LOCO Portal Configuration</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Client demo mode runs locally with instant cross-sync between the Admin Web Portal and Android Crew App.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#F5F8FC] border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Application Name</span>
                  <span className="font-bold text-[#0E2347]">LOCO — Railway Staff Communication & Operations</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Contact Photo Attachments</span>
                  <span className="font-bold text-emerald-700">Enabled (JPG / PNG / WebP)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">District Coverage</span>
                  <span className="font-bold text-[#0E2347]">28 Chhattisgarh Districts + 5 Divisions</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => notify('Firebase sync rules verified (firestore.rules & storage.rules ready)')}
                  className="px-4 py-2.5 rounded-xl bg-[#0E2347] text-white text-xs font-bold hover:bg-[#17366B]"
                >
                  Verify Production Rules
                </button>
                <button
                  onClick={resetDemo}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold hover:bg-amber-100"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Demo Data
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, iconBg, label, value, trend, trendColor, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl shadow-card hover:shadow-cardHover border border-slate-200/70 p-4 text-left transition group"
    >
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-bold text-slate-600 truncate">{label}</p>
          <p className="text-[24px] font-extrabold text-[#0E2347] leading-tight mt-0.5">{value}</p>
        </div>
      </div>
      <div className={`mt-2.5 pt-2 border-t border-slate-100 text-[11px] font-bold ${trendColor}`}>{trend}</div>
    </button>
  );
}

function FileBadge({ type, large = false }) {
  const size = large ? 'w-10 h-10 text-[11px]' : 'w-7 h-7 text-[9px]';
  if (type === 'PDF') {
    return (
      <span className={`${size} rounded-lg bg-red-600 text-white font-extrabold flex items-center justify-center shrink-0`}>
        PDF
      </span>
    );
  }
  if (type === 'IMG') {
    return (
      <span className={`${size} rounded-lg bg-sky-500 text-white font-extrabold flex items-center justify-center shrink-0`}>
        <ImageIcon className={large ? 'w-5 h-5' : 'w-3.5 h-3.5'} />
      </span>
    );
  }
  return (
    <span className={`${size} rounded-lg bg-[#1A3F7A] text-white font-extrabold flex items-center justify-center shrink-0`}>
      DOC
    </span>
  );
}
