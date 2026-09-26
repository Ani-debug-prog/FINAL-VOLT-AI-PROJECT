// explainability.js - Explainable AI (XAI) Reason Generator for Farmers & Extension Officers
class ExplainabilityEngine {
  /**
   * Generate human-readable reasoning points for a recommended crop
   * @param {Object} item - Scored recommendation item from CropRecommender
   * @param {Object} input - Farmer input parameters
   * @param {String} lang - Language code ('en', 'hi', 'mr', 'te', 'ta')
   */
  static explain(item, input, lang = 'en') {
    const { crop, scores, economics, fertilizerAdvisory } = item;
    const reasons = [];

    // 1. Soil factor
    if (scores.soil >= 85) {
      if (lang === 'hi') reasons.push(`🌱 आपकी मिट्टी का pH (${input.ph}) और NPK पोषक तत्व ${crop.localNames.hi || crop.name} की सर्वोत्तम पैदावार के लिए आदर्श हैं।`);
      else if (lang === 'mr') reasons.push(`🌱 तुमच्या मातीचा pH (${input.ph}) आणि NPK घटक ${crop.localNames.mr || crop.name} च्या वाढीसाठी अत्यंत अनुकूल आहेत.`);
      else if (lang === 'te') reasons.push(`🌱 మీ మట్టి pH (${input.ph}) మరియు NPK పోషకాలు ${crop.localNames.te || crop.name} దిగుబడికి చాలా అనుకూలంగా ఉన్నాయి.`);
      else if (lang === 'ta') reasons.push(`🌱 உங்கள் மண் pH (${input.ph}) மற்றும் NPK சத்துக்கள் ${crop.localNames.ta || crop.name} பயிருக்கு மிகவும் உகந்தது.`);
      else reasons.push(`🌱 Soil pH (${input.ph}) and NPK balance provide an optimal environment for ${crop.name}.`);
    } else {
      if (lang === 'hi') reasons.push(`🌱 मिट्टी की उपयुक्तता अच्छी है; थोड़ी खाद प्रबंधन से अधिक पैदावार संभव है।`);
      else if (lang === 'mr') reasons.push(`🌱 मातीची सुसंगतता चांगली आहे; थोडे खत व्यवस्थापन उत्पादन वाढवू शकते.`);
      else reasons.push(`🌱 Soil conditions are favorable with minor fertilizer adjustments recommended.`);
    }

    // 2. Weather & Climate factor
    if (scores.climate >= 80) {
      if (lang === 'hi') reasons.push(`☀️ स्थानीय तापमान (${input.temp}°C) और मौसमी वर्षा (${input.rainfall}mm) इस फसल चक्र के बिल्कुल अनुकूल है।`);
      else if (lang === 'mr') reasons.push(`☀️ स्थानिक तापमान (${input.temp}°C) आणि पाऊस (${input.rainfall}mm) या पिकासाठी योग्य आहे.`);
      else if (lang === 'te') reasons.push(`☀️ స్థానిక ఉష్ణోగ్రత (${input.temp}°C) మరియు వర్షపాతం (${input.rainfall}mm) ఈ పంటకు సరిగ్గా సరిపోతుంది.`);
      else if (lang === 'ta') reasons.push(`☀️ உள்ளூர் வெப்பநிலை (${input.temp}°C) மற்றும் மழைப்பொழிவு (${input.rainfall}mm) இந்த பயிருக்கு ஏற்றது.`);
      else reasons.push(`☀️ Local temperature (${input.temp}°C) and seasonal moisture (${input.rainfall}mm) align well with growth stages.`);
    }

    // 3. Market & Profit factor
    if (economics.netProfitPerAcre > 25000) {
      const formattedProfit = economics.netProfitPerAcre.toLocaleString('en-IN');
      if (lang === 'hi') reasons.push(`💰 वर्तमान मंडी भाव ₹${economics.spotPrice}/क्विंटल पर लगभग ₹${formattedProfit}/एकड़ शुद्ध लाभ का अनुमान है (${economics.priceChange} रुझान)।`);
      else if (lang === 'mr') reasons.push(`💰 सध्याच्या बाजारभावावर (₹${economics.spotPrice}/क्विंटल) प्रति एकर अंदाजे ₹${formattedProfit} नफा अपेक्षित आहे (${economics.priceChange} कल).`);
      else if (lang === 'te') reasons.push(`💰 ప్రస్తుత మార్కెట్ ధర వద్ద ఎకరాకు సుమారు ₹${formattedProfit} నికర లాభం అంచనా (${economics.priceChange} మార్కెట్ ట్రెండ్).`);
      else if (lang === 'ta') reasons.push(`💰 தற்போதைய சந்தை விலையில் ஏக்கருக்கு சுமார் ₹${formattedProfit} நிகர லாபம் எதிர்பார்க்கப்படுகிறது.`);
      else reasons.push(`💰 Strong market viability with estimated net profit of ₹${formattedProfit}/acre (${economics.priceChange} price trend).`);
    }

    // 4. Fertilizer & Risk advisory note
    if (fertilizerAdvisory.nDeficit > 0 || fertilizerAdvisory.pDeficit > 0 || fertilizerAdvisory.kDeficit > 0) {
      if (lang === 'hi') reasons.push(`⚖️ अनुशंसित खाद: यूरिया ${fertilizerAdvisory.ureaBags} बोरी, DAP ${fertilizerAdvisory.dapBags} बोरी, MOP ${fertilizerAdvisory.mopBags} बोरी प्रति एकड़।`);
      else if (lang === 'mr') reasons.push(`⚖️ खत शिफारस: युरिया ${fertilizerAdvisory.ureaBags} पोती, DAP ${fertilizerAdvisory.dapBags} पोती, MOP ${fertilizerAdvisory.mopBags} पोती प्रति एकर.`);
      else reasons.push(`⚖️ Nutrient supplement required: Urea ${fertilizerAdvisory.ureaBags} bags, DAP ${fertilizerAdvisory.dapBags} bags, MOP ${fertilizerAdvisory.mopBags} bags per acre.`);
    }

    return reasons;
  }

  /**
   * Generate short audio narration text for SpeechSynthesis TTS
   */
  static getSpeechSummary(item, input, lang = 'en') {
    const { crop, confidenceScore, economics } = item;
    const profit = economics.netProfitPerAcre.toLocaleString('en-IN');

    if (lang === 'hi') {
      return `शीर्ष अनुशंसित फसल है ${crop.localNames.hi || crop.name}। विश्वास स्कोर ${confidenceScore} प्रतिशत है। अनुमानित शुद्ध लाभ ₹${profit} प्रति एकड़ है। यह फसल आपकी मिट्टी और मौसम के लिए सबसे उपयुक्त है।`;
    }
    if (lang === 'mr') {
      return `सर्वोत्तम शिफारस केलेले पीक आहे ${crop.localNames.mr || crop.name}। अचूकता गुण ${confidenceScore} टक्के आहे। अंदाजित नफा ₹${profit} प्रति एकर आहे।`;
    }
    if (lang === 'te') {
      return `టాప్ సిఫార్సు చేయబడిన పంట ${crop.localNames.te || crop.name}। విశ్వాస స్కోరు ${confidenceScore} శాతం। అంచనా లాభం ఎకరాకు ₹${profit}।`;
    }
    if (lang === 'ta') {
      return `சிறந்த பரிந்துரைக்கப்பட்ட பயிர் ${crop.localNames.ta || crop.name}। நம்பிக்கை மதிப்பெண் ${confidenceScore} சதவீதம்। ஏக்கருக்கு எதிர்பார்க்கப்படும் லாபம் ₹${profit}।`;
    }
    return `Top recommended crop is ${crop.name} with a ${confidenceScore}% match. Estimated net profit is ₹${profit} per acre. This matches your soil pH, climate, and current Mandi market prices.`;
  }
}

window.ExplainabilityEngine = ExplainabilityEngine;
