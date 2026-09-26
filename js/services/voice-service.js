// voice-service.js - Web Speech API Audio Readout & Speech Recognition
class VoiceService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.onStateChange = null;

    // Speech Recognition setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.hasRecognition = !!SpeechRecognition;
    if (this.hasRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
    }
  }

  /**
   * Speak text in selected language
   * @param {String} text - Text to speak
   * @param {String} langCode - 'en', 'hi', 'mr', 'te', 'ta'
   * @param {Function} onEndCallback - Callback when speaking completes
   */
  speak(text, langCode = 'en', onEndCallback = null) {
    if (!this.synth) {
      console.warn("SpeechSynthesis not supported in this browser.");
      return;
    }

    this.stop(); // Stop any active speech

    const langMap = {
      en: 'en-IN',
      hi: 'hi-IN',
      mr: 'mr-IN',
      te: 'te-IN',
      ta: 'ta-IN'
    };

    const targetLang = langMap[langCode] || 'en-IN';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang;
    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 1.0;

    // Try finding matching voice
    const voices = this.synth.getVoices();
    const matchedVoice = voices.find(v => v.lang === targetLang || v.lang.startsWith(langCode));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.onStateChange) this.onStateChange(true);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (this.onStateChange) this.onStateChange(false);
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = (e) => {
      console.warn("SpeechSynthesis error:", e);
      this.isSpeaking = false;
      if (this.onStateChange) this.onStateChange(false);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
      this.isSpeaking = false;
      if (this.onStateChange) this.onStateChange(false);
    }
  }

  /**
   * Listen for user voice command/query
   */
  listen(langCode = 'en', onResultCallback = null, onErrorCallback = null) {
    if (!this.hasRecognition) {
      alert("Voice input is not supported by your browser. Please use Chrome.");
      return;
    }

    const langMap = {
      en: 'en-IN',
      hi: 'hi-IN',
      mr: 'mr-IN',
      te: 'te-IN',
      ta: 'ta-IN'
    };

    this.recognition.lang = langMap[langCode] || 'en-IN';

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResultCallback) onResultCallback(transcript);
    };

    this.recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      if (onErrorCallback) onErrorCallback(event.error);
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn("Speech recognition start failed:", e);
    }
  }
}

window.VoiceService = VoiceService;
