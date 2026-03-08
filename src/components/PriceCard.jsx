import { useState, useEffect, useRef } from 'react';
import { convertToKWD, getPriceForUnit, calcSpread } from '../services/priceEngine';

const UNITS = [
  { key: 'oz', label: '1 Oz' },
  { key: '1', label: '1g' },
  { key: '5', label: '5g' },
  { key: '10', label: '10g' },
  { key: '50', label: '50g' },
  { key: '100', label: '100g' },
];

const PURITIES = [24, 22, 21, 18];

export default function PriceCard({ metal, priceUSD, usdToKwd, direction, history }) {
  const [unit, setUnit] = useState('1');
  const [karat, setKarat] = useState(24);
  const [flicker, setFlicker] = useState('');
  const prevPrice = useRef(priceUSD);

  const isGold = metal === 'gold';
  const accentColor = isGold ? '#facc15' : '#94a3b8';
  const accentRgb = isGold ? '250,204,21' : '148,163,184';
  const metalLabel = isGold ? 'Gold' : 'Silver';
  const metalCode = isGold ? 'XAU' : 'XAG';
  const cardClass = isGold ? 'card-gold' : 'card-silver';
  const activeClass = isGold ? 'active-gold' : 'active-silver';

  const priceKWD = convertToKWD(priceUSD, usdToKwd);
  const displayPrice = getPriceForUnit(priceKWD, unit, karat);
  const { bid, ask } = calcSpread(displayPrice, isGold ? 0.3 : 0.6);
  const spreadAmount = ask - bid;

  useEffect(() => {
    if (priceUSD !== prevPrice.current) {
      setFlicker(priceUSD > prevPrice.current ? 'up' : 'down');
      prevPrice.current = priceUSD;
      const t = setTimeout(() => setFlicker(''), 600);
      return () => clearTimeout(t);
    }
  }, [priceUSD]);

  const flickerClass = flicker === 'up' ? 'animate-flicker-green' : flicker === 'down' ? 'animate-flicker-red' : '';
  const directionIcon = direction === 'up' ? '▲' : direction === 'down' ? '▼' : '●';
  const directionColor = direction === 'up' ? '#34d399' : direction === 'down' ? '#f87171' : 'rgba(255,255,255,0.2)';

  // Mini sparkline from history
  const sparkPoints = (history || []).slice(-20);
  const sparkMin = sparkPoints.length ? Math.min(...sparkPoints) : 0;
  const sparkMax = sparkPoints.length ? Math.max(...sparkPoints) : 1;
  const sparkRange = sparkMax - sparkMin || 1;
  const toSvgY = (v) => 28 - ((v - sparkMin) / sparkRange) * 24;
  const sparkPath = sparkPoints.length > 1
    ? sparkPoints.map((v, i) => `${i === 0 ? 'M' : 'L'}${(i / (sparkPoints.length - 1)) * 100},${toSvgY(v)}`).join(' ')
    : null;

  return (
    <div className={`glass-card ${cardClass} overflow-hidden price-card-enter`}>
      {/* Top accent */}
      <div className="h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent 5%, ${accentColor}80 50%, transparent 95%)` }} />

      <div className="p-4 sm:p-6">
        {/* ── Header Row ── */}
        <div className="flex items-start justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-3">
            {/* Metal icon */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center border shrink-0"
              style={{
                background: `linear-gradient(135deg, rgba(${accentRgb},0.15), rgba(${accentRgb},0.04))`,
                borderColor: `rgba(${accentRgb},0.22)`,
              }}>
              {isGold ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="url(#g1)" />
                  <defs>
                    <linearGradient id="g1" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#fde68a" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8" fill="url(#s1)" />
                  <circle cx="12" cy="12" r="5" fill="none" stroke="rgba(203,213,225,0.3)" strokeWidth="1" />
                  <defs>
                    <linearGradient id="s1" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#e2e8f0" />
                      <stop offset="100%" stopColor="#64748b" />
                    </linearGradient>
                  </defs>
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-none">{metalLabel}</h2>
              <p className="text-[11px] text-white/30 font-mono mt-0.5">{metalCode} · Spot</p>
            </div>
          </div>

          {/* Price display */}
          <div className={`text-right ${flickerClass}`}>
            <div className="flex items-baseline justify-end gap-1.5">
              <span className="text-[13px] font-bold transition-colors" style={{ color: directionColor }}>
                {directionIcon}
              </span>
              <span className="text-[26px] sm:text-[32px] font-extrabold text-white font-mono tracking-tight leading-none">
                {displayPrice.toFixed(unit === 'oz' ? 2 : 3)}
              </span>
            </div>
            <div className="text-[11px] text-white/25 font-medium mt-1">
              KWD / {unit === 'oz' ? 'Troy Oz' : `${unit}g`}
            </div>
          </div>
        </div>

        {/* ── Sparkline (if history) ── */}
        {sparkPath && (
          <div className="mb-4 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <svg width="100%" height="32" viewBox="0 0 100 32" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`spark-fill-${metal}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColor} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Fill area */}
              <path
                d={`${sparkPath} L100,32 L0,32 Z`}
                fill={`url(#spark-fill-${metal})`}
              />
              {/* Line */}
              <path
                d={sparkPath}
                fill="none"
                stroke={accentColor}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.7"
              />
            </svg>
          </div>
        )}

        {/* ── Bid / Ask ── */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
          <div className="inner-panel text-center"
            style={{ borderColor: 'rgba(52,211,153,0.1)', background: 'rgba(52,211,153,0.04)' }}>
            <div className="section-label" style={{ color: 'rgba(52,211,153,0.5)' }}>Bid (Buy)</div>
            <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono tabular-nums">
              {bid.toFixed(3)}
            </div>
          </div>
          <div className="inner-panel text-center"
            style={{ borderColor: 'rgba(248,113,113,0.1)', background: 'rgba(248,113,113,0.04)' }}>
            <div className="section-label" style={{ color: 'rgba(248,113,113,0.5)' }}>Ask (Sell)</div>
            <div className="text-base sm:text-lg font-bold text-rose-400 font-mono tabular-nums">
              {ask.toFixed(3)}
            </div>
          </div>
        </div>

        {/* Spread indicator */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.04)' }} />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/20">
            Spread {spreadAmount.toFixed(3)} KWD
          </span>
          <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.04)' }} />
        </div>

        {/* ── Unit selector (horizontal scroll on mobile) ── */}
        <div className="mb-3">
          <div className="section-label">Unit</div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {UNITS.map((u) => (
              <button
                key={u.key}
                onClick={() => setUnit(u.key)}
                className={`pill-btn shrink-0 ${unit === u.key ? activeClass : ''}`}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Purity selector ── */}
        <div>
          <div className="section-label">Purity</div>
          <div className="grid grid-cols-4 gap-1.5">
            {PURITIES.map((k) => (
              <button
                key={k}
                onClick={() => setKarat(k)}
                className={`pill-btn text-center ${karat === k ? activeClass : ''}`}
              >
                {k}K
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
