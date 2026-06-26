const axios = require('axios');

const SARVAM_API_KEY = process.env.SARVAM;
const SARVAM_URL = 'https://api.sarvam.ai/translate';

// In-memory translation cache to avoid repeated API calls
const translationCache = new Map();

function getCacheKey(text, lang) {
  return `${lang}:${text.trim().toLowerCase()}`;
}

async function sarvamTranslate(text, sourceLang, targetLang) {
  const response = await axios.post(
    SARVAM_URL,
    {
      input: text,
      source_language_code: sourceLang === 'en' ? 'en-IN' : 'ta-IN',
      target_language_code: targetLang === 'en' ? 'en-IN' : 'ta-IN',
      speaker_gender: 'Male',
      mode: 'formal',
      model: 'mayura:v1',
      enable_preprocessing: true,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': SARVAM_API_KEY,
      },
    }
  );
  return response.data.translated_text || text;
}

const translateText = async (req, res) => {
  const { text, targetLang } = req.body;
  if (!text || !targetLang) {
    return res.status(400).json({ message: 'text and targetLang are required' });
  }

  // Only support en and ta
  if (!['en', 'ta'].includes(targetLang)) {
    return res.status(400).json({ message: 'Supported languages: en, ta' });
  }

  const cacheKey = getCacheKey(text, targetLang);
  if (translationCache.has(cacheKey)) {
    return res.json({ translated: translationCache.get(cacheKey), cached: true });
  }

  try {
    const sourceLang = targetLang === 'ta' ? 'en' : 'ta';
    const translated = await sarvamTranslate(text, sourceLang, targetLang);

    translationCache.set(cacheKey, translated);
    res.json({ translated, cached: false });
  } catch (error) {
    console.error('Sarvam Translation Error:', error?.response?.data || error.message);
    // Fallback: return original text
    res.json({ translated: text, cached: false, fallback: true });
  }
};

const translateBatch = async (req, res) => {
  const { texts, targetLang } = req.body;
  if (!texts || !Array.isArray(texts) || !targetLang) {
    return res.status(400).json({ message: 'texts (array) and targetLang are required' });
  }

  if (!['en', 'ta'].includes(targetLang)) {
    return res.status(400).json({ message: 'Supported languages: en, ta' });
  }

  try {
    const results = [];
    const uncachedTexts = [];
    const uncachedIndices = [];

    // Check cache first
    for (let i = 0; i < texts.length; i++) {
      const cacheKey = getCacheKey(texts[i], targetLang);
      if (translationCache.has(cacheKey)) {
        results[i] = translationCache.get(cacheKey);
      } else {
        uncachedTexts.push(texts[i]);
        uncachedIndices.push(i);
        results[i] = null; // placeholder
      }
    }

    // If all cached, return immediately
    if (uncachedTexts.length === 0) {
      return res.json({ translations: results, cached: true });
    }

    // Translate uncached texts in parallel using Sarvam API
    const sourceLang = targetLang === 'ta' ? 'en' : 'ta';
    const translationPromises = uncachedTexts.map(text =>
      sarvamTranslate(text, sourceLang, targetLang).catch(() => text)
    );
    const translations = await Promise.all(translationPromises);

    // Fill in results and cache
    for (let i = 0; i < uncachedIndices.length; i++) {
      const translated = translations[i] || uncachedTexts[i];
      results[uncachedIndices[i]] = translated;
      translationCache.set(getCacheKey(uncachedTexts[i], targetLang), translated);
    }

    res.json({ translations: results, cached: false });
  } catch (error) {
    console.error('Batch Translation Error:', error?.response?.data || error.message);
    // Fallback: return original texts
    res.json({ translations: texts, cached: false, fallback: true });
  }
};

module.exports = { translateText, translateBatch };
