const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// In-memory translation cache to avoid repeated API calls
const translationCache = new Map();

function getCacheKey(text, lang) {
  return `${lang}:${text.trim().toLowerCase()}`;
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
    const langName = targetLang === 'ta' ? 'Tamil' : 'English';
    const prompt = `Translate the following text into ${langName} accurately. This is for an industrial engineering company that sells flanges, connectors, machined parts, valves, and tools. Preserve technical/industrial terminology accurately. Return ONLY the translated text, nothing else.\n\nText: "${text}"`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.1,
    });

    const translated = chatCompletion.choices[0]?.message?.content?.trim() || text;
    
    // Remove surrounding quotes if present
    const cleaned = translated.replace(/^["']|["']$/g, '');
    
    translationCache.set(cacheKey, cleaned);
    res.json({ translated: cleaned, cached: false });
  } catch (error) {
    console.error('Translation Error:', error);
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

    // Batch translate uncached texts
    const langName = targetLang === 'ta' ? 'Tamil' : 'English';
    const numberedTexts = uncachedTexts.map((t, i) => `${i + 1}. "${t}"`).join('\n');
    const prompt = `Translate each of the following texts into ${langName} accurately. This is for an industrial engineering company. Preserve technical/industrial terminology. Return ONLY a JSON array of translated strings in the same order. No markdown formatting.\n\n${numberedTexts}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.1,
    });

    const responseContent = chatCompletion.choices[0]?.message?.content?.trim() || '[]';
    
    let translations = [];
    try {
      const cleanJson = responseContent.replace(/```json/g, '').replace(/```/g, '').trim();
      translations = JSON.parse(cleanJson);
    } catch (e) {
      console.error('Failed to parse batch translation:', responseContent);
      // Fallback: return original texts
      translations = uncachedTexts;
    }

    // Fill in results and cache
    for (let i = 0; i < uncachedIndices.length; i++) {
      const translated = translations[i] || uncachedTexts[i];
      const cleaned = typeof translated === 'string' ? translated.replace(/^["']|["']$/g, '') : uncachedTexts[i];
      results[uncachedIndices[i]] = cleaned;
      translationCache.set(getCacheKey(uncachedTexts[i], targetLang), cleaned);
    }

    res.json({ translations: results, cached: false });
  } catch (error) {
    console.error('Batch Translation Error:', error);
    // Fallback: return original texts
    res.json({ translations: texts, cached: false, fallback: true });
  }
};

module.exports = { translateText, translateBatch };
