import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Calendar,
  Camera,
  Check,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  FolderOpen,
  Home,
  Layers,
  Lock,
  LogOut,
  MapPin,
  Megaphone,
  MessageCircle,
  Navigation,
  Phone,
  Plus,
  Radio,
  Search,
  Share2,
  ShieldCheck,
  Upload,
  User,
  Users,
  Wifi,
  Battery,
  Signal,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { ALL_LOBBIES, DIVISION_LOBBIES, DIVISIONS, HELPLINES, OFFICIAL_DRIVE_DOCS_URL, ROLES, SHIFT_ROSTER } from '../data/initialData';
import { LocoLogo, OfficerAvatar, TrainPhotoGraphic } from './BrandAssets';
import ImportantNumbersPanel from './ImportantNumbersPanel';

export default function MobileCrewApp({
  framed = true,
  initialTab = 'dashboard',
  onSwitchToAdmin = null,
  onOpenContactModal,
  onOpenUploadModal,
  onOpenIncidentModal,
  onPreviewDoc,
  onPreviewNotice,
  onOpenAuth,
}) {
  const {
    isFirebaseConfigured,
    currentUser,
    firebaseLogout,
    pendingApprovals,
    contacts,
    notices,
    documents,
    alerts,
    recentActivity,
    lang,
    toggleLang,
    t,
    driverGpsEnabled,
    toggleDriverGps,
    captureRealGps,
  } = useAppState();
  const [tab, setTab] = useState(initialTab);
  const [hubSegment, setHubSegment] = useState('notices');
  const [docCategory, setDocCategory] = useState('Circulars');
  const [dirSearch, setDirSearch] = useState('');
  const [dirSegment, setDirSegment] = useState('crew');
  const [dirDivision, setDirDivision] = useState('All');
  const [dirLobby, setDirLobby] = useState('All');
  const [dirRole, setDirRole] = useState('All');
  const [dirLimit, setDirLimit] = useState(120);
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [currentHour, setCurrentHour] = useState(() => new Date().getHours());

  useEffect(() => {
    const timer = setInterval(() => setCurrentHour(new Date().getHours()), 60000);
    return () => clearInterval(timer);
  }, []);

  const greetingKey =
    currentHour >= 5 && currentHour < 12
      ? 'goodMorning'
      : currentHour >= 12 && currentHour < 17
      ? 'goodAfternoon'
      : currentHour >= 17 && currentHour < 21
      ? 'goodEvening'
      : 'goodNight';

  const visibleLobbies = dirDivision === 'All' ? ALL_LOBBIES : DIVISION_LOBBIES[dirDivision] || [];

  const priorityNotice = notices.find((n) => n.priority) || notices[0];

  const filteredContacts = useMemo(() => {
    const q = dirSearch.trim().toLowerCase();
    return contacts.filter((c) => {
      if (dirDivision !== 'All' && !(c.division || '').toLowerCase().includes(dirDivision.toLowerCase())) return false;
      if (dirLobby !== 'All' && (c.lobby || '') !== dirLobby && !dirLobby.toLowerCase().includes(`(${(c.station || '').toLowerCase()})`)) return false;
      if (dirRole !== 'All' && c.role !== dirRole) return false;
      if (!q) return true;
      return `${c.name} ${c.employeeId || ''} ${c.designation || ''} ${c.station} ${c.lobby || ''} ${c.phone} ${c.division} ${c.role}`.toLowerCase().includes(q);
    });
  }, [contacts, dirDivision, dirLobby, dirRole, dirSearch]);

  const filteredDocs = useMemo(() => {
    if (docCategory === 'All') return documents;
    const match = documents.filter((d) => d.category === docCategory);
    return match.length > 0 ? match : documents;
  }, [documents, docCategory]);

  const appScreen = (
    <div className="flex flex-col h-full bg-[#F3F6FB] text-[#0E2347] relative overflow-hidden">
      {/* ANDROID STATUS BAR (shown inside phone frame) */}
      {framed && (
        <div className="bg-[#122B56] text-white px-5 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold shrink-0 relative">
          <span>9:30</span>
          <div className="w-3.5 h-3.5 rounded-full bg-[#070E1C] border border-white/10 absolute left-1/2 -translate-x-1/2 top-2" />
          <div className="flex items-center gap-1.5 opacity-90">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* SCROLLABLE BODY */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
        {/* ================= TAB 1: DASHBOARD (PHOTO 3) ================= */}
        {tab === 'dashboard' && (
          <div>
            {/* Curved Navy Header with Gold Edge */}
            <div className="mobile-wave-header text-white px-4 pt-2.5 pb-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <LocoLogo size={26} variant="inline" />
                  <span className="font-extrabold text-[17px] tracking-tight">LOCO</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={toggleLang}
                    className="px-2 py-1 rounded-full bg-white/15 border border-[#F3D27A]/40 text-[10px] font-extrabold text-[#F3D27A] hover:bg-white/25 transition"
                    title="Switch English / हिंदी"
                  >
                    {lang === 'hi' ? 'EN' : 'हिंदी'}
                  </button>
                  <button
                    onClick={() => setTab('directory')}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (onSwitchToAdmin && pendingApprovals.length > 0) {
                        onSwitchToAdmin();
                      } else {
                        setTab('notices');
                      }
                    }}
                    className="relative w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
                  >
                    <Bell className="w-4 h-4" />
                    {currentUser?.isAdmin && pendingApprovals.length > 0 ? (
                      <span className="min-w-[16px] h-[16px] px-1 rounded-full bg-red-600 text-white text-[9px] font-extrabold flex items-center justify-center absolute -top-1 -right-1">
                        {pendingApprovals.length}
                      </span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-[#F3D27A] absolute top-1.5 right-1.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-[21px] font-extrabold leading-tight">{t(greetingKey)}</h2>
                  <p className="text-[11.5px] text-blue-200/90 mt-0.5">{t('keepSmooth')} 🚆</p>
                  <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#E5B84B] to-[#F3D27A] text-[#0E2347] text-[10.5px] font-extrabold shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" /> {t('approvedUser')}
                    </span>
                    <button
                      onClick={toggleDriverGps}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border transition ${
                        driverGpsEnabled
                          ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/50'
                          : 'bg-white/10 text-slate-300 border-white/20'
                      }`}
                    >
                      <Radio className={`w-2.5 h-2.5 ${driverGpsEnabled ? 'animate-pulse' : ''}`} />
                      {driverGpsEnabled ? t('liveGpsOn') : t('liveGpsOff')}
                    </button>
                  </div>
                </div>
                <OfficerAvatar name="Crew Officer" variant="officer-male-1" size={58} ring />
              </div>

              {/* Curved gold + white bottom swoop */}
              <svg viewBox="0 0 390 26" className="w-full absolute bottom-0 left-0 right-0" preserveAspectRatio="none">
                <path d="M0,18 Q240,28 390,2 L390,26 L0,26 Z" fill="#D4A13B" />
                <path d="M0,22 Q245,30 390,9 L390,26 L0,26 Z" fill="#F3F6FB" />
              </svg>
            </div>

            <div className="px-3.5 -mt-1 space-y-3">
              {/* Live Admin Approval Notification Banner (visible ONLY to Admin!) */}
              {onSwitchToAdmin && pendingApprovals.length > 0 && (
                <button
                  onClick={onSwitchToAdmin}
                  className="w-full rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 text-white px-3.5 py-2.5 shadow-md flex items-center justify-between gap-2 animate-pulse"
                >
                  <div className="flex items-center gap-2 min-w-0 text-left">
                    <Bell className="w-4 h-4 shrink-0 text-[#F3D27A]" />
                    <div className="min-w-0">
                      <p className="text-[11.5px] font-extrabold truncate">
                        🔔 {pendingApprovals.length} New Staff Approval Request{pendingApprovals.length > 1 ? 's' : ''}
                      </p>
                      <p className="text-[10px] text-white/90 truncate">
                        Tap to open Admin Panel &amp; Approve/Reject now
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </button>
              )}

              {/* 4-Stat Strip */}
              <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 grid grid-cols-4 divide-x divide-slate-100 py-2.5 px-1">
                <StatCell icon={Users} iconColor="text-[#1A3F7A]" num={contacts.length} label={t('activeCrew')} onClick={() => setTab('directory')} />
                <StatCell icon={FileText} iconColor="text-[#D4A13B]" num={notices.length + 3} label={t('noticesToday')} onClick={() => setTab('notices')} />
                <StatCell icon={Layers} iconColor="text-[#1A3F7A]" num={36 + documents.length} label={t('docsShared')} onClick={() => setTab('documents')} />
                <StatCell icon={ShieldCheck} iconColor="text-[#D4A13B]" num="12" label={t('pendingTasks')} onClick={() => setShowRosterModal(true)} />
              </div>

              {/* 6 Quick Tiles (3x2) */}
              <div className="grid grid-cols-3 gap-2">
                <QuickTile icon={Users} label={t('crewDirectory')} tone="navy" onClick={() => setTab('directory')} />
                <QuickTile icon={Megaphone} label={t('notices')} tone="gold" onClick={() => setTab('notices')} />
                <QuickTile icon={FolderOpen} label={t('documents')} tone="gold" onClick={() => setTab('documents')} />
                <QuickTile icon={Phone} label={t('helplines')} tone="gold" onClick={() => setTab('profile')} />
                <QuickTile icon={Calendar} label={t('shiftRoster')} tone="gold" onClick={() => setShowRosterModal(true)} />
                <QuickTile icon={AlertTriangle} label={t('reportIncident')} tone="amber" onClick={onOpenIncidentModal} />
              </div>

              {/* Operational Alert Banner */}
              <div className="rounded-2xl bg-gradient-to-r from-[#FFF6EB] to-[#FFFDF8] border border-amber-200/80 border-l-4 border-l-red-600 p-3 flex items-center justify-between gap-2 shadow-sm">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-extrabold text-[#9A2B1D]">
                      {alerts[0]?.title || 'Operational Alert'}
                    </p>
                    <p className="text-[11px] text-slate-700 leading-snug line-clamp-2">
                      {alerts[1]?.message || 'Track maintenance on Route B-12 from 11:00 – 15:00.'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>

              {/* Today's Duty + Recent Notices */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setShowRosterModal(true)}
                  className="rounded-2xl bg-gradient-to-br from-[#163366] to-[#0B1C3A] text-white p-3 text-left flex flex-col justify-between relative overflow-hidden shadow-card"
                >
                  <div className="flex items-center justify-between text-[11.5px] font-bold">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#F3D27A]" /> Today&apos;s Duty
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                  </div>
                  <div className="my-2">
                    <div className="text-[17px] font-extrabold tracking-tight">08:00 – 16:00</div>
                    <div className="text-[10.5px] font-bold text-[#F3D27A] mt-0.5 truncate">
                      🚆 12859 Gitanjali Exp
                    </div>
                    <div className="text-[9.5px] text-blue-200/90 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 text-[#F3D27A] shrink-0" /> WAP-7 #30412 · SCL
                    </div>
                  </div>
                  <span className="self-start px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
                    On Duty
                  </span>
                </button>

                <div className="rounded-2xl bg-white border border-slate-200/70 p-3 shadow-card flex flex-col">
                  <button
                    onClick={() => setTab('notices')}
                    className="flex items-center justify-between text-[11.5px] font-extrabold text-[#0E2347] mb-2"
                  >
                    <span className="flex items-center gap-1">
                      <Megaphone className="w-3.5 h-3.5 text-[#D4A13B]" /> Recent Notices
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <div className="space-y-2 flex-1">
                    {notices.slice(0, 3).map((n) => (
                      <button
                        key={n.id}
                        onClick={() => onPreviewNotice(n)}
                        className="w-full text-left flex items-start gap-1.5 group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4A13B] mt-1.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10.5px] font-bold text-[#0E2347] truncate group-hover:text-[#C8922A]">
                            {n.title}
                          </p>
                          <p className="text-[9.5px] text-slate-400">{n.timeLabel}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Documents + Emergency Helplines */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-2xl bg-white border border-slate-200/70 p-3 shadow-card">
                  <button
                    onClick={() => setTab('documents')}
                    className="w-full flex items-center justify-between text-[11.5px] font-extrabold text-[#0E2347] mb-2"
                  >
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-[#D4A13B]" /> Recent Docs
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <div className="space-y-2">
                    {documents.slice(0, 2).map((d) => (
                      <button
                        key={d.id}
                        onClick={() => onPreviewDoc(d)}
                        className="w-full text-left flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50"
                      >
                        <span
                          className={`w-7 h-7 rounded-md text-[8px] font-extrabold text-white flex items-center justify-center shrink-0 ${
                            d.type === 'DRV' ? 'bg-emerald-600' : d.type === 'PDF' ? 'bg-red-600' : 'bg-sky-500'
                          }`}
                        >
                          {d.type}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10.5px] font-bold truncate">{d.fileName}</p>
                          <p className="text-[9px] text-slate-400 truncate">{d.size}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200/70 p-3 shadow-card flex flex-col justify-between">
                  <div className="flex items-center gap-1 text-[11.5px] font-extrabold text-[#0E2347] mb-2">
                    <span className="text-red-500">🚨</span> {t('emergencyHelplines')}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {HELPLINES.slice(0, 4).map((h) => (
                      <a
                        key={h.number}
                        href={`tel:${h.number}`}
                        className={`rounded-xl py-1.5 px-2.5 flex items-center justify-between gap-2 text-white font-bold shadow-sm active:scale-95 transition ${
                          h.color === 'gold'
                            ? 'bg-gradient-to-r from-[#D9A741] to-[#B68321]'
                            : h.color === 'red'
                            ? 'bg-gradient-to-r from-red-600 to-red-700'
                            : 'bg-gradient-to-r from-[#1A3C75] to-[#0E2347]'
                        }`}
                      >
                        <span className="text-[10px] truncate">{h.name.split(' (')[0]}</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold shrink-0">
                          <Phone className="w-3 h-3" />
                          {h.number}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: DIRECTORY (WITH PHOTO UPLOAD!) ================= */}
        {tab === 'directory' && (
          <div>
            <div className="mobile-wave-header text-white px-4 pt-3 pb-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[19px] font-extrabold">LOCO Crew Directory</h2>
                  <p className="text-[11px] text-blue-200/85">SECR Divisions &amp; Lobbies · Tap camera for photo</p>
                </div>
                <button
                  onClick={() => onOpenContactModal(null)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#D4A13B] to-[#F3D27A] text-[#0E2347] text-[11px] font-extrabold shadow"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              <svg viewBox="0 0 390 20" className="w-full absolute bottom-0 left-0 right-0" preserveAspectRatio="none">
                <path d="M0,14 Q230,22 390,2 L390,20 L0,20 Z" fill="#D4A13B" />
                <path d="M0,17 Q235,24 390,8 L390,20 L0,20 Z" fill="#F3F6FB" />
              </svg>
            </div>

            <div className="px-3.5 pt-2 space-y-2.5">
              {/* Toggle: Crew Contacts vs Official 74 Lobby/Control Numbers */}
              <div className="bg-white p-1 rounded-xl border border-slate-200 grid grid-cols-2 gap-1">
                <button
                  onClick={() => setDirSegment('crew')}
                  className={`py-1.5 rounded-lg text-[11px] font-extrabold transition ${
                    dirSegment === 'crew' ? 'bg-[#0E2347] text-[#F3D27A]' : 'text-slate-600'
                  }`}
                >
                  Crew Contacts ({contacts.length})
                </button>
                <button
                  onClick={() => setDirSegment('official')}
                  className={`py-1.5 rounded-lg text-[11px] font-extrabold transition ${
                    dirSegment === 'official' ? 'bg-[#0E2347] text-[#F3D27A]' : 'text-slate-600'
                  }`}
                >
                  Call Book &amp; TLC (126)
                </button>
              </div>

              {dirSegment === 'official' ? (
                <ImportantNumbersPanel compact divisionFilter={dirDivision} lobbyFilter={dirLobby} />
              ) : (
                <>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={dirSearch}
                  onChange={(e) => setDirSearch(e.target.value)}
                  placeholder="Search name, station (BSP) or phone"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4A13B]"
                />
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <select
                  value={dirDivision}
                  onChange={(e) => {
                    setDirDivision(e.target.value);
                    setDirLobby('All');
                  }}
                  className="px-2 py-2 rounded-xl bg-white border border-slate-200 text-[11px] font-semibold"
                >
                  <option value="All">All Divisions</option>
                  {DIVISIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <select
                  value={dirLobby}
                  onChange={(e) => setDirLobby(e.target.value)}
                  className="px-2 py-2 rounded-xl bg-white border border-slate-200 text-[11px] font-semibold"
                >
                  <option value="All">All Lobbies</option>
                  {visibleLobbies.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                <select
                  value={dirRole}
                  onChange={(e) => setDirRole(e.target.value)}
                  className="px-2 py-2 rounded-xl bg-white border border-slate-200 text-[11px] font-semibold"
                >
                  <option value="All">All Roles</option>
                  {ROLES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between text-[10.5px] font-bold text-slate-500 px-0.5">
                <span>Showing {Math.min(dirLimit, filteredContacts.length)} of {filteredContacts.length} crew</span>
                {dirLobby === 'All' && dirDivision === 'All' && (
                  <span className="text-[#C8922A]">993 Verified BSP Crew Loaded</span>
                )}
              </div>

              <div className="space-y-2">
                {filteredContacts.slice(0, dirLimit).map((c) => (
                  <div
                    key={c.id}
                    className="bg-white rounded-2xl p-3 border border-slate-200/75 shadow-card flex items-center justify-between gap-2.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        onClick={() => onOpenContactModal(c)}
                        className="relative shrink-0"
                        title="Attach or change photo"
                      >
                        <OfficerAvatar photo={c.photo} name={c.name} variant={c.avatarVariant} size={46} ring={Boolean(c.photo)} />
                        <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#D4A13B] text-[#0E2347] border border-white flex items-center justify-center">
                          <Camera className="w-2.5 h-2.5" />
                        </span>
                      </button>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[12.5px] font-extrabold text-[#0E2347] truncate">{c.name}</p>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">
                          <span className="font-mono font-bold text-[#1A3F7A]">{c.employeeId}</span> · {c.designation || c.role} · <span className="font-bold text-[#0E2347]">{c.station}</span>
                        </p>
                        <p className="text-[11px] font-mono font-semibold text-slate-600">{c.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={`https://wa.me/91${c.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                      <a
                        href={`tel:${c.phone}`}
                        className="w-8 h-8 rounded-xl bg-blue-50 text-[#0E2347] flex items-center justify-center hover:bg-[#0E2347] hover:text-white transition"
                        title="Call"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
                {filteredContacts.length > dirLimit && (
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      onClick={() => setDirLimit((n) => n + 200)}
                      className="px-3.5 py-2 rounded-xl bg-[#0E2347] text-[#F3D27A] text-[11px] font-extrabold"
                    >
                      Load More (+200)
                    </button>
                    <button
                      onClick={() => setDirLimit(filteredContacts.length)}
                      className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-[#0E2347] text-[11px] font-extrabold"
                    >
                      Show All ({filteredContacts.length})
                    </button>
                  </div>
                )}
              </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 3: NOTICES & DOCUMENT HUB (PHOTO 2) ================= */}
        {tab === 'notices' && (
          <div>
            {/* Curved Navy Header matching Photo 2 */}
            <div className="mobile-wave-header text-white px-4 pt-2.5 pb-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <LocoLogo size={24} variant="inline" />
                  <span className="font-extrabold text-[16px]">LOCO</span>
                </div>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 opacity-90" />
                  <div className="relative">
                    <Bell className="w-4 h-4 opacity-90" />
                    <span className="w-2 h-2 rounded-full bg-[#F3D27A] absolute -top-0.5 -right-0.5" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-[20px] font-extrabold leading-tight">Notices &amp; Documents</h2>
                  <p className="text-[11px] text-blue-200/85 mt-0.5">Official updates and HRMS files for railway staff</p>
                  <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#E5B84B] to-[#F3D27A] text-[#0E2347] text-[10.5px] font-extrabold">
                      <Check className="w-3 h-3 stroke-[3]" /> Approved User
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-[#F3D27A]/60 text-[#F3D27A] text-[10.5px] font-bold">
                      <Lock className="w-2.5 h-2.5" /> Protected Access
                    </span>
                  </div>
                </div>
                <OfficerAvatar name="Crew Officer" variant="officer-male-1" size={54} ring />
              </div>

              <svg viewBox="0 0 390 22" className="w-full absolute bottom-0 left-0 right-0" preserveAspectRatio="none">
                <path d="M0,15 Q240,24 390,2 L390,22 L0,22 Z" fill="#D4A13B" />
                <path d="M0,19 Q245,26 390,9 L390,22 L0,22 Z" fill="#F3F6FB" />
              </svg>
            </div>

            <div className="px-3.5 pt-2 space-y-3">
              {/* Segmented Tabs: Notices | Documents */}
              <div className="bg-white p-1 rounded-2xl border border-slate-200/80 shadow-sm grid grid-cols-2 gap-1">
                <button
                  onClick={() => setHubSegment('notices')}
                  className={`py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition ${
                    hubSegment === 'notices'
                      ? 'bg-[#0E2347] text-white shadow-sm border-b-2 border-[#D4A13B]'
                      : 'text-slate-600'
                  }`}
                >
                  <Megaphone className="w-3.5 h-3.5 text-[#F3D27A]" /> Notices
                </button>
                <button
                  onClick={() => setHubSegment('documents')}
                  className={`py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition ${
                    hubSegment === 'documents'
                      ? 'bg-[#0E2347] text-white shadow-sm border-b-2 border-[#D4A13B]'
                      : 'text-slate-600'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" /> Documents
                </button>
              </div>

              {/* Priority Notice Banner */}
              {priorityNotice && hubSegment === 'notices' && (
                <button
                  onClick={() => onPreviewNotice(priorityNotice)}
                  className="w-full text-left rounded-2xl overflow-hidden border border-[#D4A13B]/40 shadow-card flex bg-gradient-to-r from-[#FFF9EB] via-[#FDF5E1] to-[#122C5A]"
                >
                  <div className="flex-1 p-3 border-l-4 border-[#D4A13B]">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-50 text-red-700 text-[10px] font-extrabold">
                      <AlertTriangle className="w-3 h-3" /> Priority Notice
                    </span>
                    <h3 className="font-extrabold text-[13.5px] text-[#0E2347] mt-1 leading-snug">
                      {priorityNotice.title}
                    </h3>
                    <p className="text-[10.5px] text-slate-600 mt-0.5 line-clamp-2">{priorityNotice.body}</p>
                  </div>
                  <div className="w-20 bg-gradient-to-b from-[#163366] to-[#0B1C3A] flex flex-col items-center justify-center text-[#F3D27A] px-2 shrink-0">
                    <Calendar className="w-7 h-7" />
                    <ChevronRight className="w-4 h-4 text-white mt-1" />
                  </div>
                </button>
              )}

              {/* Recent Notices List */}
              {hubSegment === 'notices' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[13px] font-extrabold text-[#0E2347]">Recent Notices</h3>
                    <span className="text-[11px] font-bold text-[#1D428A]">View All ›</span>
                  </div>
                  {notices.slice(1, 4).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onPreviewNotice(n)}
                      className="bg-white rounded-xl p-2.5 border border-slate-200/75 shadow-sm flex items-center justify-between gap-2 cursor-pointer hover:border-[#D4A13B]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#FDF4DF] text-[#C8922A] flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12px] font-bold text-[#0E2347] truncate">{n.title}</p>
                          <p className="text-[10px] text-slate-400">{n.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FDF4DF] text-[#9A6D1B]">
                          {n.category}
                        </span>
                        <Download className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Document Vault (HRMS) */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FolderOpen className="w-5 h-5 text-[#D4A13B] shrink-0" />
                    <div className="min-w-0">
                      <h3 className="text-[13px] font-extrabold text-[#0E2347] leading-tight">Document Vault (HRMS)</h3>
                      <p className="text-[10px] text-slate-500">Access, download &amp; share official files</p>
                    </div>
                  </div>
                  <button
                    onClick={onOpenUploadModal}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#0E2347] text-white text-[10.5px] font-bold shrink-0"
                  >
                    <Upload className="w-3 h-3" /> Upload / Share
                  </button>
                </div>

                {/* Official SECR Google Drive Quick Banner */}
                <a
                  href={OFFICIAL_DRIVE_DOCS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-gradient-to-r from-[#0E2347] to-[#17366B] text-white border border-[#D4A13B]/45"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold text-[#F3D27A] truncate">
                      SECR Official Google Drive Library
                    </p>
                    <p className="text-[9.5px] text-blue-200/85 truncate">
                      All Official Folders, Circulars &amp; Manuals
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-[#F3D27A] text-[#0E2347] text-[10px] font-extrabold inline-flex items-center gap-1 shrink-0">
                    Open <ExternalLink className="w-3 h-3" />
                  </span>
                </a>

                {/* Category Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                  {['Circulars', 'Safety', 'Duty Orders', 'Forms', 'Photos'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setDocCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold whitespace-nowrap border transition ${
                        docCategory === cat
                          ? 'bg-[#0E2347] text-white border-[#0E2347]'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* 2-Card Preview Row */}
                <div className="grid grid-cols-2 gap-2">
                  {filteredDocs.slice(0, 2).map((d) => (
                    <button
                      key={d.id}
                      onClick={() => onPreviewDoc(d)}
                      className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-sm text-left flex items-center gap-2 hover:border-[#D4A13B] transition"
                    >
                      {d.previewType === 'image' ? (
                        <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                          {d.dataUrl ? (
                            <img src={d.dataUrl} alt={d.fileName} className="w-full h-full object-cover" />
                          ) : (
                            <TrainPhotoGraphic title={d.fileName} />
                          )}
                        </div>
                      ) : (
                        <div
                          className={`w-10 h-11 rounded-lg text-white font-extrabold text-[10px] flex items-center justify-center shrink-0 ${
                            d.type === 'DRV' ? 'bg-emerald-600' : 'bg-red-600'
                          }`}
                        >
                          {d.type}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-[#0E2347] line-clamp-2 leading-tight">{d.fileName}</p>
                        <p className="text-[9.5px] text-slate-400 mt-0.5">{d.size}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-3 border border-slate-200/75 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-[12px] font-extrabold">
                    <span>Recent Activity</span>
                    <span className="text-[10.5px] text-[#1D428A] font-bold">View All ›</span>
                  </div>
                  {recentActivity.slice(0, 2).map((a) => (
                    <div key={a.id} className="flex items-start gap-2 text-[10.5px] border-t border-slate-100 pt-2">
                      <Share2 className="w-3.5 h-3.5 text-[#1A3F7A] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-slate-700 leading-snug">
                          <span className="font-bold text-[#0E2347]">{a.title}</span> {a.detail}
                        </p>
                        <p className="text-[9.5px] text-slate-400">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: DOCUMENTS ================= */}
        {tab === 'documents' && (
          <div>
            <div className="mobile-wave-header text-white px-4 pt-3 pb-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[19px] font-extrabold">HRMS Document Vault</h2>
                  <p className="text-[11px] text-blue-200/85">Upload, preview &amp; share files securely</p>
                </div>
                <button
                  onClick={onOpenUploadModal}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#D4A13B] to-[#F3D27A] text-[#0E2347] text-[11px] font-extrabold"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload
                </button>
              </div>
              <svg viewBox="0 0 390 20" className="w-full absolute bottom-0 left-0 right-0" preserveAspectRatio="none">
                <path d="M0,14 Q230,22 390,2 L390,20 L0,20 Z" fill="#D4A13B" />
                <path d="M0,17 Q235,24 390,8 L390,20 L0,20 Z" fill="#F3F6FB" />
              </svg>
            </div>
            <div className="px-3.5 pt-2 space-y-2.5">
              {/* Featured Official SECR Google Drive Documents Hub */}
              <a
                href={OFFICIAL_DRIVE_DOCS_URL}
                target="_blank"
                rel="noreferrer"
                className="block rounded-2xl bg-gradient-to-br from-[#0E2347] via-[#17366B] to-[#0B1C3A] text-white p-3.5 border border-[#D4A13B]/45 shadow-card hover:brightness-105 transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#D4A13B]/20 border border-[#F3D27A]/40 text-[#F3D27A] flex items-center justify-center shrink-0">
                      <FolderOpen className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[9px] font-extrabold uppercase tracking-wider">
                        Official Google Drive
                      </span>
                      <p className="text-[12.5px] font-extrabold text-white truncate mt-0.5">
                        SECR All Folders &amp; Railway Files
                      </p>
                      <p className="text-[10px] text-blue-200/85 truncate">
                        Circulars, Manuals, Safety Orders &amp; Important Docs
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D4A13B] to-[#F3D27A] text-[#0E2347] text-[10.5px] font-extrabold inline-flex items-center gap-1 shrink-0">
                    Open <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </a>

              {documents.map((d) => (
                <button
                  key={d.id}
                  onClick={() => onPreviewDoc(d)}
                  className="w-full text-left bg-white rounded-2xl p-3 border border-slate-200/75 shadow-sm flex items-center justify-between gap-2.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-10 h-10 rounded-xl text-[10px] font-extrabold text-white flex items-center justify-center shrink-0 ${
                        d.type === 'DRV'
                          ? 'bg-emerald-600'
                          : d.type === 'PDF'
                          ? 'bg-red-600'
                          : d.type === 'IMG'
                          ? 'bg-sky-500'
                          : 'bg-[#1A3F7A]'
                      }`}
                    >
                      {d.type}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-bold text-[#0E2347] truncate">{d.fileName}</p>
                      <p className="text-[10.5px] text-slate-500 truncate">
                        {d.category} · {d.size} · {d.uploader}
                      </p>
                    </div>
                  </div>
                  {d.externalUrl ? (
                    <ExternalLink className="w-4 h-4 text-[#D4A13B] shrink-0" />
                  ) : (
                    <Download className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: PROFILE & HELPLINES ================= */}
        {tab === 'profile' && (
          <div>
            <div className="mobile-wave-header text-white px-4 pt-4 pb-7 relative">
              <div className="flex items-center gap-3">
                <OfficerAvatar name={currentUser?.name || 'Rajeshwar Patel'} variant="officer-male-1" size={62} ring />
                <div>
                  <h2 className="text-lg font-extrabold">{currentUser?.name || 'Rajeshwar Patel'}</h2>
                  <p className="text-xs text-blue-200">
                    {currentUser?.role || 'Loco Pilot'} · {currentUser?.lobby || 'Bilaspur Lobby (BSP)'}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full bg-[#F3D27A] text-[#0E2347] text-[10px] font-extrabold">
                    <Check className="w-3 h-3 stroke-[3]" />{' '}
                    {currentUser?.isAdmin
                      ? 'System Admin · Full Control'
                      : `Approved Crew · ID ${currentUser?.employeeId || 'LP-10821'}`}
                  </span>
                </div>
              </div>
              <svg viewBox="0 0 390 20" className="w-full absolute bottom-0 left-0 right-0" preserveAspectRatio="none">
                <path d="M0,14 Q230,22 390,2 L390,20 L0,20 Z" fill="#D4A13B" />
                <path d="M0,17 Q235,24 390,8 L390,20 L0,20 Z" fill="#F3F6FB" />
              </svg>
            </div>

            <div className="px-3.5 pt-2 space-y-3">
              {onSwitchToAdmin && (
                <button
                  onClick={onSwitchToAdmin}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4A13B] to-[#F3D27A] text-[#0E2347] text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4" /> Open Admin Control Center (Approve Crew &amp; Upload)
                </button>
              )}
              {/* Driver Live GPS Control Card */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-card space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-[#D4A13B]" />
                    <span className="text-xs font-extrabold text-[#0E2347]">{t('shareLiveLoc')}</span>
                  </div>
                  <button
                    onClick={toggleDriverGps}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition ${
                      driverGpsEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {driverGpsEnabled ? t('liveGpsOn') : t('liveGpsOff')}
                  </button>
                </div>
                <p className="text-[10.5px] text-slate-500">
                  Syncs live coordinates to Admin Control Center during On-Duty shift (08:00 – 16:00).
                </p>
                <button
                  onClick={captureRealGps}
                  className="w-full py-2 rounded-xl bg-[#0E2347] text-[#F3D27A] text-[11px] font-bold flex items-center justify-center gap-1.5 hover:bg-[#17366B]"
                >
                  <MapPin className="w-3.5 h-3.5" /> {t('useRealGps')}
                </button>
              </div>

              <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-card space-y-2">
                <h3 className="text-xs font-extrabold text-[#0E2347] uppercase tracking-wider">{t('emergencyHelplines')}</h3>
                <div className="flex flex-col divide-y divide-slate-100">
                  {HELPLINES.map((h) => (
                    <a
                      key={h.number}
                      href={`tel:${h.number}`}
                      className="flex items-center justify-between gap-2 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0E2347] truncate">{h.name}</p>
                        <p className="text-[10.5px] text-slate-500 truncate">{h.desc}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#0E2347] text-[#F3D27A] text-xs font-extrabold shrink-0">
                        {h.number}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <button
                onClick={isFirebaseConfigured && currentUser ? firebaseLogout : onOpenAuth}
                className="w-full py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#0E2347] flex items-center justify-center gap-2 hover:bg-slate-50"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                {isFirebaseConfigured && currentUser
                  ? 'Sign Out of LOCO Account'
                  : 'Preview Login / Staff Registration'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SHIFT ROSTER OVERLAY INSIDE PHONE */}
      {showRosterModal && (
        <div
          className="absolute inset-0 z-30 bg-[#091833]/60 backdrop-blur-[2px] flex items-end"
          onClick={() => setShowRosterModal(false)}
        >
          <div
            className="w-full bg-white rounded-t-3xl p-4 space-y-3 max-h-[75%] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-[#0E2347]">Weekly Shift Roster (SCL)</h3>
              <button
                onClick={() => setShowRosterModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>
            {SHIFT_ROSTER.map((r) => (
              <div key={r.day} className="p-3 rounded-xl bg-[#F5F8FC] border border-slate-200 flex justify-between items-center">
                <div>
                  <p className="text-xs font-extrabold text-[#0E2347]">{r.day} · {r.shift}</p>
                  <p className="text-[11px] text-slate-600">{r.duty} ({r.train})</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0E2347] text-[#F3D27A]">
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION BAR (EXACT 5 TABS FROM PHOTOS 2 & 3) */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200/90 px-2 py-1.5 grid grid-cols-5 z-20">
        {[
          { id: 'dashboard', label: t('dashboard'), icon: Home },
          { id: 'directory', label: t('directory'), icon: Users },
          { id: 'notices', label: t('notices'), icon: Megaphone },
          { id: 'documents', label: t('documents'), icon: FolderOpen },
          { id: 'profile', label: t('profile'), icon: User },
        ].map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition relative ${
                active ? 'text-[#0E2347]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className={`w-[19px] h-[19px] ${active ? 'text-[#D4A13B] stroke-[2.4]' : ''}`} />
              <span className={`text-[10px] mt-0.5 ${active ? 'font-extrabold text-[#0E2347]' : 'font-semibold'}`}>
                {item.label}
              </span>
              {active && <span className="w-7 h-[3px] rounded-full bg-[#D4A13B] mt-0.5" />}
            </button>
          );
        })}
      </nav>
    </div>
  );

  if (!framed) {
    return <div className="h-[100dvh] w-full bg-[#F3F6FB]">{appScreen}</div>;
  }

  return (
    <div className="w-[378px] h-[770px] rounded-[44px] bg-[#141A26] p-[11px] shadow-phone border-[3px] border-[#2C374B] relative shrink-0">
      <div className="w-full h-full rounded-[34px] overflow-hidden bg-[#F3F6FB]">{appScreen}</div>
    </div>
  );
}

function StatCell({ icon: Icon, iconColor, num, label, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center px-1 hover:bg-slate-50 transition rounded-lg">
      <Icon className={`w-4 h-4 ${iconColor} mb-0.5`} />
      <span className="text-[15px] font-extrabold text-[#0E2347] leading-tight">{num}</span>
      <span className="text-[9px] font-semibold text-slate-500 text-center leading-tight mt-0.5">{label}</span>
    </button>
  );
}

function QuickTile({ icon: Icon, label, tone, onClick }) {
  const iconColor =
    tone === 'navy' ? 'text-[#163366]' : tone === 'amber' ? 'text-amber-600' : 'text-[#D4A13B]';
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl py-2.5 px-2 border border-slate-200/75 shadow-sm hover:border-[#D4A13B] hover:shadow-md active:scale-95 transition flex items-center gap-1.5 text-left"
    >
      <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
      <span className="text-[10.5px] font-extrabold text-[#0E2347] leading-tight">{label}</span>
    </button>
  );
}
