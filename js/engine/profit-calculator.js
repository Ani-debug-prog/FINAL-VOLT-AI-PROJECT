// profit-calculator.js - Detailed Cost of Cultivation & ROI Calculator
class ProfitCalculator {
  /**
   * Break down cultivation costs and revenue for a given crop and land area
   */
  static calculateBreakdown(crop, landSizeAcres = 1, spotPriceOverride = null) {
    const spotPrice = spotPriceOverride || crop.mandiPriceQuintal;
    const baseCost = crop.costPerAcre * landSizeAcres;

    // Detailed operational itemization
    const breakdown = {
      seedCost: Math.round(baseCost * 0.15),
      fertilizerManureCost: Math.round(baseCost * 0.25),
      plantProtectionCost: Math.round(baseCost * 0.12),
      irrigationPowerCost: Math.round(baseCost * 0.13),
      laborMachineryCost: Math.round(baseCost * 0.28),
      postHarvestTransportCost: Math.round(baseCost * 0.07),
      totalCost: baseCost,
      totalYieldQuintals: Math.round(crop.avgYieldPerAcre * landSizeAcres * 10) / 10,
      grossRevenue: Math.round(crop.avgYieldPerAcre * landSizeAcres * spotPrice),
      netProfit: Math.round((crop.avgYieldPerAcre * landSizeAcres * spotPrice) - baseCost),
      breakEvenPricePerQuintal: Math.round(baseCost / (crop.avgYieldPerAcre * landSizeAcres)),
      breakEvenYieldQuintals: Math.round((baseCost / spotPrice) * 10) / 10,
      roiPercentage: Math.round((((crop.avgYieldPerAcre * landSizeAcres * spotPrice) - baseCost) / baseCost) * 100)
    };

    return breakdown;
  }
}

window.ProfitCalculator = ProfitCalculator;
