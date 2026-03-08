// Pure helper functions for price calculations

/** Convert USD price to KWD */
export function convertToKWD(usdPrice, usdToKwdRate) {
  return usdPrice * usdToKwdRate;
}

/** Convert price-per-troy-ounce to price-per-gram */
export function ouncesToGrams(pricePerOz) {
  const TROY_OZ_IN_GRAMS = 31.1035;
  return pricePerOz / TROY_OZ_IN_GRAMS;
}

/** Apply karat purity factor */
export function applyPurity(price, karat) {
  const purityMap = { 24: 1, 22: 22 / 24, 21: 21 / 24, 18: 18 / 24 };
  return price * (purityMap[karat] || 1);
}

/** Calculate bid/ask from mid price and spread percentage */
export function calcSpread(midPrice, spreadPct = 0.5) {
  const halfSpread = midPrice * (spreadPct / 100);
  return {
    bid: midPrice - halfSpread,
    ask: midPrice + halfSpread,
  };
}

/** Calculate total cost for a given weight, price/gram, and making charge */
export function calcTotalCost(weightGrams, pricePerGram, makingChargePct = 0) {
  const baseCost = weightGrams * pricePerGram;
  return baseCost * (1 + makingChargePct / 100);
}

/** Get price for a specific unit */
export function getPriceForUnit(pricePerOzKWD, unit, karat = 24) {
  if (unit === 'oz') {
    return applyPurity(pricePerOzKWD, karat);
  }
  const grams = parseFloat(unit); // "1", "5", "10", etc.
  const pricePerGram = ouncesToGrams(pricePerOzKWD);
  return applyPurity(pricePerGram * grams, karat);
}
