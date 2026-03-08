import { useState, useEffect, useRef, useCallback } from 'react';

const EXCHANGE_API_KEY = import.meta.env.VITE_EXCHANGE_API_KEY;
const DEFAULT_KWD_RATE = 0.3075;

/**
 * Custom hook: provides live gold/silver spot prices (USD/oz),
 * USD→KWD rate, price history for sparklines, and direction indicators.
 *
 * Uses gold-api.com (free, no key, no rate limits, CORS-enabled).
 */
export function useLivePrices() {
  const [prices, setPrices] = useState({
    gold: 0,
    silver: 0,
    usdToKwd: DEFAULT_KWD_RATE,
    goldDirection: 'flat',
    silverDirection: 'flat',
    goldHistory: [],
    silverHistory: [],
    lastUpdated: new Date(),
    isLive: false,
  });

  const prevGold = useRef(0);
  const prevSilver = useRef(0);
  const historyRef = useRef({ gold: [], silver: [] });
  const kwdRateRef = useRef(DEFAULT_KWD_RATE);

  // Fetch exchange rate (every 60 min)
  const fetchExchangeRate = useCallback(async () => {
    if (!EXCHANGE_API_KEY) return;
    try {
      const res = await fetch(
        `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/pair/USD/KWD`
      );
      const data = await res.json();
      if (data.result === 'success') {
        kwdRateRef.current = data.conversion_rate;
      }
    } catch (e) {
      console.warn('Exchange rate fetch failed, using cached rate:', e.message);
    }
  }, []);

  // Fetch metals prices from gold-api.com (FREE, no key required)
  const fetchMetals = useCallback(async () => {
    try {
      const [goldRes, silverRes] = await Promise.all([
        fetch('https://api.gold-api.com/price/XAU'),
        fetch('https://api.gold-api.com/price/XAG'),
      ]);

      const goldData = await goldRes.json();
      const silverData = await silverRes.json();

      if (goldData.price && silverData.price) {
        updatePrices(goldData.price, silverData.price, true);
      }
    } catch (e) {
      console.warn('Metals fetch failed:', e.message);
      // If we already have prices, keep them (don't reset to 0)
      if (prevGold.current > 0) {
        updatePrices(prevGold.current, prevSilver.current, false);
      }
    }
  }, []);

  function updatePrices(goldPrice, silverPrice, live) {
    const goldDir =
      prevGold.current === 0 ? 'flat' :
      goldPrice > prevGold.current ? 'up' :
      goldPrice < prevGold.current ? 'down' : 'flat';
    const silverDir =
      prevSilver.current === 0 ? 'flat' :
      silverPrice > prevSilver.current ? 'up' :
      silverPrice < prevSilver.current ? 'down' : 'flat';

    prevGold.current = goldPrice;
    prevSilver.current = silverPrice;

    const now = Date.now();
    historyRef.current.gold.push({ time: now, price: goldPrice });
    historyRef.current.silver.push({ time: now, price: silverPrice });

    // Keep last 50 data points
    if (historyRef.current.gold.length > 50) historyRef.current.gold.shift();
    if (historyRef.current.silver.length > 50) historyRef.current.silver.shift();

    setPrices({
      gold: goldPrice,
      silver: silverPrice,
      usdToKwd: kwdRateRef.current,
      goldDirection: goldDir,
      silverDirection: silverDir,
      goldHistory: [...historyRef.current.gold],
      silverHistory: [...historyRef.current.silver],
      lastUpdated: new Date(),
      isLive: live,
    });
  }

  useEffect(() => {
    // Initial fetch
    fetchExchangeRate();
    fetchMetals();

    // Metals every 5 seconds
    const metalsInterval = setInterval(fetchMetals, 5000);

    // Exchange rate every 60 minutes
    const exchangeInterval = setInterval(fetchExchangeRate, 60 * 60 * 1000);

    return () => {
      clearInterval(metalsInterval);
      clearInterval(exchangeInterval);
    };
  }, [fetchMetals, fetchExchangeRate]);

  return prices;
}
