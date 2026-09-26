// app.js - Main Application Orchestrator with Live Python ML Backend Integration
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Services & State
  const clientRecommender = new CropRecommender();
  const voice = new VoiceService();
  
  const BACKEND_URL = "http://127.0.0.1:8000";
  let isBackendConnected = false;

  let currentRecs = [];
  let comparisonIds = [];
  let charts = {
    profitComparison: null,
    mandiTrends: null,
    soilRadar: null,
    modalBreakdown: null
  };

  // DOM Elements Cache
  const stateSelect = document.getElementById('stateSelect');
  const districtSelect = document.getElementById('districtSelect');
  const soilTypeSelect = document.getElementById('soilTypeSelect');
  const irrigationSelect = document.getElementById('irrigationSelect');
  const seasonSelect = document.getElementById('seasonSelect');
  const landSizeInput = document.getElementById('landSizeInput');
  const landSizeVal = document.getElementById('landSizeVal');
  const nSlider = document.getElementById('nSlider');
  const nVal = document.getElementById('nVal');
  const pSlider = document.getElementById('pSlider');
  const pVal = document.getElementById('pVal');
  const kSlider = document.getElementById('kSlider');
  const kVal = document.getElementById('kVal');
  const phSlider = document.getElementById('phSlider');
  const phVal = document.getElementById('phVal');
  const phBadge = document.getElementById('phBadge');
  const tempInput = document.getElementById('tempInput');
  const rainfallInput = document.getElementById('rainfallInput');
  const runAiBtn = document.getElementById('runAiBtn');
  const loadPresetBtn = document.getElementById('loadPresetBtn');
  const recsContainer = document.getElementById('recsContainer');
  const weatherStrip = document.getElementById('weatherStrip');
  const weatherAdvisory = document.getElementById('weatherAdvisory');
  const compareModal = document.getElementById('compareModal');
  const detailModal = document.getElementById('detailModal');
  const langSelect = document.getElementById('langSelect');
  const globalVoiceBtn = document.getElementById('globalVoiceBtn');
  const voiceMicBtn = document.getElementById('voiceMicBtn');
  const modeFarmerBtn = document.getElementById('modeFarmerBtn');
  const modeOfficerBtn = document.getElementById('modeOfficerBtn');
  const farmerView = document.getElementById('farmerView');
  const officerView = document.getElementById('officerView');
  const harvestLogView = document.getElementById('harvestLogView');
  const navHarvestBtn = document.getElementById('navHarvestBtn');
  const backendStatusBadge = document.getElementById('backendStatusBadge');

  // --- INITIALIZATION ---
  initStatesAndDistricts();
  loadSavedProfile();
  setupEventListeners();
  updatePhClassification(parseFloat(phSlider.value));
  checkBackendHealth();
  refreshRecommendations();
  renderHarvestLogs();
  renderOfficerFarmers();

  // --- BACKEND HEALTH & INTEGRATION ---
  async function checkBackendHealth() {
    try {
      const res = await fetch(`${BACKEND_URL}/api/health`, { method: 'GET', mode: 'cors', cache: 'no-cache' });
      if (res.ok) {
        const data = await res.json();
        isBackendConnected = true;
        updateBackendBadge(true, data.ml_model || "Random Forest");
      } else {
        isBackendConnected = false;
        updateBackendBadge(false);
      }
    } catch (e) {
      isBackendConnected = false;
      updateBackendBadge(false);
    }
  }

  function updateBackendBadge(connected, modelName = "") {
    if (!backendStatusBadge) return;
    if (connected) {
      backendStatusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> 🟢 Python ML API Connected (:8000)`;
      backendStatusBadge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-900/80 text-emerald-200 border border-emerald-500 shadow-sm";
    } else {
      backendStatusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400"></span> 🟡 Client ML Engine (Offline Ready)`;
      backendStatusBadge.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-amber-300 border border-slate-700 shadow-sm";
    }
  }

  function initStatesAndDistricts() {
    const states = window.REGIONAL_DEFAULTS || {};
    stateSelect.innerHTML = '';
    
    for (const [key, stateObj] of Object.entries(states)) {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = stateObj.name;
      stateSelect.appendChild(opt);
    }

    stateSelect.value = "maharashtra";
    updateDistricts();
  }

  function updateDistricts() {
    const stateKey = stateSelect.value;
    const stateObj = window.REGIONAL_DEFAULTS[stateKey];
    districtSelect.innerHTML = '';

    if (stateObj && stateObj.districts) {
      for (const [dKey, dist] of Object.entries(stateObj.districts)) {
        const opt = document.createElement('option');
        opt.value = dKey;
        opt.textContent = dist.name;
        districtSelect.appendChild(opt);
      }
    }
  }

  function applyRegionalDefaults() {
    const stateKey = stateSelect.value;
    const distKey = districtSelect.value;
    const dist = window.REGIONAL_DEFAULTS[stateKey]?.districts[distKey];

    if (!dist) return;

    // Apply values
    nSlider.value = dist.npk.n;
    nVal.textContent = dist.npk.n;
    pSlider.value = dist.npk.p;
    pVal.textContent = dist.npk.p;
    kSlider.value = dist.npk.k;
    kVal.textContent = dist.npk.k;
    phSlider.value = dist.ph;
    phVal.textContent = dist.ph;
    tempInput.value = dist.avgTemp;
    rainfallInput.value = dist.rainfall;
    soilTypeSelect.value = dist.soilType;
    irrigationSelect.value = dist.irrigationSource;
    seasonSelect.value = dist.season;

    updatePhClassification(dist.ph);
    showToast(`Loaded regional agro-climatic defaults for ${dist.name}`, "success");
    refreshRecommendations();
  }

  function updatePhClassification(ph) {
    phVal.textContent = ph;
    if (ph < 6.0) {
      phBadge.textContent = "Acidic Soil";
      phBadge.className = "px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300";
    } else if (ph <= 7.5) {
      phBadge.textContent = "Optimal Neutral";
      phBadge.className = "px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300";
    } else {
      phBadge.textContent = "Alkaline Soil";
      phBadge.className = "px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-300";
    }
  }

  function getFormInputs() {
    return {
      farmer_name: document.getElementById('farmerNameInput')?.value || "Ramesh Patil",
      farmerName: document.getElementById('farmerNameInput')?.value || "Ramesh Patil",
      state: stateSelect.value,
      district: districtSelect.value,
      land_size: parseFloat(landSizeInput.value) || 1,
      landSize: parseFloat(landSizeInput.value) || 1,
      soil_type: soilTypeSelect.value,
      soilType: soilTypeSelect.value,
      irrigation: irrigationSelect.value,
      season: seasonSelect.value,
      n: parseInt(nSlider.value),
      p: parseInt(pSlider.value),
      k: parseInt(kSlider.value),
      ph: parseFloat(phSlider.value),
      temp: parseFloat(tempInput.value) || 28,
      rainfall: parseFloat(rainfallInput.value) || 750,
      language: I18N.currentLang || 'en'
    };
  }

  async function refreshRecommendations() {
    const input = getFormInputs();
    StorageService.saveFarmerProfile(input);

    // If Python backend is connected, use REST API with client fallback
    if (isBackendConnected) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/recommend`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input)
        });

        if (response.ok) {
          const apiData = await response.json();
          currentRecs = apiData.recommendations.map(r => ({
            crop: {
              id: r.crop_id,
              name: r.crop_name,
              localNames: { [I18N.currentLang]: r.local_name },
              category: r.category,
              icon: r.icon,
              durationDays: r.duration_days,
              waterRequirement: r.water_requirement,
              riskLevel: r.risk_level,
              costPerAcre: r.economics.cost_per_acre,
              avgYieldPerAcre: r.economics.yield_per_acre,
              mandiPriceQuintal: r.economics.spot_price,
              fertilizerSchedule: r.fertilizer.schedule,
              description: `Optimal fit for ${input.soil_type} in ${input.season} season.`
            },
            confidenceScore: r.confidence_score,
            scores: r.scores,
            economics: {
              yieldPerAcre: r.economics.yield_per_acre,
              totalYield: r.economics.total_yield,
              spotPrice: r.economics.spot_price,
              priceTrend: r.economics.price_trend,
              priceChange: r.economics.price_change,
              grossRevenuePerAcre: r.economics.gross_revenue,
              costPerAcre: r.economics.cost_per_acre,
              netProfitPerAcre: r.economics.net_profit_per_acre,
              totalNetProfit: r.economics.total_net_profit,
              roiPercentage: r.economics.roi_percentage
            },
            fertilizerAdvisory: {
              nDeficit: r.fertilizer.n_deficit,
              pDeficit: r.fertilizer.p_deficit,
              kDeficit: r.fertilizer.k_deficit,
              ureaBags: r.fertilizer.urea_bags,
              dapBags: r.fertilizer.dap_bags,
              mopBags: r.fertilizer.mop_bags,
              schedule: r.fertilizer.schedule
            },
            backendReasons: r.reasons,
            speechSummary: r.speech_summary
          }));
        } else {
          currentRecs = clientRecommender.recommend(input);
        }
      } catch (e) {
        console.warn("Backend call failed, using client recommender:", e);
        currentRecs = clientRecommender.recommend(input);
      }
    } else {
      currentRecs = clientRecommender.recommend(input);
    }

    renderWeather(input.district, input.temp, input.rainfall);
    renderCropCards(currentRecs, input);
    renderProfitChart(currentRecs);
    renderMandiTrends(currentRecs[0]?.crop.id || 'rice');
  }

  async function renderWeather(districtKey, temp, rain) {
    let forecast = null;
    if (isBackendConnected) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/weather/forecast?district=${districtKey}&temp=${temp}&rainfall=${rain}`);
        if (res.ok) {
          const wData = await res.json();
          forecast = {
            advisory: wData.advisory,
            days: wData.forecast.map(d => ({
              weekday: d.weekday,
              dateString: d.date_string,
              icon: d.icon,
              maxTemp: d.max_temp,
              minTemp: d.min_temp,
              rainProbability: d.rain_probability
            }))
          };
        }
      } catch (e) {
        forecast = WeatherService.getForecast(districtKey, temp, rain);
      }
    }

    if (!forecast) {
      forecast = WeatherService.getForecast(districtKey, temp, rain);
    }

    weatherAdvisory.textContent = forecast.advisory;
    weatherStrip.innerHTML = '';
    forecast.days.slice(0, 7).forEach(day => {
      const card = document.createElement('div');
      card.className = "flex-shrink-0 bg-white/90 rounded-xl p-2.5 text-center border border-slate-200 shadow-sm w-24";
      card.innerHTML = `
        <div class="text-xs font-semibold text-slate-500">${day.weekday}</div>
        <div class="text-xs text-slate-400 mb-1">${day.dateString}</div>
        <div class="text-2xl my-1">${day.icon}</div>
        <div class="text-sm font-bold text-slate-800">${day.maxTemp}° <span class="text-xs font-normal text-slate-400">${day.minTemp}°</span></div>
        <div class="text-[10px] text-blue-600 font-medium mt-1">💧 ${day.rainProbability}%</div>
      `;
      weatherStrip.appendChild(card);
    });
  }

  function renderCropCards(recs, input) {
    recsContainer.innerHTML = '';

    if (recs.length === 0) {
      recsContainer.innerHTML = `
        <div class="col-span-full text-center p-8 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800">
          <p class="font-bold text-lg">No exact crop match found for these extreme constraints.</p>
          <p class="text-sm mt-1">Try adjusting pH or water availability parameters.</p>
        </div>
      `;
      return;
    }

    recs.forEach((item, index) => {
      const { crop, confidenceScore, scores, economics } = item;
      const lang = I18N.currentLang;
      const localName = crop.localNames?.[lang] || crop.name;
      const reasons = item.backendReasons || ExplainabilityEngine.explain(item, input, lang);
      const isTop = index === 0;

      const card = document.createElement('div');
      card.className = `crop-card bg-white rounded-2xl p-5 border ${isTop ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg' : 'border-slate-200 shadow-sm'} flex flex-col justify-between`;

      card.innerHTML = `
        <div>
          <!-- Header -->
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl">
                ${crop.icon}
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-bold text-lg text-slate-800">${crop.name}</h3>
                  ${isTop ? '<span class="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-600 text-white uppercase tracking-wider">Top Match</span>' : ''}
                </div>
                <div class="text-xs font-semibold text-emerald-700">${localName} • <span class="text-slate-500 font-normal">${crop.category}</span></div>
              </div>
            </div>
            <div class="text-right">
              <div class="confidence-badge px-2.5 py-1 rounded-xl font-extrabold text-sm flex items-center gap-1">
                <span>⭐</span> ${confidenceScore}%
              </div>
              <div class="text-[10px] text-slate-400 font-medium mt-0.5">Match Confidence</div>
            </div>
          </div>

          <!-- Quick Metrics Grid -->
          <div class="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl my-3 text-center border border-slate-100">
            <div>
              <div class="text-[11px] text-slate-500 font-medium">Est. Yield / Acre</div>
              <div class="text-sm font-bold text-slate-800">${economics.yieldPerAcre} Qtl</div>
            </div>
            <div>
              <div class="text-[11px] text-slate-500 font-medium">Est. Net Profit</div>
              <div class="text-sm font-bold text-emerald-600">₹${economics.netProfitPerAcre.toLocaleString('en-IN')}</div>
            </div>
            <div>
              <div class="text-[11px] text-slate-500 font-medium">Mandi Price</div>
              <div class="text-sm font-bold text-slate-800 flex items-center justify-center gap-1">
                ₹${economics.spotPrice}
                <span class="text-[10px] ${economics.priceTrend === 'up' ? 'text-emerald-500' : 'text-slate-400'}">
                  ${economics.priceTrend === 'up' ? '▲' : '●'}
                </span>
              </div>
            </div>
          </div>

          <!-- Suitability Breakdown Bars -->
          <div class="space-y-1.5 text-xs my-3">
            <div class="flex justify-between text-slate-600">
              <span>Soil Match</span>
              <span class="font-bold">${scores.soil}%</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div class="bg-emerald-500 h-1.5 rounded-full" style="width: ${scores.soil}%"></div>
            </div>
            <div class="flex justify-between text-slate-600">
              <span>Climate & Water</span>
              <span class="font-bold">${scores.climate}%</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div class="bg-blue-500 h-1.5 rounded-full" style="width: ${scores.climate}%"></div>
            </div>
          </div>

          <!-- Explainable AI Bullets -->
          <div class="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 my-3 text-xs text-slate-700 space-y-1.5">
            <div class="font-bold text-emerald-900 flex items-center gap-1.5">
              <span>💡</span> Why Recommended:
            </div>
            ${reasons.slice(0, 2).map(r => `<div class="leading-relaxed">${r}</div>`).join('')}
          </div>
        </div>

        <!-- Action Footer -->
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
          <button class="voice-crop-btn p-2 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 transition flex items-center gap-1.5 text-xs font-semibold" title="Listen Audio Advisory">
            <span>🔊</span> Listen
          </button>
          <div class="flex items-center gap-2">
            <label class="flex items-center gap-1 text-xs text-slate-600 cursor-pointer select-none">
              <input type="checkbox" class="compare-checkbox rounded text-emerald-600" data-crop-id="${crop.id}" ${comparisonIds.includes(crop.id) ? 'checked' : ''}>
              <span>Compare</span>
            </label>
            <button class="view-detail-btn px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-sm">
              Full Advisory →
            </button>
          </div>
        </div>
      `;

      // Event bindings for card buttons
      const voiceBtn = card.querySelector('.voice-crop-btn');
      voiceBtn.addEventListener('click', () => {
        const speechText = item.speechSummary || ExplainabilityEngine.getSpeechSummary(item, input, I18N.currentLang);
        voice.speak(speechText, I18N.currentLang);
      });

      const detailBtn = card.querySelector('.view-detail-btn');
      detailBtn.addEventListener('click', () => {
        openCropDetailModal(item, input);
      });

      const compareCb = card.querySelector('.compare-checkbox');
      compareCb.addEventListener('change', (e) => {
        if (e.target.checked) {
          if (!comparisonIds.includes(crop.id)) comparisonIds.push(crop.id);
        } else {
          comparisonIds = comparisonIds.filter(id => id !== crop.id);
        }
        updateCompareButton();
      });

      recsContainer.appendChild(card);
    });
  }

  function updateCompareButton() {
    const btn = document.getElementById('openCompareBtn');
    if (btn) {
      btn.textContent = `📊 Compare Selected (${comparisonIds.length})`;
      btn.className = comparisonIds.length >= 2 
        ? "px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition animate-pulse"
        : "px-4 py-2 rounded-xl bg-slate-200 text-slate-500 font-bold text-sm transition";
    }
  }

  function renderProfitChart(recs) {
    const ctx = document.getElementById('profitChart')?.getContext('2d');
    if (!ctx) return;

    if (charts.profitComparison) {
      charts.profitComparison.destroy();
    }

    const labels = recs.map(r => r.crop.name);
    const profits = recs.map(r => r.economics.netProfitPerAcre);
    const costs = recs.map(r => r.crop.costPerAcre);

    charts.profitComparison = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Net Profit (₹/Acre)',
            data: profits,
            backgroundColor: '#16a34a',
            borderRadius: 6
          },
          {
            label: 'Cultivation Cost (₹/Acre)',
            data: costs,
            backgroundColor: '#cbd5e1',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: (context) => ` ₹${context.raw.toLocaleString('en-IN')}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (val) => `₹${val / 1000}k`
            }
          }
        }
      }
    });
  }

  function renderMandiTrends(cropId) {
    const ctx = document.getElementById('mandiChart')?.getContext('2d');
    if (!ctx) return;

    const mandiInfo = window.MANDI_DATA?.crops[cropId] || window.MANDI_DATA?.crops['rice'];
    const monthLabels = window.MANDI_DATA?.monthLabels || ["M1", "M2", "M3", "M4", "M5", "M6"];

    if (charts.mandiTrends) {
      charts.mandiTrends.destroy();
    }

    charts.mandiTrends = new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [{
          label: `${cropId.toUpperCase()} Market Rate (₹/Qtl)`,
          data: mandiInfo.historicalMonthly,
          borderColor: '#15803d',
          backgroundColor: 'rgba(22, 163, 74, 0.1)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: '#16a34a'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: (val) => `₹${val}`
            }
          }
        }
      }
    });

    // Populate Mandi Table
    const tableBody = document.getElementById('mandiTableBody');
    if (tableBody && mandiInfo.topMandis) {
      tableBody.innerHTML = mandiInfo.topMandis.map(m => `
        <tr class="border-b border-slate-100 hover:bg-slate-50/80">
          <td class="py-2 px-3 text-slate-800 font-medium">${m.name}</td>
          <td class="py-2 px-3 text-right font-bold text-emerald-700">₹${m.price}</td>
          <td class="py-2 px-3 text-right text-slate-500">${m.volumeTons} Tons</td>
        </tr>
      `).join('');
    }
  }

  function openCropDetailModal(item, input) {
    const { crop, confidenceScore, economics, fertilizerAdvisory } = item;
    const breakdown = ProfitCalculator.calculateBreakdown(crop, input.landSize);

    document.getElementById('modalCropTitle').innerHTML = `${crop.icon} ${crop.name} <span class="text-sm font-normal text-slate-500">(${crop.localNames[I18N.currentLang] || ''})</span>`;
    document.getElementById('modalCropCategory').textContent = `${crop.category} • ${crop.durationDays} Days Duration • ${crop.riskLevel} Risk`;
    document.getElementById('modalCropDesc').textContent = crop.description;

    // Advisory table
    document.getElementById('modalFertilizerSchedule').textContent = fertilizerAdvisory.schedule;
    document.getElementById('modalUreaBags').textContent = `${fertilizerAdvisory.ureaBags} Bags (45kg)`;
    document.getElementById('modalDapBags').textContent = `${fertilizerAdvisory.dapBags} Bags (50kg)`;
    document.getElementById('modalMopBags').textContent = `${fertilizerAdvisory.mopBags} Bags (50kg)`;

    // Economics breakdown
    document.getElementById('modalGrossRevenue').textContent = `₹${breakdown.grossRevenue.toLocaleString('en-IN')}`;
    document.getElementById('modalTotalCost').textContent = `₹${breakdown.totalCost.toLocaleString('en-IN')}`;
    document.getElementById('modalNetProfit').textContent = `₹${breakdown.netProfit.toLocaleString('en-IN')}`;
    document.getElementById('modalRoi').textContent = `${breakdown.roiPercentage}%`;
    document.getElementById('modalBreakEven').textContent = `₹${breakdown.breakEvenPricePerQuintal}/Qtl`;

    detailModal.classList.remove('hidden');
  }

  function openCompareModal() {
    if (comparisonIds.length < 2) {
      showToast("Please select at least 2 crops to compare using the checkboxes.", "info");
      return;
    }

    const comparedCrops = currentRecs.filter(r => comparisonIds.includes(r.crop.id));
    const container = document.getElementById('compareContent');

    let html = `
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="bg-slate-100 text-slate-700">
              <th class="p-3 font-bold border">Parameter</th>
              ${comparedCrops.map(c => `<th class="p-3 font-bold text-center border text-emerald-800 bg-emerald-50/50">${c.crop.icon} ${c.crop.name}</th>`).join('')}
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr>
              <td class="p-3 font-semibold bg-slate-50 border">Match Confidence</td>
              ${comparedCrops.map(c => `<td class="p-3 text-center font-extrabold text-emerald-600 border">${c.confidenceScore}%</td>`).join('')}
            </tr>
            <tr>
              <td class="p-3 font-semibold bg-slate-50 border">Expected Net Profit</td>
              ${comparedCrops.map(c => `<td class="p-3 text-center font-bold text-emerald-700 border">₹${c.economics.netProfitPerAcre.toLocaleString('en-IN')}</td>`).join('')}
            </tr>
            <tr>
              <td class="p-3 font-semibold bg-slate-50 border">Yield Per Acre</td>
              ${comparedCrops.map(c => `<td class="p-3 text-center font-medium border">${c.economics.yieldPerAcre} Quintals</td>`).join('')}
            </tr>
            <tr>
              <td class="p-3 font-semibold bg-slate-50 border">Water Requirement</td>
              ${comparedCrops.map(c => `<td class="p-3 text-center font-medium border">${c.crop.waterRequirement}</td>`).join('')}
            </tr>
            <tr>
              <td class="p-3 font-semibold bg-slate-50 border">Crop Duration</td>
              ${comparedCrops.map(c => `<td class="p-3 text-center font-medium border">${c.crop.durationDays} Days</td>`).join('')}
            </tr>
            <tr>
              <td class="p-3 font-semibold bg-slate-50 border">Investment Cost</td>
              ${comparedCrops.map(c => `<td class="p-3 text-center font-medium border">₹${c.crop.costPerAcre.toLocaleString('en-IN')}</td>`).join('')}
            </tr>
            <tr>
              <td class="p-3 font-semibold bg-slate-50 border">Risk Level</td>
              ${comparedCrops.map(c => `<td class="p-3 text-center font-medium border">${c.crop.riskLevel}</td>`).join('')}
            </tr>
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML = html;
    compareModal.classList.remove('hidden');
  }

  async function renderHarvestLogs() {
    let logs = [];
    if (isBackendConnected) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/feedback/logs`);
        if (res.ok) {
          const data = await res.json();
          logs = data.logs.map(l => ({
            id: l.id,
            cropName: l.crop_name,
            season: l.season,
            actualYieldPerAcre: l.actual_yield_per_acre,
            profitMade: l.profit_made,
            satisfaction: l.satisfaction,
            notes: l.notes
          }));
        }
      } catch (e) {
        logs = StorageService.getHarvestLogs();
      }
    }
    if (logs.length === 0) {
      logs = StorageService.getHarvestLogs();
    }

    const container = document.getElementById('harvestLogContainer');
    if (!container) return;

    if (logs.length === 0) {
      container.innerHTML = `<div class="p-4 text-center text-slate-400 text-sm">No harvest outcomes logged yet.</div>`;
      return;
    }

    container.innerHTML = logs.map(l => `
      <div class="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <div class="font-bold text-slate-800">${l.cropName} • <span class="text-xs font-semibold text-emerald-600">${l.season}</span></div>
          <div class="text-xs text-slate-500 mt-0.5">Yield: ${l.actualYieldPerAcre} Qtl/Acre • Profit: ₹${(l.profitMade || 0).toLocaleString('en-IN')}</div>
          ${l.notes ? `<div class="text-xs italic text-slate-400 mt-1">"${l.notes}"</div>` : ''}
        </div>
        <div class="text-right">
          <div class="text-sm font-bold text-amber-500">${'★'.repeat(l.satisfaction || 5)}</div>
          <div class="text-[10px] text-slate-400 mt-1">Model Calibrated ✓</div>
        </div>
      </div>
    `).join('');
  }

  async function renderOfficerFarmers() {
    let farmers = [];
    if (isBackendConnected) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/officer/farmers`);
        if (res.ok) {
          const data = await res.json();
          farmers = data.farmers.map(f => ({
            id: f.id,
            name: f.name,
            village: f.village,
            acres: f.acres,
            soil: f.soil_type,
            crop: f.recommended_crop,
            status: f.status
          }));
        }
      } catch (e) {
        farmers = StorageService.getOfficerFarmers();
      }
    }
    if (farmers.length === 0) {
      farmers = StorageService.getOfficerFarmers();
    }

    const container = document.getElementById('officerFarmerTable');
    if (!container) return;

    container.innerHTML = farmers.map(f => `
      <tr class="border-b border-slate-100 hover:bg-slate-50">
        <td class="py-3 px-4 font-bold text-slate-800">${f.name}</td>
        <td class="py-3 px-4 text-slate-600">${f.village}</td>
        <td class="py-3 px-4 text-slate-600">${f.acres} Acres</td>
        <td class="py-3 px-4 text-slate-600">${f.soil}</td>
        <td class="py-3 px-4 font-semibold text-emerald-700">${f.crop}</td>
        <td class="py-3 px-4">
          <span class="px-2 py-0.5 rounded-full text-xs font-semibold ${f.status === 'Recommended' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
            ${f.status}
          </span>
        </td>
      </tr>
    `).join('');
  }

  function loadSavedProfile() {
    const p = StorageService.getFarmerProfile();
    if (!p) return;

    if (document.getElementById('farmerNameInput')) document.getElementById('farmerNameInput').value = p.farmerName || "Ramesh Patil";
    stateSelect.value = p.state || "maharashtra";
    updateDistricts();
    districtSelect.value = p.district || "nagpur";
    landSizeInput.value = p.landSize || 3.5;
    landSizeVal.textContent = p.landSize || 3.5;
    soilTypeSelect.value = p.soilType || "Black Soil";
    irrigationSelect.value = p.irrigation || "Borewell / Canal";
    seasonSelect.value = p.season || "Kharif";
    nSlider.value = p.n || 75;
    nVal.textContent = p.n || 75;
    pSlider.value = p.p || 45;
    pVal.textContent = p.p || 45;
    kSlider.value = p.k || 55;
    kVal.textContent = p.k || 55;
    phSlider.value = p.ph || 7.4;
    phVal.textContent = p.ph || 7.4;
  }

  function setupEventListeners() {
    stateSelect.addEventListener('change', () => {
      updateDistricts();
      applyRegionalDefaults();
    });

    districtSelect.addEventListener('change', applyRegionalDefaults);
    loadPresetBtn.addEventListener('click', applyRegionalDefaults);
    runAiBtn.addEventListener('click', () => {
      refreshRecommendations();
      showToast("AI Recommendations Updated Successfully!", "success");
    });

    // Slider Listeners
    nSlider.addEventListener('input', (e) => nVal.textContent = e.target.value);
    pSlider.addEventListener('input', (e) => pVal.textContent = e.target.value);
    kSlider.addEventListener('input', (e) => kVal.textContent = e.target.value);
    landSizeInput.addEventListener('input', (e) => landSizeVal.textContent = e.target.value);
    phSlider.addEventListener('input', (e) => updatePhClassification(parseFloat(e.target.value)));

    // Language switcher
    langSelect.addEventListener('change', (e) => {
      I18N.setLang(e.target.value);
      refreshRecommendations();
      showToast(`Language changed to ${e.target.options[e.target.selectedIndex].text}`, "info");
    });

    // Voice Assistant global button
    globalVoiceBtn.addEventListener('click', () => {
      if (voice.isSpeaking) {
        voice.stop();
        return;
      }
      if (currentRecs.length > 0) {
        const input = getFormInputs();
        const topSpeech = currentRecs[0].speechSummary || ExplainabilityEngine.getSpeechSummary(currentRecs[0], input, I18N.currentLang);
        voice.speak(topSpeech, I18N.currentLang);
      }
    });

    voice.onStateChange = (isSpeaking) => {
      const icon = globalVoiceBtn.querySelector('.voice-icon');
      const text = globalVoiceBtn.querySelector('.voice-text');
      if (isSpeaking) {
        if (icon) icon.innerHTML = `<div class="speaking-wave"><span></span><span></span><span></span><span></span></div>`;
        if (text) text.textContent = "Speaking...";
        globalVoiceBtn.classList.add('bg-emerald-800');
      } else {
        if (icon) icon.textContent = "🔊";
        if (text) text.textContent = "Voice Assistant";
        globalVoiceBtn.classList.remove('bg-emerald-800');
      }
    };

    // Voice Mic search
    if (voiceMicBtn) {
      voiceMicBtn.addEventListener('click', () => {
        showToast("Listening... please speak your query", "info");
        voice.listen(I18N.currentLang, (transcript) => {
          showToast(`Voice received: "${transcript}"`, "success");
        });
      });
    }

    // Compare modal buttons
    document.getElementById('openCompareBtn')?.addEventListener('click', openCompareModal);
    document.getElementById('closeCompareModal')?.addEventListener('click', () => compareModal.classList.add('hidden'));
    document.getElementById('closeDetailModal')?.addEventListener('click', () => detailModal.classList.add('hidden'));

    // Navigation / Mode Switcher
    modeFarmerBtn.addEventListener('click', () => {
      farmerView.classList.remove('hidden');
      officerView.classList.add('hidden');
      harvestLogView.classList.add('hidden');
      modeFarmerBtn.className = "px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-sm shadow";
      modeOfficerBtn.className = "px-4 py-2 rounded-xl bg-white text-slate-700 font-bold text-sm border hover:bg-slate-50";
      navHarvestBtn.className = "px-4 py-2 rounded-xl bg-white text-slate-700 font-bold text-sm border hover:bg-slate-50";
    });

    modeOfficerBtn.addEventListener('click', () => {
      farmerView.classList.add('hidden');
      officerView.classList.remove('hidden');
      harvestLogView.classList.add('hidden');
      modeOfficerBtn.className = "px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-sm shadow";
      modeFarmerBtn.className = "px-4 py-2 rounded-xl bg-white text-slate-700 font-bold text-sm border hover:bg-slate-50";
      navHarvestBtn.className = "px-4 py-2 rounded-xl bg-white text-slate-700 font-bold text-sm border hover:bg-slate-50";
      renderOfficerFarmers();
    });

    navHarvestBtn.addEventListener('click', () => {
      farmerView.classList.add('hidden');
      officerView.classList.add('hidden');
      harvestLogView.classList.remove('hidden');
      navHarvestBtn.className = "px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-sm shadow";
      modeFarmerBtn.className = "px-4 py-2 rounded-xl bg-white text-slate-700 font-bold text-sm border hover:bg-slate-50";
      modeOfficerBtn.className = "px-4 py-2 rounded-xl bg-white text-slate-700 font-bold text-sm border hover:bg-slate-50";
      renderHarvestLogs();
    });

    // Add harvest log submission
    document.getElementById('harvestLogForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const cropName = document.getElementById('logCropName').value;
      const season = document.getElementById('logSeason').value;
      const actualYield = parseFloat(document.getElementById('logYield').value);
      const profit = parseFloat(document.getElementById('logProfit').value);
      const notes = document.getElementById('logNotes').value;

      if (isBackendConnected) {
        try {
          await fetch(`${BACKEND_URL}/api/feedback/harvest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              crop_name: cropName,
              season: season,
              actual_yield_per_acre: actualYield,
              profit_made: profit,
              satisfaction: 5,
              notes: notes,
              farmer_name: document.getElementById('farmerNameInput')?.value || "Farmer",
              district: districtSelect.value
            })
          });
        } catch (err) {
          console.warn("Backend harvest logging fallback:", err);
        }
      }

      StorageService.addHarvestLog({
        cropName,
        season,
        actualYieldPerAcre: actualYield,
        profitMade: profit,
        satisfaction: 5,
        notes
      });

      renderHarvestLogs();
      showToast("Harvest outcome logged! AI Model calibrated with actual yield data.", "success");
      e.target.reset();
    });

    // Export officer report CSV
    document.getElementById('exportCsvBtn')?.addEventListener('click', () => {
      const farmers = StorageService.getOfficerFarmers();
      let csv = "ID,Name,Village,Acres,Soil,Recommended Crop,Status\n";
      farmers.forEach(f => {
        csv += `${f.id},"${f.name}","${f.village}",${f.acres},"${f.soil}","${f.crop}","${f.status}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VoltAI_Extension_Report_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
    });
  }

  function showToast(message, type = "info") {
    const toast = document.createElement('div');
    const bg = type === 'success' ? 'bg-emerald-700' : (type === 'info' ? 'bg-slate-800' : 'bg-amber-600');
    toast.className = `fixed bottom-5 right-5 z-50 text-white px-4 py-3 rounded-2xl shadow-xl font-medium text-sm flex items-center gap-2 ${bg} animate-bounce`;
    toast.innerHTML = `<span>${type === 'success' ? '✅' : 'ℹ️'}</span> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }
});
