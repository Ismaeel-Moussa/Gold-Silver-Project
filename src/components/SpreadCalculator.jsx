import { useState } from 'react';
import { convertToKWD, ouncesToGrams, applyPurity, calcTotalCost } from '../services/priceEngine';

const METALS = [
  { key: 'gold', label: 'Gold', icon: '🥇' },
  { key: 'silver', label: 'Silver', icon: '🥈' },
];

const PURITIES = [
  { value: 24, label: '24K — 99.9%' },
  { value: 22, label: '22K — 91.7%' },
  { value: 21, label: '21K — 87.5%' },
  { value: 18, label: '18K — 75.0%' },
];

export default function SpreadCalculator({ goldUSD, silverUSD, usdToKwd }) {
  const [metal, setMetal] = useState('gold');
  const [weight, setWeight] = useState('10');
  const [karat, setKarat] = useState(21);
  const [makingCharge, setMakingCharge] = useState('5');

  const spotUSD = metal === 'gold' ? goldUSD : silverUSD;
  const pricePerGramKWD = ouncesToGrams(convertToKWD(spotUSD, usdToKwd));
  const pureGramPrice = applyPurity(pricePerGramKWD, karat);

  const w = parseFloat(weight) || 0;
  const mc = parseFloat(makingCharge) || 0;
  const metalCost = w * pureGramPrice;
  const totalCost = calcTotalCost(w, pureGramPrice, mc);
  const makingCost = totalCost - metalCost;

  const isGold = metal === 'gold';
  const activeClass = isGold ? 'active-gold' : 'active-silver';
  const accent = isGold ? '#facc15' : '#94a3b8';
  const accentRgb = isGold ? '250,204,21' : '148,163,184';

  return (
    <div className="glass-card overflow-hidden">
      {/* Top accent */}
      <div className="h-[2px]"
        style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(52,211,153,0.5) 50%, transparent 95%)' }} />

      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border"
            style={{
              background: 'rgba(52,211,153,0.08)',
              borderColor: 'rgba(52,211,153,0.18)',
            }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#34d399">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Cost Calculator</h3>
            <p className="text-[11px] text-white/30">Estimate total cost with making charges</p>
          </div>
        </div>

        {/* Metal Selector */}
        <div className="mb-5">
          <div className="section-label">Metal</div>
          <div className="grid grid-cols-2 gap-2">
            {METALS.map((m) => (
              <button
                key={m.key}
                onClick={() => setMetal(m.key)}
                className={`pill-btn text-center text-sm ${metal === m.key ? activeClass : ''}`}
              >
                {m.icon} {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {/* Weight */}
          <div>
            <label className="section-label block">Weight</label>
            <div className="relative">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="0"
                step="0.1"
                className="form-input pr-10"
                placeholder="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-white/25 font-mono pointer-events-none">g</span>
            </div>
          </div>

          {/* Purity */}
          <div>
            <label className="section-label block">Purity</label>
            <select
              value={karat}
              onChange={(e) => setKarat(Number(e.target.value))}
              className="form-select"
            >
              {PURITIES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Making Charge */}
          <div>
            <label className="section-label block">Making Charge</label>
            <div className="relative">
              <input
                type="number"
                value={makingCharge}
                onChange={(e) => setMakingCharge(e.target.value)}
                min="0"
                step="0.5"
                className="form-input pr-8"
                placeholder="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-white/25 font-mono pointer-events-none">%</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.05)' }} />
          <span className="text-[10px] uppercase tracking-widest font-semibold text-white/20">Breakdown</span>
          <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.05)' }} />
        </div>

        {/* Results */}
        <div className="inner-panel">
          {/* Stat row */}
          <div className="grid grid-cols-3 gap-2 mb-4 pb-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="text-center">
              <div className="section-label">Price / g</div>
              <div className="text-sm sm:text-base font-bold font-mono tabular-nums" style={{ color: accent }}>
                {pureGramPrice.toFixed(3)}
              </div>
              <div className="text-[9px] text-white/20 mt-0.5">KWD</div>
            </div>
            <div className="text-center">
              <div className="section-label">Metal Cost</div>
              <div className="text-sm sm:text-base font-bold text-white/80 font-mono tabular-nums">
                {metalCost.toFixed(3)}
              </div>
              <div className="text-[9px] text-white/20 mt-0.5">KWD</div>
            </div>
            <div className="text-center">
              <div className="section-label">Making</div>
              <div className="text-sm sm:text-base font-bold text-amber-400/80 font-mono tabular-nums">
                +{makingCost.toFixed(3)}
              </div>
              <div className="text-[9px] text-white/20 mt-0.5">KWD</div>
            </div>
          </div>

          {/* Total cost — prominent */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-white/30">Total Cost</div>
              <div className="text-[11px] text-white/20 mt-0.5">
                {w}g · {karat}K {isGold ? 'Gold' : 'Silver'}
                {mc > 0 ? ` + ${mc}% making` : ''}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono tabular-nums tracking-tight">
                {totalCost.toFixed(3)}
              </div>
              <div className="text-[11px] text-white/25 font-semibold mt-0.5">KWD</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
