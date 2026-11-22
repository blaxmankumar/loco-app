import React from 'react';

export function LocoLogo({ size = 40, variant = 'box' }) {
  if (variant === 'inline') {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className="shrink-0">
        <rect x="14" y="8" width="36" height="34" rx="9" fill="#FFFFFF" />
        <rect x="20" y="14" width="24" height="13" rx="3.5" fill="#132B55" />
        <circle cx="22" cy="34" r="3" fill="#132B55" />
        <circle cx="42" cy="34" r="3" fill="#132B55" />
        <rect x="26" y="4" width="12" height="3" rx="1.5" fill="#F3D27A" />
        <path d="M22 44 L10 59 M42 44 L54 59" stroke="#F3D27A" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M18 48.5 H46 M15 53.5 H49 M12 58.5 H52" stroke="#D4A13B" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className="shrink-0 drop-shadow-sm">
      <defs>
        <linearGradient id="locoBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1B3C73" />
          <stop offset="100%" stopColor="#0B1C3A" />
        </linearGradient>
        <linearGradient id="locoGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5D98B" />
          <stop offset="100%" stopColor="#C8922A" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="28" fill="url(#locoBg)" />
      <rect x="33" y="21" width="54" height="53" rx="14" fill="#FFFFFF" />
      <rect x="43" y="29" width="34" height="20" rx="5" fill="#132B55" />
      <circle cx="45" cy="60" r="4.5" fill="#132B55" />
      <circle cx="75" cy="60" r="4.5" fill="#132B55" />
      <rect x="52" y="14" width="16" height="4.5" rx="2.25" fill="#F3D27A" />
      <path d="M44 76 L24 102 M76 76 L96 102" stroke="url(#locoGold)" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M38 83 H82 M33 91 H87 M27 99 H93" stroke="url(#locoGold)" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

const AVATAR_STYLES = {
  'officer-male-1': { bg: '#DDE8F8', skin: '#E5B899', hair: '#1E293B', cap: true, female: false },
  'officer-male-2': { bg: '#E3ECFA', skin: '#DDA885', hair: '#1F2937', cap: true, female: false },
  'officer-male-3': { bg: '#DCE6F5', skin: '#D49A74', hair: '#111827', cap: false, female: false },
  'officer-female-1': { bg: '#E8EEF9', skin: '#E9BE9F', hair: '#1E293B', cap: false, female: true },
  'officer-female-2': { bg: '#E2E9F7', skin: '#DFAD8C', hair: '#27272A', cap: false, female: true },
  'admin-chief': { bg: '#D8E5F8', skin: '#DFB090', hair: '#1B2538', cap: true, female: false },
};

export function OfficerAvatar({
  photo,
  name = 'Crew',
  variant = 'officer-male-1',
  size = 40,
  ring = false,
  className = '',
}) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        style={{ width: size, height: size }}
        className={`rounded-full object-cover shrink-0 ${
          ring ? 'ring-2 ring-[#F3D27A] shadow-sm' : 'ring-1 ring-slate-200'
        } ${className}`}
      />
    );
  }

  const cfg = AVATAR_STYLES[variant] || AVATAR_STYLES['officer-male-1'];
  return (
    <div
      style={{ width: size, height: size, backgroundColor: cfg.bg }}
      className={`rounded-full overflow-hidden shrink-0 flex items-center justify-center ${
        ring ? 'ring-2 ring-[#F3D27A] shadow-sm' : 'ring-1 ring-slate-200/80'
      } ${className}`}
      title={name}
    >
      <svg viewBox="0 0 64 64" className="w-full h-full">
        {/* Crisp railway white uniform shoulders */}
        <path d="M10 64 C12 48, 22 44, 32 44 C42 44, 52 48, 54 64 Z" fill="#FFFFFF" />
        {/* Epaulettes navy + gold */}
        <rect x="13" y="48" width="9" height="4" rx="1.5" fill="#0E2347" />
        <rect x="42" y="48" width="9" height="4" rx="1.5" fill="#0E2347" />
        <rect x="15" y="49" width="2" height="2" fill="#D4A13B" />
        <rect x="47" y="49" width="2" height="2" fill="#D4A13B" />
        {/* Navy tie */}
        <path d="M30 46 L34 46 L35 58 L32 62 L29 58 Z" fill="#0E2347" />
        {/* Collar */}
        <path d="M25 44 L32 50 L39 44" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
        {/* Neck */}
        <rect x="28" y="37" width="8" height="9" rx="3" fill={cfg.skin} />
        {/* Hair back for female */}
        {cfg.female && <ellipse cx="32" cy="27" rx="15" ry="16" fill={cfg.hair} />}
        {/* Head */}
        <ellipse cx="32" cy="28" rx="11.5" ry="12.5" fill={cfg.skin} />
        {/* Eyes & gentle smile */}
        <circle cx="27.8" cy="27.5" r="1.4" fill="#1E293B" />
        <circle cx="36.2" cy="27.5" r="1.4" fill="#1E293B" />
        <path d="M28.5 33.5 Q32 36 35.5 33.5" stroke="#8C5B45" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        {/* Hair or Railway Officer Cap */}
        {cfg.cap ? (
          <>
            <path d="M18 19 Q32 10 46 19 L44 23 L20 23 Z" fill="#0E2347" />
            <rect x="20" y="21" width="24" height="3.2" rx="1.5" fill="#D4A13B" />
            <circle cx="32" cy="17.5" r="2.2" fill="#F3D27A" />
          </>
        ) : (
          <path d="M20 26 C20 15, 44 15, 44 26 C40 20, 24 20, 20 26 Z" fill={cfg.hair} />
        )}
      </svg>
    </div>
  );
}

export function TrainSilhouette({ className = '' }) {
  return (
    <svg viewBox="0 0 260 110" fill="none" className={className}>
      <path
        d="M25 88 L115 44 C135 34, 165 30, 198 30 L248 30 C254 30, 256 35, 253 42 L232 76 C225 85, 214 88, 198 88 Z"
        fill="currentColor"
        fillOpacity="0.16"
      />
      <path
        d="M126 50 L185 38 L236 38 L226 54 L132 56 Z"
        fill="currentColor"
        fillOpacity="0.24"
      />
      <path d="M18 93 H250" stroke="#F3D27A" strokeOpacity="0.35" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M8 101 H255" stroke="currentColor" strokeOpacity="0.18" strokeWidth="2" strokeLinecap="round" />
      <circle cx="215" cy="70" r="4" fill="#F3D27A" fillOpacity="0.6" />
      <circle cx="195" cy="72" r="3" fill="#F3D27A" fillOpacity="0.45" />
    </svg>
  );
}

export function TrainPhotoGraphic({ title = 'Safety Drill – Zone 3' }) {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg bg-gradient-to-br from-[#6EA8E5] via-[#B4D5F5] to-[#E6EFF9]">
      <svg viewBox="0 0 180 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6AA1DE" />
            <stop offset="100%" stopColor="#D7E8F9" />
          </linearGradient>
        </defs>
        <rect width="180" height="100" fill="url(#skyGrad)" />
        {/* Platform roof */}
        <path d="M0 15 L120 35 L120 42 L0 26 Z" fill="#1F3A68" opacity="0.85" />
        {/* Platform floor */}
        <path d="M0 78 L180 62 L180 100 L0 100 Z" fill="#CBD5E1" />
        <path d="M0 84 L180 69" stroke="#D4A13B" strokeWidth="2.5" />
        {/* Express train body */}
        <path d="M35 76 L62 34 C68 27, 82 24, 118 24 L168 24 L158 76 Z" fill="#FFFFFF" />
        <path d="M40 69 L160 66 L158 76 L35 76 Z" fill="#0E2347" />
        <path d="M44 63 L162 60" stroke="#D4A13B" strokeWidth="3.5" />
        <path d="M68 35 L112 33 L106 52 L58 53 Z" fill="#132B55" />
        <rect x="118" y="33" width="22" height="16" rx="2" fill="#1E3F75" />
        <rect x="145" y="33" width="16" height="16" rx="2" fill="#1E3F75" />
      </svg>
      <span className="sr-only">{title}</span>
    </div>
  );
}
