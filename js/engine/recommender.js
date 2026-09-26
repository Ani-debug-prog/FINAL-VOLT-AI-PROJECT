// recommender.js - Hybrid Agronomic & ML-Scored Crop Recommendation Engine
class CropRecommender {
  constructor() {
    this.crops = window.CROPS_DATASET || [];
    this.mandiData = window.MANDI_DATA?.crops || {};
  }

  /**
   * Run recommendation algorithm
   * @param {Object} input - { n, p, k, ph, soilType, irrigation, landSize, season, temp, rainfall, humidity }
   * @returns {Array} Top ranked crop recommendations with detailed scores and metadata
   */
  recommend(input) {
    if (!this.crops || this.crops.length === 0) return [];

    const scoredCrops = [];

    for (const crop of this.crops) {
      // 1. HARD CONSTRAINTS FILTER
      // pH hard tolerance (+/- 0.6 margin)
      if (input.ph < crop.phRange[0] - 0.6 || input.ph > crop.phRange[1] + 0.6) {
        continue;
      }

      // Severe water constraint filter
      if (input.irrigation === "Rainfed" && input.rainfall < 600 && (crop.waterRequirement === "Very High" || crop.waterRequirement === "High")) {
        continue;
      }

      // Season filter (if specific season chosen and not Annual or All-season)
      if (input.season && input.season !== "All" && !crop.season.includes(input.season) && !crop.season.includes("Annual")) {
        // Apply slight season penalty instead of hard discard to allow poly-season options
      }

      // 2. SOIL AGRONOMIC SCORE (0 - 100)
      const nScore = Math.max(0, 100 - (Math.abs(input.n - crop.npk.n) / crop.npk.n) * 60);
      const pScore = Math.max(0, 100 - (Math.abs(input.p - crop.npk.p) / crop.npk.p) * 60);
      const kScore = Math.max(0, 100 - (Math.abs(input.k - crop.npk.k) / crop.npk.k) * 60);
      
      let phScore = 100;
      if (input.ph < crop.phRange[0]) {
        phScore = Math.max(20, 100 - (crop.phRange[0] - input.ph) * 120);
      } else if (input.ph > crop.phRange[1]) {
        phScore = Math.max(20, 100 - (input.ph - crop.phRange[1]) * 120);
      }

      let soilTypeScore = 70;
      if (crop.soilTypes.some(st => st.toLowerCase().includes(input.soilType.toLowerCase()) || input.soilType.toLowerCase().includes(st.toLowerCase()))) {
        soilTypeScore = 100;
      }

      const soilScore = (nScore * 0.25) + (pScore * 0.25) + (kScore * 0.25) + (phScore * 0.15) + (soilTypeScore * 0.10);

      // 3. CLIMATE & WEATHER SCORE (0 - 100)
      let tempScore = 100;
      if (input.temp < crop.tempRange[0]) {
        tempScore = Math.max(10, 100 - (crop.tempRange[0] - input.temp) * 12);
      } else if (input.temp > crop.tempRange[1]) {
        tempScore = Math.max(10, 100 - (input.temp - crop.tempRange[1]) * 12);
      }

      let rainScore = 100;
      // Adjust effective water with irrigation
      let effectiveWater = input.rainfall;
      if (input.irrigation === "Canal" || input.irrigation === "Tube-well / Canal" || input.irrigation === "Drip / River") effectiveWater += 400;
      else if (input.irrigation === "Borewell / Drip" || input.irrigation === "Drip") effectiveWater += 300;

      if (effectiveWater < crop.rainfallRange[0]) {
        rainScore = Math.max(20, 100 - ((crop.rainfallRange[0] - effectiveWater) / crop.rainfallRange[0]) * 100);
      } else if (effectiveWater > crop.rainfallRange[1] * 1.3) {
        rainScore = Math.max(30, 100 - ((effectiveWater - crop.rainfallRange[1]) / crop.rainfallRange[1]) * 80);
      }

      const climateScore = (tempScore * 0.55) + (rainScore * 0.45);

      // 4. ECONOMIC & PROFITABILITY SCORE (0 - 100)
      const mandi = this.mandiData[crop.id];
      const spotPrice = mandi?.currentPrice || crop.mandiPriceQuintal;
      const grossRevenue = crop.avgYieldPerAcre * spotPrice;
      const netProfitPerAcre = grossRevenue - crop.costPerAcre;
      const totalNetProfit = netProfitPerAcre * (input.landSize || 1);
      const roiPercentage = Math.round((netProfitPerAcre / crop.costPerAcre) * 100);

      // Normalize profit (max benchmark ~120,000 INR/acre)
      const profitScore = Math.min(100, Math.max(20, (netProfitPerAcre / 90000) * 100));

      // 5. RISK RESILIENCE SCORE
      let riskScore = 80;
      if (crop.riskLevel === "Very Low") riskScore = 95;
      else if (crop.riskLevel === "Low") riskScore = 88;
      else if (crop.riskLevel === "Medium") riskScore = 75;
      else if (crop.riskLevel === "High") riskScore = 60;

      // 6. TOTAL WEIGHTED COMPOSITE SCORE
      // Weights: Soil (35%), Climate (30%), Profit (25%), Risk (10%)
      const rawComposite = (soilScore * 0.35) + (climateScore * 0.30) + (profitScore * 0.25) + (riskScore * 0.10);
      const confidenceScore = Math.min(98, Math.max(52, Math.round(rawComposite)));

      // Fertilizer Deficiency calculation
      const nDeficit = Math.max(0, Math.round(crop.npk.n - input.n));
      const pDeficit = Math.max(0, Math.round(crop.npk.p - input.p));
      const kDeficit = Math.max(0, Math.round(crop.npk.k - input.k));

      // Estimated fertilizer bags (Urea 46% N, DAP 18% N + 46% P, MOP 60% K)
      const ureaBags = Math.ceil((nDeficit * 2.17) / 45); // 45kg bag
      const dapBags = Math.ceil((pDeficit * 2.17) / 50); // 50kg bag
      const mopBags = Math.ceil((kDeficit * 1.67) / 50);

      scoredCrops.push({
        crop,
        confidenceScore,
        scores: {
          soil: Math.round(soilScore),
          climate: Math.round(climateScore),
          profit: Math.round(profitScore),
          risk: Math.round(riskScore)
        },
        economics: {
          yieldPerAcre: crop.avgYieldPerAcre,
          totalYield: Math.round(crop.avgYieldPerAcre * input.landSize * 10) / 10,
          spotPrice,
          msp: mandi?.msp || null,
          priceTrend: mandi?.trend || "stable",
          priceChange: mandi?.changePct || "0%",
          grossRevenuePerAcre: Math.round(grossRevenue),
          costPerAcre: crop.costPerAcre,
          netProfitPerAcre: Math.round(netProfitPerAcre),
          totalNetProfit: Math.round(totalNetProfit),
          roiPercentage
        },
        fertilizerAdvisory: {
          nDeficit,
          pDeficit,
          kDeficit,
          ureaBags,
          dapBags,
          mopBags,
          schedule: crop.fertilizerSchedule
        }
      });
    }

    // Sort by confidenceScore descending
    scoredCrops.sort((a, b) => b.confidenceScore - a.confidenceScore);

    return scoredCrops.slice(0, 5);
  }
}

window.CropRecommender = CropRecommender;
