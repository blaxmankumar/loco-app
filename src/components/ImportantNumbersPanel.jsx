import React, { useMemo, useState } from 'react';
import { MessageCircle, Phone, Search } from 'lucide-react';
import { IMPORTANT_PHONE_CATEGORIES, IMPORTANT_PHONE_NUMBERS } from '../data/importantNumbers';

export default function ImportantNumbersPanel({
  compact = false,
  dark = false,
  divisionFilter = 'All',
  lobbyFilter = 'All',
}) {
  const mappedCat =
    divisionFilter === 'Bilaspur'
      ? 'BSP Division'
      : divisionFilter === 'Raipur'
      ? 'Raipur Division'
      : divisionFilter === 'Nagpur'
      ? 'NGP Division'
      : 'All';

  const [cat, setCat] = useState(mappedCat);
  const [q, setQ] = useState('');

  React.useEffect(() => {
    setCat(mappedCat);
  }, [mappedCat]);

  const items = useMemo(() => {
    const term = q.trim().toLowerCase();
    const lobbyCodeMatch = lobbyFilter !== 'All' ? lobbyFilter.match(/\(([^)]+)\)/) : null;
    const lobbyCode = lobbyCodeMatch ? lobbyCodeMatch[1].toLowerCase() : '';
    const lobbyWord = lobbyFilter !== 'All' ? lobbyFilter.split('(')[0].trim().toLowerCase() : '';

    return IMPORTANT_PHONE_NUMBERS.filter((item) => {
      if (cat !== 'All' && item.category !== cat) return false;
      if (lobbyFilter !== 'All') {
        const hay = `${item.name} ${item.display}`.toLowerCase();
        if (!(lobbyCode && hay.includes(lobbyCode)) && !(lobbyWord && hay.includes(lobbyWord))) {
          return false;
        }
      }
      if (!term) return true;
      return `${item.name} ${item.display} ${item.category}`.toLowerCase().includes(term);
    });
  }, [cat, q, lobbyFilter]);

  const cardBg = dark
    ? 'bg-[#101F3C] border-white/10 text-slate-100'
    : 'bg-white border-slate-200/80 text-[#0E2347]';

  return (
    <div className={`rounded-2xl border shadow-card ${compact ? 'p-3' : 'p-5'} space-y-3 ${cardBg}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className={`${compact ? 'text-xs' : 'text-base'} font-extrabold`}>
            Official SECR Call Book &amp; Important Numbers ({items.length})
          </h3>
          <p className={`${compact ? 'text-[10px]' : 'text-xs'} ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            Bilaspur TLC (52) · BSP · Raipur · NGP · CKP · SBP Lobbies, RPF/GRPF &amp; Controller
          </p>
        </div>
        <div className={`relative ${compact ? 'w-full' : 'w-64'}`}>
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search lobby, TLC, RPF, number..."
            className={`w-full pl-8 pr-3 py-1.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#D4A13B] ${
              dark ? 'bg-white/10 border-white/15 text-white placeholder:text-slate-400' : 'bg-[#F8FAFC] border-slate-200'
            }`}
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {IMPORTANT_PHONE_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold whitespace-nowrap transition border ${
              cat === c
                ? 'bg-[#0E2347] text-[#F3D27A] border-[#0E2347]'
                : dark
                ? 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                : 'bg-[#F4F7FC] text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Numbers Grid / List */}
      <div
        className={`grid ${
          compact ? 'grid-cols-1 max-h-80 overflow-y-auto pr-0.5' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
        } gap-2`}
      >
        {items.map((item) => {
          const isMobile10 = /^\d{10}$/.test(item.dial);
          return (
            <div
              key={item.id}
              className={`rounded-xl border px-3 py-2.5 flex items-center justify-between gap-2 transition hover:border-[#D4A13B] ${
                dark ? 'bg-white/5 border-white/10' : 'bg-[#FAFBFD] border-slate-200/75'
              }`}
            >
              <a href={`tel:${item.dial}`} className="min-w-0 flex-1 group">
                <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#C8922A]">
                  {item.category}
                </span>
                <p className="text-xs font-extrabold truncate group-hover:text-[#0A66C2]">{item.name}</p>
                <p className={`text-[11px] font-mono font-semibold truncate ${dark ? 'text-blue-200' : 'text-slate-600'}`}>
                  {item.display}
                </p>
              </a>
              <div className="flex items-center gap-1 shrink-0">
                {isMobile10 && (
                  <a
                    href={`https://wa.me/91${item.dial}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>
                )}
                <a
                  href={`tel:${item.dial}`}
                  className="w-7 h-7 rounded-lg bg-[#0E2347] text-[#F3D27A] flex items-center justify-center hover:bg-[#17366B]"
                  title={`Call ${item.dial}`}
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
