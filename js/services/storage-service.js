// storage-service.js - LocalStorage / Offline Persistence Service
class StorageService {
  static getStorageKey(key) {
    return `voltai_${key}`;
  }

  static getFarmerProfile() {
    const data = localStorage.getItem(this.getStorageKey('profile'));
    if (data) {
      try { return JSON.parse(data); } catch (e) { return null; }
    }
    return {
      farmerName: "Ramesh Patil",
      state: "maharashtra",
      district: "nagpur",
      landSize: 3.5,
      landUnit: "Acres",
      soilType: "Black Soil",
      irrigation: "Borewell / Canal",
      n: 75,
      p: 45,
      k: 55,
      ph: 7.4,
      season: "Kharif"
    };
  }

  static saveFarmerProfile(profile) {
    localStorage.setItem(this.getStorageKey('profile'), JSON.stringify(profile));
  }

  static getSavedRecommendations() {
    const data = localStorage.getItem(this.getStorageKey('saved_recs'));
    return data ? JSON.parse(data) : [];
  }

  static saveRecommendation(rec) {
    const recs = this.getSavedRecommendations();
    recs.unshift({
      id: Date.now(),
      savedAt: new Date().toISOString(),
      ...rec
    });
    localStorage.setItem(this.getStorageKey('saved_recs'), JSON.stringify(recs.slice(0, 20)));
  }

  static getHarvestLogs() {
    const data = localStorage.getItem(this.getStorageKey('harvest_logs'));
    if (data) return JSON.parse(data);

    // Initial demo logs
    return [
      {
        id: 1,
        season: "Kharif 2025",
        cropName: "Soybean",
        actualYieldPerAcre: 10.5,
        profitMade: 36000,
        satisfaction: 5,
        notes: "Excellent pod formation with timely DAP application."
      },
      {
        id: 2,
        season: "Rabi 2024-25",
        cropName: "Wheat",
        actualYieldPerAcre: 21.0,
        profitMade: 32500,
        satisfaction: 4,
        notes: "Good yield despite mild temperature rise in February."
      }
    ];
  }

  static addHarvestLog(log) {
    const logs = this.getHarvestLogs();
    logs.unshift({
      id: Date.now(),
      dateLogged: new Date().toISOString(),
      ...log
    });
    localStorage.setItem(this.getStorageKey('harvest_logs'), JSON.stringify(logs));
  }

  static getOfficerFarmers() {
    const data = localStorage.getItem(this.getStorageKey('officer_farmers'));
    if (data) return JSON.parse(data);

    return [
      { id: 101, name: "Ramesh Patil", village: "Hingna, Nagpur", acres: 3.5, soil: "Black Soil", crop: "Cotton / Soybean", status: "Recommended" },
      { id: 102, name: "Suresh Deshmukh", village: "Katol, Nagpur", acres: 5.0, soil: "Clay Loam", crop: "Orange / Citrus", status: "Review Needed" },
      { id: 103, name: "Anand Shinde", village: "Umred, Nagpur", acres: 2.0, soil: "Black Soil", crop: "Pigeonpeas", status: "Harvest Logged" },
      { id: 104, name: "Balwinder Singh", village: "Jagraon, Ludhiana", acres: 8.0, soil: "Alluvial", crop: "Wheat / Rice", status: "Recommended" },
      { id: 105, name: "K. Venkatesh", village: "Tenali, Guntur", acres: 4.2, soil: "Black Soil", crop: "Chilli", status: "Recommended" }
    ];
  }

  static addOfficerFarmer(farmer) {
    const farmers = this.getOfficerFarmers();
    farmers.unshift({
      id: Date.now(),
      status: "Recommended",
      ...farmer
    });
    localStorage.setItem(this.getStorageKey('officer_farmers'), JSON.stringify(farmers));
  }
}

window.StorageService = StorageService;
