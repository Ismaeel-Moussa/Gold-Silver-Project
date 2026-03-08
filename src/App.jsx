import Header from './components/Header';
import PriceCard from './components/PriceCard';
import SpreadCalculator from './components/SpreadCalculator';
import { useLivePrices } from './services/priceService';

export default function App() {
  const prices = useLivePrices();

  return (
    <div className="min-h-screen text-white">
      <Header isLive={prices.isLive}/>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Price Cards — staggered entry */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-14">
          <div style={{ animationDelay: '0ms' }}>
            <PriceCard
              metal="gold"
              priceUSD={prices.gold}
              usdToKwd={prices.usdToKwd}
              direction={prices.goldDirection}
              history={prices.goldHistory}
            />
          </div>
          <div style={{ animationDelay: '80ms' }}>
            <PriceCard
              metal="silver"
              priceUSD={prices.silver}
              usdToKwd={prices.usdToKwd}
              direction={prices.silverDirection}
              history={prices.silverHistory}
            />
          </div>
        </div>

        {/* Cost Calculator */}
        <div className="price-card-enter" style={{ animationDelay: '160ms', marginTop: '20px' }}>
          <SpreadCalculator
            goldUSD={prices.gold}
            silverUSD={prices.silver}
            usdToKwd={prices.usdToKwd}
          />
        </div>

        {/* Footer */}
        <footer className="text-center py-8 sm:py-10">
          <div className="inline-flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[11px] text-white/20 font-medium">
            <span>Updated {prices.lastUpdated.toLocaleTimeString('en-KW')}</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span>USD/KWD {prices.usdToKwd.toFixed(4)}</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span>{prices.isLive ? 'Source: gold-api.com' : 'Simulated data'}</span>
          </div>
          <p className="text-[10px] text-white/10 mt-2">@2026 Created By Ismaeel Moussa</p>
        </footer>
      </main>
    </div>
  );
}
