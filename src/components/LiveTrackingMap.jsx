import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BatteryCharging,
  Compass,
  ExternalLink,
  Gauge,
  MapPin,
  MessageCircle,
  Navigation,
  Pause,
  Phone,
  Play,
  Radio,
  ShieldCheck,
  Signal,
  Smartphone,
  TrainFront,
  Clock,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { OfficerAvatar } from './BrandAssets';

const STATIONS = [
  { code: 'RJN', name: 'Rajnandgaon', x: 75, y: 265 },
  { code: 'DURG', name: 'Durg Jn', x: 170, y: 235 },
  { code: 'R', name: 'Raipur Jn', x: 270, y: 200 },
  { code: 'BSP', name: 'Bilaspur Jn', x: 405, y: 150 },
  { code: 'CPH', name: 'Champa Jn', x: 515, y: 135 },
  { code: 'KRBA', name: 'Korba', x: 525, y: 55 },
  { code: 'RIG', name: 'Raigarh', x: 635, y: 165 },
];

const INITIAL_TRACKED_DRIVERS = [
  {
    id: 'drv-1',
    name: 'Rajeshwar Patel',
    role: 'Loco Pilot',
    employeeId: 'LP-10821',
    phone: '9826145021',
    train: '12859 Gitanjali Express',
    trainDetails: {
      number: '12859',
      name: 'Gitanjali Express',
      locoNo: 'WAP-7 #30412 (BSP Shed)',
      originDest: 'CSMT Mumbai → Howrah Jn',
      coaches: '22 LHB Coaches',
      signOn: '07:30 hrs (Raipur Lobby)',
      nextEta: 'Bilaspur Jn · ETA 12:24',
      runningStatus: 'On Time',
      coCrew: 'ALP: S. Tiwari · Guard: R. Sahu',
    },
    route: [
      { x: 270, y: 200, station: 'Raipur Jn (R)', lat: 21.2568, lng: 81.6296 },
      { x: 338, y: 175, station: 'Bhatapara (BYT)', lat: 21.7336, lng: 81.9424 },
      { x: 405, y: 150, station: 'Bilaspur Jn (BSP)', lat: 22.0797, lng: 82.1409 },
      { x: 515, y: 135, station: 'Champa Jn (CPH)', lat: 22.0357, lng: 82.6522 },
    ],
    progress: 0.42,
    speed: 86,
    battery: 92,
    geofence: 'En Route · BSP Corridor',
    status: 'On Duty',
    avatarVariant: 'officer-male-1',
  },
  {
    id: 'drv-2',
    name: 'Amit Kumar Sahu',
    role: 'Assistant Loco Pilot',
    employeeId: 'ALP-22310',
    phone: '9893076543',
    train: '15160 Sarnath Express',
    trainDetails: {
      number: '15160',
      name: 'Sarnath Express',
      locoNo: 'WAP-4 #22819 (R Shed)',
      originDest: 'Durg Jn → Chhapra Jn',
      coaches: '21 ICF Coaches',
      signOn: '08:00 hrs (Durg Lobby)',
      nextEta: 'Raipur Jn · ETA 12:18',
      runningStatus: 'On Time',
      coCrew: 'LP: D. Chandra · Guard: M. Verma',
    },
    route: [
      { x: 75, y: 265, station: 'Rajnandgaon (RJN)', lat: 21.0972, lng: 81.0282 },
      { x: 170, y: 235, station: 'Durg Jn (DURG)', lat: 21.1904, lng: 81.2849 },
      { x: 270, y: 200, station: 'Raipur Jn (R)', lat: 21.2568, lng: 81.6296 },
    ],
    progress: 0.58,
    speed: 68,
    battery: 84,
    geofence: 'Inside DURG → R Sector',
    status: 'On Duty',
    avatarVariant: 'officer-male-2',
  },
  {
    id: 'drv-3',
    name: 'Prakash Narayan',
    role: 'Train Manager',
    employeeId: 'TM-33091',
    phone: '9425512389',
    train: '18239 Gevra – Nagpur Exp',
    trainDetails: {
      number: '18239',
      name: 'Gevra Road – Itwari Express',
      locoNo: 'WAG-9H #31944 (BIA Shed)',
      originDest: 'Gevra Road → Itwari (Nagpur)',
      coaches: '18 ICF Coaches',
      signOn: '07:15 hrs (Korba Lobby)',
      nextEta: 'Champa Jn · ETA 12:40',
      runningStatus: 'Delayed +6 min (Caution B-12)',
      coCrew: 'LP: V. Rathore · ALP: K. Patel',
    },
    route: [
      { x: 525, y: 55, station: 'Korba (KRBA)', lat: 22.3595, lng: 82.7501 },
      { x: 515, y: 135, station: 'Champa Jn (CPH)', lat: 22.0357, lng: 82.6522 },
      { x: 405, y: 150, station: 'Bilaspur Jn (BSP)', lat: 22.0797, lng: 82.1409 },
    ],
    progress: 0.28,
    speed: 54,
    battery: 78,
    geofence: 'Caution Zone B-12 (30–55 km/h)',
    status: 'Caution Zone',
    avatarVariant: 'officer-male-3',
  },
  {
    id: 'drv-4',
    name: 'Harishankar Yadav',
    role: 'Loco Pilot',
    employeeId: 'LP-30411',
    phone: '9826890123',
    train: '12834 Howrah–ADI Exp',
    trainDetails: {
      number: '12834',
      name: 'Howrah – Ahmedabad Superfast',
      locoNo: 'WAP-7 #37205 (SRC Shed)',
      originDest: 'Howrah Jn → Ahmedabad Jn',
      coaches: '22 LHB Coaches',
      signOn: '06:45 hrs (Bilaspur Lobby)',
      nextEta: 'Raigarh · ETA 12:12',
      runningStatus: 'On Time',
      coCrew: 'ALP: P. Singh · Guard: A. Desai',
    },
    route: [
      { x: 515, y: 135, station: 'Champa Jn (CPH)', lat: 22.0357, lng: 82.6522 },
      { x: 635, y: 165, station: 'Raigarh (RIG)', lat: 21.8974, lng: 83.395 },
    ],
    progress: 0.72,
    speed: 94,
    battery: 96,
    geofence: 'Approaching RIG Lobby',
    status: 'On Duty',
    avatarVariant: 'officer-male-1',
  },
];

function interpolateRoute(route, t) {
  const segs = route.length - 1;
  const scaled = Math.min(0.999, Math.max(0, t)) * segs;
  const idx = Math.floor(scaled);
  const localT = scaled - idx;
  const a = route[idx];
  const b = route[idx + 1] || a;
  return {
    x: a.x + (b.x - a.x) * localT,
    y: a.y + (b.y - a.y) * localT,
    lat: (a.lat + (b.lat - a.lat) * localT).toFixed(4),
    lng: (a.lng + (b.lng - a.lng) * localT).toFixed(4),
    nextStation: b.station,
  };
}

function formatAgo(ms) {
  if (!ms) return 'Just now';
  const sec = Math.max(0, Math.round((Date.now() - ms) / 1000));
  if (sec < 10) return 'Just now';
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  return `${Math.round(min / 60)}h ago`;
}

export default function LiveTrackingMap() {
  const { driverGpsEnabled, realCoords, liveCrewLocations = [], contacts, notify, t } = useAppState();
  const [liveSim, setLiveSim] = useState(true);
  const [drivers, setDrivers] = useState(INITIAL_TRACKED_DRIVERS);
  const [selectedLiveUid, setSelectedLiveUid] = useState(null);
  const [selectedDemoId, setSelectedDemoId] = useState('drv-1');
  const [mapMode, setMapMode] = useState('auto'); // 'auto' | 'google' | 'corridor'

  // Auto-select the first real live GPS crew member as soon as any phone broadcasts!
  useEffect(() => {
    if (liveCrewLocations.length > 0 && !selectedLiveUid) {
      setSelectedLiveUid(liveCrewLocations[0].id);
    }
  }, [liveCrewLocations, selectedLiveUid]);

  useEffect(() => {
    if (!liveSim) return;
    const timer = setInterval(() => {
      setDrivers((prev) =>
        prev.map((d, i) => {
          const step = 0.018 + (i % 2) * 0.006;
          const nextProg = d.progress + step > 0.98 ? 0.04 : d.progress + step;
          const jitter = Math.round((Math.random() - 0.5) * 4);
          return {
            ...d,
            progress: nextProg,
            speed: Math.max(28, Math.min(108, d.speed + jitter)),
          };
        })
      );
    }, 1800);
    return () => clearInterval(timer);
  }, [liveSim]);

  const getDriverPhoto = (name) =>
    contacts.find((c) => c.name.toLowerCase() === (name || '').toLowerCase())?.photo || null;

  const selectedLiveCrew = useMemo(
    () => liveCrewLocations.find((c) => c.id === selectedLiveUid) || null,
    [liveCrewLocations, selectedLiveUid]
  );

  const selectedDemoDriver = drivers.find((d) => d.id === selectedDemoId) || drivers[0];
  const selectedDemoPos = interpolateRoute(selectedDemoDriver.route, selectedDemoDriver.progress);

  const showingRealCrew = Boolean(selectedLiveCrew) && mapMode !== 'corridor';
  const activeLat = selectedLiveCrew
    ? Number(selectedLiveCrew.lat).toFixed(5)
    : selectedDemoDriver.id === 'drv-1' && realCoords
    ? realCoords.lat.toFixed(5)
    : selectedDemoPos.lat;
  const activeLng = selectedLiveCrew
    ? Number(selectedLiveCrew.lng).toFixed(5)
    : selectedDemoDriver.id === 'drv-1' && realCoords
    ? realCoords.lng.toFixed(5)
    : selectedDemoPos.lng;

  const activeLiveCount = liveCrewLocations.filter((c) => c.gpsEnabled).length;

  return (
    <div className="space-y-5">
      {/* Top Status Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500">Live Phone GPS Feeds</p>
            <p className="text-xl font-extrabold text-[#0E2347]">
              {activeLiveCount} Live {activeLiveCount === 1 ? 'Crew' : 'Crews'}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FDF4DF] text-[#C8922A] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500">{t('stationGeofences')}</p>
            <p className="text-xl font-extrabold text-[#0E2347]">27 SECR Lobbies</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1A3F7A] flex items-center justify-center">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500">Selected Speed</p>
            <p className="text-xl font-extrabold text-[#0E2347]">
              {selectedLiveCrew ? `${selectedLiveCrew.speedKmh || 0} km/h` : `${selectedDemoDriver.speed} km/h`}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500">{t('cautionZones')}</p>
            <p className="text-xl font-extrabold text-[#0E2347]">1 Active (B-12)</p>
          </div>
        </div>
      </div>

      {/* Main Map + Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Interactive Map Column */}
        <section className="lg:col-span-8 bg-white rounded-2xl shadow-card border border-slate-200/70 overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-extrabold text-[15px] text-[#0E2347] flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#D4A13B]" />
                {showingRealCrew
                  ? `LIVE GPS: ${selectedLiveCrew.name} (${selectedLiveCrew.employeeId || selectedLiveCrew.phone})`
                  : t('mapTitle')}
              </h2>
              <p className="text-[11.5px] text-slate-500">
                {showingRealCrew
                  ? `Real-time phone coordinates (${activeLat}°N, ${activeLng}°E) · Last ping: ${formatAgo(selectedLiveCrew.updatedAtMs)}`
                  : t('mapSub')}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setMapMode('google')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  mapMode === 'google' || (mapMode === 'auto' && selectedLiveCrew)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Live Google Map
              </button>
              <button
                onClick={() => setMapMode('corridor')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  mapMode === 'corridor' || (mapMode === 'auto' && !selectedLiveCrew)
                    ? 'bg-[#0E2347] text-[#F3D27A]'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                SECR Corridor
              </button>
              {mapMode === 'corridor' && (
                <button
                  onClick={() => setLiveSim((v) => !v)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold"
                >
                  {liveSim ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>

          {mapMode === 'google' || (mapMode === 'auto' && selectedLiveCrew) ? (
            <div className="relative flex-1 min-h-[380px] bg-slate-100 flex flex-col">
              <iframe
                title="Live Crew GPS Map"
                src={`https://maps.google.com/maps?q=${activeLat},${activeLng}&z=15&output=embed`}
                className="w-full flex-1 min-h-[360px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="bg-[#0E2347] text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-mono font-bold text-[#F3D27A]">
                  📍 {activeLat}°N, {activeLng}°E
                  {selectedLiveCrew?.accuracy ? ` (±${selectedLiveCrew.accuracy}m)` : ''}
                </span>
                <a
                  href={`https://www.google.com/maps?q=${activeLat},${activeLng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-[#D4A13B] to-[#F3D27A] text-[#0E2347] font-extrabold text-[11px]"
                >
                  Open Exact Pin in Google Maps <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="relative bg-gradient-to-br from-[#0B1C3A] via-[#102852] to-[#0C2144] p-4 flex-1 min-h-[340px]">
              <svg viewBox="0 0 700 320" className="w-full h-full">
                <defs>
                  <pattern id="mapGrid" width="35" height="35" patternUnits="userSpaceOnUse">
                    <path d="M 35 0 L 0 0 0 35" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  </pattern>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <rect width="700" height="320" fill="url(#mapGrid)" rx="12" />

                <circle cx="518" cy="95" r="34" fill="rgba(245, 158, 11, 0.14)" stroke="#F59E0B" strokeDasharray="4 4" strokeWidth="1.5" />
                <text x="556" y="88" fill="#FCD34D" fontSize="9.5" fontWeight="700">Caution Zone B-12</text>

                <path
                  d="M 75 265 L 170 235 L 270 200 L 405 150 L 515 135 L 635 165"
                  fill="none"
                  stroke="#3B69B2"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.45"
                />
                <path
                  d="M 75 265 L 170 235 L 270 200 L 405 150 L 515 135 L 635 165"
                  fill="none"
                  stroke="#F3D27A"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                />
                <path d="M 515 135 L 525 55" fill="none" stroke="#3B69B2" strokeWidth="5" strokeLinecap="round" opacity="0.45" />
                <path d="M 515 135 L 525 55" fill="none" stroke="#F3D27A" strokeWidth="1.8" strokeDasharray="5 5" />

                {STATIONS.map((s) => (
                  <g key={s.code}>
                    <circle cx={s.x} cy={s.y} r="13" fill="rgba(212, 161, 59, 0.12)" stroke="rgba(243, 210, 122, 0.45)" strokeWidth="1" />
                    <circle cx={s.x} cy={s.y} r="4.5" fill="#FFFFFF" stroke="#0E2347" strokeWidth="2" />
                    <text x={s.x} y={s.y + 24} textAnchor="middle" fill="#FFFFFF" fontSize="10.5" fontWeight="800">
                      {s.code}
                    </text>
                    <text x={s.x} y={s.y + 35} textAnchor="middle" fill="#93B4E8" fontSize="8.5" fontWeight="500">
                      {s.name}
                    </text>
                  </g>
                ))}

                {drivers.map((d) => {
                  const pos = interpolateRoute(d.route, d.progress);
                  const active = !selectedLiveCrew && d.id === selectedDemoId;
                  const gpsOff = d.id === 'drv-1' && !driverGpsEnabled;
                  return (
                    <g
                      key={d.id}
                      onClick={() => {
                        setSelectedLiveUid(null);
                        setSelectedDemoId(d.id);
                      }}
                      style={{ cursor: 'pointer', transition: 'transform 1.5s linear' }}
                    >
                      {!gpsOff && (
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={active ? 19 : 14}
                          fill={d.status === 'Caution Zone' ? 'rgba(245,158,11,0.28)' : 'rgba(16,185,129,0.25)'}
                        />
                      )}
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={active ? 11 : 8.5}
                        fill={gpsOff ? '#64748B' : d.status === 'Caution Zone' ? '#F59E0B' : '#10B981'}
                        stroke={active ? '#F3D27A' : '#FFFFFF'}
                        strokeWidth={active ? 3 : 2}
                        filter="url(#glow)"
                      />
                      <rect
                        x={pos.x - 52}
                        y={pos.y - 33}
                        width="104"
                        height="20"
                        rx="6"
                        fill={active ? '#F3D27A' : 'rgba(14,35,71,0.94)'}
                        stroke={active ? '#FFFFFF' : 'rgba(243,210,122,0.45)'}
                        strokeWidth="1"
                      />
                      <text
                        x={pos.x}
                        y={pos.y - 20}
                        textAnchor="middle"
                        fill={active ? '#0E2347' : '#FFFFFF'}
                        fontSize="8.8"
                        fontWeight="800"
                      >
                        #{d.trainDetails.number} · {d.name.split(' ')[0]} ({gpsOff ? 'OFF' : `${d.speed}km/h`})
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
        </section>

        {/* Right Column: Live Connected Crew Roster + Telemetry */}
        <section className="lg:col-span-4 space-y-4">
          {/* REAL LIVE PHONE GPS CREW LIST (Firestore live_locations) */}
          <div className="bg-white rounded-2xl shadow-card border-2 border-emerald-500/40 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" /> Live Connected Crew ({liveCrewLocations.length})
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Real-Time
              </span>
            </div>

            {liveCrewLocations.length === 0 ? (
              <p className="text-[11px] text-slate-500 bg-slate-50 rounded-xl p-3 leading-relaxed">
                जैसे ही कोई भी लॉग-इन क्रू (जैसे आदित्य कुमार गौतम) अपने फोन पर **Live GPS ON** रखेगा या **Sync My Device GPS** दबाएगा, उनकी असली लोकेशन यहाँ तुरंत दिखने लगेगी।
              </p>
            ) : (
              <div className="space-y-1.5 max-h-56 overflow-y-auto">
                {liveCrewLocations.map((crew) => {
                  const active = selectedLiveUid === crew.id;
                  return (
                    <button
                      key={crew.id}
                      onClick={() => {
                        setSelectedLiveUid(crew.id);
                        setMapMode('google');
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition ${
                        active
                          ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                          : 'bg-[#FAFBFD] border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <OfficerAvatar photo={getDriverPhoto(crew.name)} name={crew.name} size={36} ring={crew.gpsEnabled} />
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-[#0E2347] truncate">{crew.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {crew.employeeId} · {crew.lobby || crew.station} · {formatAgo(crew.updatedAtMs)}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                          crew.gpsEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {crew.gpsEnabled ? 'LIVE' : 'OFF'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Crew Telemetry Card */}
          <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#C8922A]">
                {selectedLiveCrew ? 'Real Phone GPS Telemetry' : 'Corridor Demo Telemetry'}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedLiveCrew
                    ? selectedLiveCrew.gpsEnabled
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                    : 'bg-blue-50 text-blue-700'
                }`}
              >
                {selectedLiveCrew
                  ? selectedLiveCrew.gpsEnabled
                    ? `Live · ${formatAgo(selectedLiveCrew.updatedAtMs)}`
                    : 'GPS Paused'
                  : selectedDemoDriver.status}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <OfficerAvatar
                photo={getDriverPhoto(selectedLiveCrew ? selectedLiveCrew.name : selectedDemoDriver.name)}
                name={selectedLiveCrew ? selectedLiveCrew.name : selectedDemoDriver.name}
                variant={selectedLiveCrew ? 'officer-male-1' : selectedDemoDriver.avatarVariant}
                size={50}
                ring
              />
              <div className="min-w-0">
                <h3 className="font-extrabold text-base text-[#0E2347] truncate">
                  {selectedLiveCrew ? selectedLiveCrew.name : selectedDemoDriver.name}
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  {selectedLiveCrew
                    ? `${selectedLiveCrew.role} · ${selectedLiveCrew.employeeId}`
                    : `${selectedDemoDriver.role} · ${selectedDemoDriver.employeeId}`}
                </p>
                <p className="text-xs font-bold text-[#1B3C73] mt-0.5 truncate">
                  {selectedLiveCrew
                    ? `${selectedLiveCrew.division} · ${selectedLiveCrew.lobby}`
                    : selectedDemoDriver.train}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F5F8FC] border border-slate-100">
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-[#C8922A]" /> Exact GPS
                </div>
                <div className="font-mono font-bold text-[#0E2347] mt-0.5 text-[11px]">
                  {activeLat}, {activeLng}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F5F8FC] border border-slate-100">
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-[#C8922A]" /> Speed / Accuracy
                </div>
                <div className="font-extrabold text-[#0E2347] mt-0.5">
                  {selectedLiveCrew
                    ? `${selectedLiveCrew.speedKmh || 0} km/h${selectedLiveCrew.accuracy ? ` · ±${selectedLiveCrew.accuracy}m` : ''}`
                    : `${selectedDemoDriver.speed} km/h`}
                </div>
              </div>
            </div>

            {!selectedLiveCrew && (
              <div className="rounded-xl bg-gradient-to-br from-[#0E2347] to-[#17366B] text-white p-3 space-y-1.5 border border-[#D4A13B]/35 text-[10.5px]">
                <div className="flex items-center gap-2 font-extrabold text-xs">
                  <TrainFront className="w-4 h-4 text-[#F3D27A]" />
                  <span>
                    {selectedDemoDriver.trainDetails.number} · {selectedDemoDriver.trainDetails.name}
                  </span>
                </div>
                <div className="text-blue-200">{selectedDemoDriver.trainDetails.locoNo} · {selectedDemoDriver.trainDetails.originDest}</div>
                <div className="flex items-center gap-1 text-[#F3D27A] font-semibold">
                  <Clock className="w-3 h-3" /> {selectedDemoDriver.trainDetails.nextEta}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              <a
                href={`tel:${selectedLiveCrew?.phone || selectedDemoDriver.phone}`}
                className="py-2 rounded-xl bg-[#0E2347] text-white text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#17366B]"
              >
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
              <a
                href={`https://wa.me/91${(selectedLiveCrew?.phone || selectedDemoDriver.phone || '').replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1 hover:bg-emerald-700"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Chat
              </a>
              <a
                href={`https://www.google.com/maps?q=${activeLat},${activeLng}`}
                target="_blank"
                rel="noreferrer"
                className="py-2 rounded-xl bg-gradient-to-r from-[#D4A13B] to-[#E5B84B] text-[#0E2347] text-xs font-extrabold flex items-center justify-center gap-1 hover:brightness-95"
              >
                <MapPin className="w-3.5 h-3.5" /> Map
              </a>
            </div>
          </div>

          {/* Corridor Demo Trains Switcher */}
          <div className="bg-white rounded-2xl shadow-card border border-slate-200/70 p-4 space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">SECR Corridor Reference Trains</h3>
            <div className="space-y-1.5">
              {drivers.map((d) => {
                const active = !selectedLiveCrew && d.id === selectedDemoId;
                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      setSelectedLiveUid(null);
                      setSelectedDemoId(d.id);
                      setMapMode('corridor');
                    }}
                    className={`w-full p-2 rounded-xl border text-left flex items-center justify-between gap-2 transition ${
                      active ? 'bg-[#FDF6E4] border-[#D4A13B]' : 'bg-[#FAFBFD] border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0E2347] truncate">{d.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{d.train}</p>
                    </div>
                    <span className="text-[10.5px] font-extrabold text-emerald-700 shrink-0">{d.speed} km/h</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
