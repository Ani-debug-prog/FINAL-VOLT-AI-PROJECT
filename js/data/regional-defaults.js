// regional-defaults.js - State & District Agro-Climatic Defaults for India
window.REGIONAL_DEFAULTS = {
  "maharashtra": {
    name: "Maharashtra",
    districts: {
      "nagpur": {
        name: "Nagpur (Vidarbha)",
        soilType: "Black Soil",
        npk: { n: 75, p: 45, k: 55 },
        ph: 7.4,
        organicCarbon: "0.55%",
        climateZone: "Semi-Arid Sub-Tropical",
        season: "Kharif",
        avgTemp: 29,
        tempRange: [22, 36],
        rainfall: 950,
        humidity: 68,
        irrigationSource: "Borewell / Canal",
        typicalCrops: ["Cotton", "Soybean", "Pigeonpeas", "Orange / Citrus", "Wheat"]
      },
      "pune": {
        name: "Pune (Western Maharashtra)",
        soilType: "Clay Loam",
        npk: { n: 90, p: 55, k: 65 },
        ph: 6.8,
        organicCarbon: "0.68%",
        climateZone: "Tropical Wet & Dry",
        season: "Kharif",
        avgTemp: 26,
        tempRange: [18, 32],
        rainfall: 750,
        humidity: 62,
        irrigationSource: "Drip / Canal",
        typicalCrops: ["Sugarcane", "Tomato", "Onion", "Soybean", "Maize"]
      },
      "nashik": {
        name: "Nashik (North Maharashtra)",
        soilType: "Red Loam",
        npk: { n: 85, p: 60, k: 70 },
        ph: 6.7,
        organicCarbon: "0.72%",
        climateZone: "Moderate Tropical",
        season: "Kharif",
        avgTemp: 25,
        tempRange: [16, 31],
        rainfall: 800,
        humidity: 65,
        irrigationSource: "Drip / River",
        typicalCrops: ["Onion", "Tomato", "Grapes", "Maize", "Wheat"]
      },
      "aurangabad": {
        name: "Chhatrapati Sambhajinagar (Marathwada)",
        soilType: "Black Soil",
        npk: { n: 65, p: 38, k: 48 },
        ph: 7.8,
        organicCarbon: "0.45%",
        climateZone: "Dry Semi-Arid",
        season: "Kharif",
        avgTemp: 30,
        tempRange: [22, 38],
        rainfall: 620,
        humidity: 55,
        irrigationSource: "Borewell / Rainfed",
        typicalCrops: ["Cotton", "Sorghum", "Pigeonpeas", "Soybean", "Pearl Millet"]
      }
    }
  },
  "punjab": {
    name: "Punjab",
    districts: {
      "ludhiana": {
        name: "Ludhiana (Central Plain)",
        soilType: "Alluvial",
        npk: { n: 130, p: 65, k: 45 },
        ph: 7.2,
        organicCarbon: "0.50%",
        climateZone: "Sub-Tropical Semi-Arid",
        season: "Rabi",
        avgTemp: 19,
        tempRange: [10, 26],
        rainfall: 680,
        humidity: 58,
        irrigationSource: "Tube-well / Canal",
        typicalCrops: ["Wheat", "Rice", "Potato", "Maize", "Mustard"]
      },
      "bathinda": {
        name: "Bathinda (South-Western)",
        soilType: "Sandy Loam",
        npk: { n: 100, p: 45, k: 40 },
        ph: 7.9,
        organicCarbon: "0.38%",
        climateZone: "Arid / Semi-Arid",
        season: "Kharif",
        avgTemp: 32,
        tempRange: [24, 40],
        rainfall: 410,
        humidity: 48,
        irrigationSource: "Canal",
        typicalCrops: ["Cotton", "Wheat", "Mustard", "Pearl Millet"]
      }
    }
  },
  "uttar_pradesh": {
    name: "Uttar Pradesh",
    districts: {
      "varanasi": {
        name: "Varanasi (Eastern Gangetic Plain)",
        soilType: "Alluvial",
        npk: { n: 110, p: 55, k: 50 },
        ph: 6.9,
        organicCarbon: "0.60%",
        climateZone: "Humid Sub-Tropical",
        season: "Kharif",
        avgTemp: 28,
        tempRange: [20, 35],
        rainfall: 1050,
        humidity: 72,
        irrigationSource: "Canal / Tube-well",
        typicalCrops: ["Rice", "Wheat", "Sugarcane", "Tomato", "Lentil"]
      },
      "meerut": {
        name: "Meerut (Western UP)",
        soilType: "Clay Loam",
        npk: { n: 135, p: 70, k: 60 },
        ph: 7.1,
        organicCarbon: "0.65%",
        climateZone: "Sub-Tropical",
        season: "Annual",
        avgTemp: 24,
        tempRange: [15, 33],
        rainfall: 820,
        humidity: 64,
        irrigationSource: "Tube-well / Canal",
        typicalCrops: ["Sugarcane", "Wheat", "Potato", "Mustard"]
      }
    }
  },
  "karnataka": {
    name: "Karnataka",
    districts: {
      "belagavi": {
        name: "Belagavi (Northern Transition)",
        soilType: "Black Soil",
        npk: { n: 85, p: 50, k: 60 },
        ph: 7.3,
        organicCarbon: "0.58%",
        climateZone: "Tropical Semi-Arid",
        season: "Kharif",
        avgTemp: 27,
        tempRange: [20, 33],
        rainfall: 850,
        humidity: 68,
        irrigationSource: "Canal / Borewell",
        typicalCrops: ["Sugarcane", "Soybean", "Maize", "Groundnut", "Chilli"]
      },
      "mysore": {
        name: "Mysore (Southern Dry Zone)",
        soilType: "Red Loam",
        npk: { n: 95, p: 55, k: 70 },
        ph: 6.5,
        organicCarbon: "0.62%",
        climateZone: "Tropical Wet & Dry",
        season: "Kharif",
        avgTemp: 26,
        tempRange: [19, 32],
        rainfall: 780,
        humidity: 65,
        irrigationSource: "Canal / Borewell",
        typicalCrops: ["Rice", "Banana", "Tomato", "Sorghum", "Turmeric"]
      }
    }
  },
  "tamil_nadu": {
    name: "Tamil Nadu",
    districts: {
      "thanjavur": {
        name: "Thanjavur (Cauvery Delta)",
        soilType: "Clayey",
        npk: { n: 120, p: 55, k: 55 },
        ph: 6.8,
        organicCarbon: "0.70%",
        climateZone: "Tropical Maritime",
        season: "Kharif",
        avgTemp: 29,
        tempRange: [24, 36],
        rainfall: 1120,
        humidity: 78,
        irrigationSource: "River Canal",
        typicalCrops: ["Rice", "Banana", "Sugarcane", "Blackgram", "Groundnut"]
      },
      "coimbatore": {
        name: "Coimbatore (Western Zone)",
        soilType: "Red Sandy",
        npk: { n: 80, p: 45, k: 50 },
        ph: 7.0,
        organicCarbon: "0.52%",
        climateZone: "Semi-Arid",
        season: "Kharif",
        avgTemp: 27,
        tempRange: [20, 34],
        rainfall: 650,
        humidity: 60,
        irrigationSource: "Borewell / Drip",
        typicalCrops: ["Cotton", "Maize", "Tomato", "Sorghum", "Banana"]
      }
    }
  },
  "andhra_pradesh": {
    name: "Andhra Pradesh & Telangana",
    districts: {
      "guntur": {
        name: "Guntur (Coastal AP)",
        soilType: "Black Soil",
        npk: { n: 110, p: 65, k: 65 },
        ph: 7.4,
        organicCarbon: "0.60%",
        climateZone: "Tropical Wet & Dry",
        season: "Kharif",
        avgTemp: 31,
        tempRange: [23, 38],
        rainfall: 890,
        humidity: 70,
        irrigationSource: "Canal / Borewell",
        typicalCrops: ["Chilli", "Cotton", "Rice", "Tobacco", "Turmeric"]
      },
      "warangal": {
        name: "Warangal (Telangana)",
        soilType: "Red Loam",
        npk: { n: 90, p: 45, k: 50 },
        ph: 6.7,
        organicCarbon: "0.55%",
        climateZone: "Semi-Arid Tropical",
        season: "Kharif",
        avgTemp: 30,
        tempRange: [22, 37],
        rainfall: 980,
        humidity: 66,
        irrigationSource: "Tanks / Borewell",
        typicalCrops: ["Cotton", "Rice", "Chilli", "Maize", "Turmeric"]
      }
    }
  },
  "gujarat": {
    name: "Gujarat",
    districts: {
      "rajkot": {
        name: "Rajkot (Saurashtra)",
        soilType: "Medium Black",
        npk: { n: 70, p: 40, k: 55 },
        ph: 7.8,
        organicCarbon: "0.48%",
        climateZone: "Arid / Semi-Arid",
        season: "Kharif",
        avgTemp: 30,
        tempRange: [21, 39],
        rainfall: 580,
        humidity: 56,
        irrigationSource: "Borewell / Drip",
        typicalCrops: ["Groundnut", "Cotton", "Pearl Millet", "Wheat", "Onion"]
      }
    }
  }
};
