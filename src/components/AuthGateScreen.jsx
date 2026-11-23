import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Lock,
  LogOut,
  Phone,
  ShieldCheck,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { isAdminEmail } from '../firebase';
import { DIVISION_LOBBIES, DIVISIONS, INITIAL_CONTACTS, ROLES } from '../data/initialData';
import { LocoLogo } from './BrandAssets';

export default function AuthGateScreen() {
  const {
    currentUser,
    authLoading,
    authError,
    firebaseLogin,
    firebaseRegister,
    firebaseLogout,
  } = useAppState();

  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [role, setRole] = useState('Loco Pilot');
  const [division, setDivision] = useState('Bilaspur');
  const [lobby, setLobby] = useState('Bilaspur (BSP)');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const adminDetected = isAdminEmail(identifier);

  // Auto-lookup in official 993 Bilaspur (BSP) crew directory when 10 digits typed
  const bspMatch = useMemo(() => {
    const digits = identifier.replace(/\D/g, '');
    if (digits.length !== 10) return null;
    return INITIAL_CONTACTS.find((c) => c.verified && c.phone === digits) || null;
  }, [identifier]);

  const handleIdentifierChange = (val) => {
    setIdentifier(val);
    const digits = val.replace(/\D/g, '');
    if (digits.length === 10) {
      const found = INITIAL_CONTACTS.find((c) => c.verified && c.phone === digits);
      if (found) {
        setFullName(found.name);
        setEmployeeId(found.employeeId);
        setRole(found.role);
        setDivision(found.division);
        setLobby(found.lobby);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!identifier.trim() || !password.trim()) {
      setLocalError('कृपया मोबाइल नंबर (या Admin ईमेल) और पासवर्ड डालें।');
      return;
    }
    if (password.length < 6) {
      setLocalError('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
      return;
    }
    setSubmitting(true);
    try {
      if (tab === 'login') {
        await firebaseLogin(identifier, password);
      } else {
        if (!fullName.trim()) {
          setLocalError('कृपया अपना पूरा नाम लिखें।');
          setSubmitting(false);
          return;
        }
        const codeMatch = lobby.match(/\(([^)]+)\)/);
        await firebaseRegister({
          identifier,
          password,
          name: fullName.trim(),
          employeeId: employeeId.trim() || `CRW-${Math.floor(10000 + Math.random() * 89999)}`,
          role,
          division,
          lobby,
          station: codeMatch ? codeMatch[1] : 'BSP',
          verifiedInBspList: Boolean(bspMatch),
        });
      }
    } catch (err) {
      setLocalError(err?.message || 'Login/Registration failed. Please check details.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-b from-[#132C58] to-[#09162E] text-white flex flex-col items-center justify-center p-6">
        <LocoLogo size={74} />
        <p className="mt-4 text-sm font-bold text-[#F3D27A] tracking-wider animate-pulse">
          Connecting to LOCO Secure Server...
        </p>
      </div>
    );
  }

  // Signed in, but waiting for Admin Approval (live Firestore listener auto-unlocks on approval!)
  if (currentUser && !currentUser.approved && !currentUser.isAdmin) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-b from-[#132C58] to-[#09162E] text-white flex items-center justify-center p-5">
        <div className="w-full max-w-md rounded-3xl bg-[#0F244A]/95 border border-[#F3D27A]/30 p-7 text-center space-y-5 shadow-2xl">
          <div className="flex flex-col items-center">
            <LocoLogo size={68} />
            <div className="mt-4 w-14 h-14 rounded-full bg-amber-400/20 border border-[#F3D27A]/50 text-[#F3D27A] flex items-center justify-center">
              <Clock className="w-7 h-7 animate-pulse" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-white">Waiting for Admin Approval</h2>
            <p className="text-xs text-blue-200/85 mt-1.5 leading-relaxed">
              आपका रजिस्ट्रेशन सुरक्षित रूप से **LOCO Admin Control Center** पर पहुँच गया है। जैसे ही Admin आपका अकाउंट **Approve** करेंगे, यह स्क्रीन अपने-आप खुल जाएगी।
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-left text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-blue-200/70">Name</span>
              <span className="font-bold text-white">{currentUser.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200/70">Crew ID / Mobile</span>
              <span className="font-mono font-bold text-[#F3D27A]">
                {currentUser.employeeId} · {currentUser.phone}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200/70">Division / Lobby</span>
              <span className="font-semibold text-white">
                {currentUser.division} · {currentUser.lobby}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200/70">Document Access</span>
              <span className="font-bold text-amber-300">Locked until Approved</span>
            </div>
          </div>

          <button
            onClick={firebaseLogout}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-blue-100 flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" /> Sign Out / Switch Account
          </button>
        </div>
      </div>
    );
  }

  const lobbies = DIVISION_LOBBIES[division] || DIVISION_LOBBIES.Bilaspur;

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-[#132C58] via-[#0E2347] to-[#08152C] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-[#0F244A]/95 border border-[#F3D27A]/30 p-6 sm:p-7 shadow-2xl space-y-5">
        <div className="flex flex-col items-center text-center">
          <LocoLogo size={72} />
          <h1 className="mt-3 text-2xl font-extrabold tracking-[0.22em] text-[#F3D27A]">LOCO</h1>
          <p className="text-xs text-blue-200/80 mt-1">
            SECR Railway Staff Portal · Secured by Admin Approval
          </p>
        </div>

        {/* Switcher: Sign In vs Register */}
        <div className="grid grid-cols-2 bg-white/10 p-1 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setLocalError('');
            }}
            className={`py-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition ${
              tab === 'login' ? 'bg-[#F3D27A] text-[#0E2347]' : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <Lock className="w-3.5 h-3.5" /> Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setLocalError('');
            }}
            className={`py-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition ${
              tab === 'register' ? 'bg-[#F3D27A] text-[#0E2347]' : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> New Staff Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-blue-200 mb-1">
              {tab === 'login'
                ? '10-Digit Mobile Number (or Admin Email)'
                : '10-Digit Mobile Number (or Admin Email) *'}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                required
                value={identifier}
                onChange={(e) => handleIdentifierChange(e.target.value)}
                placeholder={
                  tab === 'login'
                    ? 'e.g. 9752441638 or kumarblaxman@gmail.com'
                    : '10-digit mobile number (or Admin email)'
                }
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white text-[#0E2347] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#F3D27A]"
              />
            </div>
            {adminDetected && (
              <div className="mt-1.5 px-2.5 py-1.5 rounded-lg bg-[#D4A13B]/25 border border-[#F3D27A]/60 text-[#F3D27A] text-[11px] font-extrabold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Authorized LOCO System Admin Account</span>
              </div>
            )}
            {bspMatch && (
              <div className="mt-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-[11px] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>
                  BSP Official List Match: {bspMatch.employeeId} · {bspMatch.name}
                </span>
              </div>
            )}
          </div>

          {tab === 'register' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-blue-200 mb-1">Full Name *</label>
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3 py-2 rounded-xl bg-white text-[#0E2347] text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-blue-200 mb-1">Crew ID</label>
                  <input
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                    placeholder="e.g. BSP3432"
                    className="w-full px-3 py-2 rounded-xl bg-white text-[#0E2347] text-xs font-semibold uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <select
                  value={division}
                  onChange={(e) => {
                    const nextDiv = e.target.value;
                    setDivision(nextDiv);
                    setLobby((DIVISION_LOBBIES[nextDiv] || DIVISION_LOBBIES.Bilaspur)[0]);
                  }}
                  className="px-2 py-2 rounded-xl bg-white text-[#0E2347] text-[11px] font-bold"
                >
                  {DIVISIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select
                  value={lobby}
                  onChange={(e) => setLobby(e.target.value)}
                  className="px-2 py-2 rounded-xl bg-white text-[#0E2347] text-[11px] font-bold"
                >
                  {lobbies.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="px-2 py-2 rounded-xl bg-white text-[#0E2347] text-[11px] font-bold"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-bold text-blue-200 mb-1">Password *</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={tab === 'register' ? 'Create password (min 6 chars)' : 'Enter your password'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white text-[#0E2347] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#F3D27A]"
            />
          </div>

          {(localError || authError) && (
            <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-400/40 text-red-100 text-xs font-semibold">
              {localError || authError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4A13B] to-[#F3D27A] text-[#0E2347] font-extrabold text-sm shadow-lg hover:brightness-105 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {tab === 'login' ? (
              <>
                <UserCheck className="w-4 h-4" />
                {submitting ? 'Signing In...' : 'Sign In to LOCO'}
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                {submitting ? 'Submitting...' : 'Register & Request Admin Approval'}
              </>
            )}
          </button>
        </form>

        <p className="text-[10.5px] text-center text-blue-200/70 leading-relaxed">
          नए क्रू मेंबर पहली बार अपने मोबाइल नंबर से Register करें — Admin के Approve करते ही Documents व Crew Directory खुल जाएगी।
        </p>
      </div>
    </div>
  );
}
