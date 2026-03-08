import { useState, useEffect } from 'react';

export default function Header({ isLive }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = time.toLocaleDateString('en-KW', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = time.toLocaleTimeString('en-KW', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <header className="sticky top-0 z-50"
      style={{
        background: 'linear-gradient(180deg, rgba(4,7,13,0.98) 0%, rgba(4,7,13,0.92) 100%)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Left: Clock (mobile) / Clock centered (desktop) */}
          <div className="flex items-center gap-3">
            {/* Mobile clock — left */}
            <div className="md:hidden">
              <div className="text-sm font-mono font-bold text-white/80 tabular-nums">{formattedTime}</div>
              <div className="text-[10px] text-white/25">{formattedDate}</div>
            </div>
            {/* Desktop clock — left */}
            <div className="hidden md:block">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-white/20 mb-1">Kuwait Time</div>
              <div className="text-sm font-mono font-bold text-white/80 tabular-nums tracking-wide">{formattedTime}</div>
              <div className="text-[10px] text-white/25 mt-0.5">{formattedDate}</div>
            </div>
          </div>

          {/* Right: Branding */}
          <div className="flex flex-col items-end">
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight leading-none">
              <span style={{
                background: 'linear-gradient(90deg, #fde68a 0%, #facc15 45%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                أسعار الذهب والفضة
              </span>
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isLive ? (
                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-400 font-semibold">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  Live
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-amber-400 font-semibold">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Demo
                </span>
              )}
              <span className="text-white/15 text-[10px]">·</span>
              <span className="text-[10px] text-white/30 hidden sm:inline">Kuwait Gold Market</span>
              <span className="text-[10px] text-white/30 sm:hidden">KWD</span>
            </div>
          </div>

        </div>
      </div>

    </header>
  );
}
