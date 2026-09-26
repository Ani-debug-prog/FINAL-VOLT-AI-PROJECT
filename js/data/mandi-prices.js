// mandi-prices.js - Live Mandi Price Simulation & 6-Month Historical Trends
window.MANDI_DATA = {
  crops: {
    "rice": {
      msp: 2183,
      currentPrice: 2320,
      trend: "up", // up, down, stable
      changePct: "+6.2%",
      historicalMonthly: [2150, 2180, 2220, 2250, 2290, 2320],
      volatilityIndex: "Low (8%)",
      topMandis: [
        { name: "Karnal Mandi (Haryana)", price: 2380, volumeTons: 1450 },
        { name: "Gondia Mandi (Maharashtra)", price: 2280, volumeTons: 920 },
        { name: "Kakinada Mandi (Andhra)", price: 2300, volumeTons: 1100 }
      ]
    },
    "wheat": {
      msp: 2275,
      currentPrice: 2390,
      trend: "up",
      changePct: "+5.1%",
      historicalMonthly: [2250, 2275, 2300, 2340, 2360, 2390],
      volatilityIndex: "Low (6%)",
      topMandis: [
        { name: "Khanna Mandi (Punjab)", price: 2420, volumeTons: 2800 },
        { name: "Indore Mandi (MP)", price: 2370, volumeTons: 1900 },
        { name: "Kota Mandi (Rajasthan)", price: 2380, volumeTons: 1400 }
      ]
    },
    "cotton": {
      msp: 6620,
      currentPrice: 7250,
      trend: "up",
      changePct: "+9.5%",
      historicalMonthly: [6600, 6750, 6900, 7100, 7180, 7250],
      volatilityIndex: "Medium (14%)",
      topMandis: [
        { name: "Rajkot Mandi (Gujarat)", price: 7350, volumeTons: 3200 },
        { name: "Warangal Mandi (Telangana)", price: 7200, volumeTons: 2100 },
        { name: "Amravati Mandi (Maharashtra)", price: 7150, volumeTons: 1850 }
      ]
    },
    "soybean": {
      msp: 4600,
      currentPrice: 4720,
      trend: "stable",
      changePct: "+2.6%",
      historicalMonthly: [4550, 4600, 4620, 4680, 4700, 4720],
      volatilityIndex: "Medium (12%)",
      topMandis: [
        { name: "Indore Mandi (MP)", price: 4780, volumeTons: 2400 },
        { name: "Latur Mandi (Maharashtra)", price: 4700, volumeTons: 3100 },
        { name: "Nagpur Mandi (Maharashtra)", price: 4690, volumeTons: 1600 }
      ]
    },
    "maize": {
      msp: 2090,
      currentPrice: 2210,
      trend: "up",
      changePct: "+5.7%",
      historicalMonthly: [2050, 2090, 2120, 2160, 2180, 2210],
      volatilityIndex: "Low (7%)",
      topMandis: [
        { name: "Davangere Mandi (Karnataka)", price: 2240, volumeTons: 1500 },
        { name: "Chhindwara Mandi (MP)", price: 2190, volumeTons: 1200 }
      ]
    },
    "sugarcane": {
      msp: 315, // FRP
      currentPrice: 340,
      trend: "stable",
      changePct: "+3.2%",
      historicalMonthly: [315, 320, 325, 330, 335, 340],
      volatilityIndex: "Very Low (3%)",
      topMandis: [
        { name: "Kolhapur Sugar Coop (MH)", price: 355, volumeTons: 8500 },
        { name: "Muzaffarnagar Mandi (UP)", price: 340, volumeTons: 9200 }
      ]
    },
    "chickpea": {
      msp: 5440,
      currentPrice: 5950,
      trend: "up",
      changePct: "+9.3%",
      historicalMonthly: [5350, 5450, 5600, 5750, 5820, 5950],
      volatilityIndex: "Medium (10%)",
      topMandis: [
        { name: "Bikaner Mandi (Rajasthan)", price: 6050, volumeTons: 1600 },
        { name: "Gulbarga Mandi (Karnataka)", price: 5900, volumeTons: 1400 }
      ]
    },
    "mustard": {
      msp: 5650,
      currentPrice: 5880,
      trend: "up",
      changePct: "+4.1%",
      historicalMonthly: [5500, 5650, 5700, 5780, 5820, 5880],
      volatilityIndex: "Low (8%)",
      topMandis: [
        { name: "Bharatpur Mandi (Rajasthan)", price: 5950, volumeTons: 2200 },
        { name: "Hisar Mandi (Haryana)", price: 5850, volumeTons: 1750 }
      ]
    },
    "groundnut": {
      msp: 6377,
      currentPrice: 6720,
      trend: "up",
      changePct: "+5.4%",
      historicalMonthly: [6300, 6380, 6450, 6550, 6620, 6720],
      volatilityIndex: "Low (9%)",
      topMandis: [
        { name: "Gondal Mandi (Gujarat)", price: 6800, volumeTons: 2900 },
        { name: "Kurnool Mandi (AP)", price: 6680, volumeTons: 1800 }
      ]
    },
    "tomato": {
      msp: null,
      currentPrice: 2100,
      trend: "down",
      changePct: "-12.5%",
      historicalMonthly: [1400, 1800, 3200, 2900, 2400, 2100],
      volatilityIndex: "High (35%)",
      topMandis: [
        { name: "Kolar Mandi (Karnataka)", price: 2150, volumeTons: 4200 },
        { name: "Nashik Mandi (Maharashtra)", price: 2050, volumeTons: 3800 },
        { name: "Madanapalle Mandi (AP)", price: 2120, volumeTons: 3500 }
      ]
    },
    "onion": {
      msp: null,
      currentPrice: 2350,
      trend: "up",
      changePct: "+14.6%",
      historicalMonthly: [1500, 1650, 1800, 1950, 2100, 2350],
      volatilityIndex: "High (28%)",
      topMandis: [
        { name: "Lasalgaon Mandi (Maharashtra)", price: 2420, volumeTons: 6200 },
        { name: "Yeola Mandi (Maharashtra)", price: 2360, volumeTons: 4100 },
        { name: "Mahuva Mandi (Gujarat)", price: 2280, volumeTons: 2800 }
      ]
    },
    "potato": {
      msp: null,
      currentPrice: 1550,
      trend: "stable",
      changePct: "+3.3%",
      historicalMonthly: [1350, 1400, 1450, 1500, 1520, 1550],
      volatilityIndex: "Medium (15%)",
      topMandis: [
        { name: "Agra Mandi (UP)", price: 1600, volumeTons: 5400 },
        { name: "Jalandhar Mandi (Punjab)", price: 1520, volumeTons: 3600 }
      ]
    },
    "banana": {
      msp: null,
      currentPrice: 1750,
      trend: "up",
      changePct: "+7.8%",
      historicalMonthly: [1500, 1550, 1600, 1650, 1700, 1750],
      volatilityIndex: "Low (9%)",
      topMandis: [
        { name: "Jalgaon Mandi (Maharashtra)", price: 1820, volumeTons: 4800 },
        { name: "Theni Mandi (Tamil Nadu)", price: 1720, volumeTons: 3200 }
      ]
    },
    "pigeonpeas": {
      msp: 7000,
      currentPrice: 7850,
      trend: "up",
      changePct: "+12.1%",
      historicalMonthly: [6900, 7100, 7350, 7550, 7700, 7850],
      volatilityIndex: "Medium (11%)",
      topMandis: [
        { name: "Gulbarga Mandi (Karnataka)", price: 7950, volumeTons: 1900 },
        { name: "Akola Mandi (Maharashtra)", price: 7800, volumeTons: 2100 }
      ]
    },
    "millet": {
      msp: 2500,
      currentPrice: 2680,
      trend: "up",
      changePct: "+7.2%",
      historicalMonthly: [2450, 2500, 2550, 2600, 2640, 2680],
      volatilityIndex: "Low (6%)",
      topMandis: [
        { name: "Jaipur Mandi (Rajasthan)", price: 2720, volumeTons: 1800 },
        { name: "Ahmedabad Mandi (Gujarat)", price: 2650, volumeTons: 1400 }
      ]
    },
    "sorghum": {
      msp: 3180,
      currentPrice: 3350,
      trend: "stable",
      changePct: "+5.3%",
      historicalMonthly: [3100, 3180, 3220, 3280, 3310, 3350],
      volatilityIndex: "Low (7%)",
      topMandis: [
        { name: "Solapur Mandi (Maharashtra)", price: 3420, volumeTons: 1600 }
      ]
    },
    "chilli": {
      msp: null,
      currentPrice: 15800,
      trend: "up",
      changePct: "+8.9%",
      historicalMonthly: [13800, 14200, 14700, 15100, 15400, 15800],
      volatilityIndex: "Medium (16%)",
      topMandis: [
        { name: "Guntur Mandi (AP)", price: 16200, volumeTons: 4500 },
        { name: "Khammam Mandi (Telangana)", price: 15600, volumeTons: 2800 },
        { name: "Byadgi Mandi (Karnataka)", price: 16500, volumeTons: 3100 }
      ]
    },
    "turmeric": {
      msp: null,
      currentPrice: 14200,
      trend: "up",
      changePct: "+18.3%",
      historicalMonthly: [11500, 12000, 12800, 13400, 13900, 14200],
      volatilityIndex: "High (22%)",
      topMandis: [
        { name: "Nizamabad Mandi (Telangana)", price: 14500, volumeTons: 2200 },
        { name: "Sangli Mandi (Maharashtra)", price: 14300, volumeTons: 1900 },
        { name: "Erode Mandi (Tamil Nadu)", price: 14100, volumeTons: 2600 }
      ]
    },
    "watermelon": {
      msp: null,
      currentPrice: 1100,
      trend: "up",
      changePct: "+15.8%",
      historicalMonthly: [850, 900, 950, 1000, 1050, 1100],
      volatilityIndex: "Medium (18%)",
      topMandis: [
        { name: "Vashi APMC (Mumbai)", price: 1180, volumeTons: 3500 },
        { name: "Azadpur Mandi (Delhi)", price: 1120, volumeTons: 4200 }
      ]
    },
    "lentil": {
      msp: 6425,
      currentPrice: 6750,
      trend: "up",
      changePct: "+5.1%",
      historicalMonthly: [6350, 6450, 6520, 6600, 6680, 6750],
      volatilityIndex: "Low (7%)",
      topMandis: [
        { name: "Lalitpur Mandi (UP)", price: 6800, volumeTons: 1200 },
        { name: "Vidisha Mandi (MP)", price: 6720, volumeTons: 1500 }
      ]
    }
  },
  monthLabels: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"]
};
