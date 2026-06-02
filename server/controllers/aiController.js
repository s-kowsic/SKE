const Groq = require('groq-sdk');
const Product = require('../models/Product');
const Order = require('../models/Order');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const searchProducts = async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ message: 'Query is required' });

  try {
    // 1. Fetch all products to give to the LLM (in a real scenario, use vector search, but for small catalog, this is fine)
    const products = await Product.find({}).select('name type size price description');
    
    // 2. Ask Groq to find the best matches
    const prompt = `You are a helpful industrial supply assistant for Sri Krishna Engineering. 
The user is searching for: "${query}".
Here is our catalog of products in JSON format: ${JSON.stringify(products)}.
Return ONLY a JSON array of the "_id" strings of the products that best match the query. 
If none match well, return an empty array []. Do not include any other text or markdown formatting.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0,
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || '[]';
    
    // Attempt to parse the response
    let matchedIds = [];
    try {
      // Remove any markdown code blocks if the model accidentally included them
      const cleanJson = responseContent.replace(/```json/g, '').replace(/```/g, '').trim();
      matchedIds = JSON.parse(cleanJson);
    } catch (e) {
      console.error('Failed to parse Groq response:', responseContent);
    }

    if (matchedIds.length === 0) {
      // fallback to basic text search if AI fails or returns empty
      const fallbackProducts = await Product.find({ $text: { $search: query } });
      return res.json(fallbackProducts);
    }

    const matchedProducts = await Product.find({ _id: { $in: matchedIds } });
    res.json(matchedProducts);
  } catch (error) {
    console.error('Groq Search Error:', error);
    res.status(500).json({ message: 'Error performing AI search', error: error.message });
  }
};

const getDemandInsights = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('products.productId', 'name type');
    
    // Summarize order data
    const productSales = {};
    orders.forEach(order => {
      order.products.forEach(p => {
        if(p.productId) {
          const name = p.productId.name;
          productSales[name] = (productSales[name] || 0) + p.quantity;
        }
      });
    });

    const prompt = `You are an industrial supply business analyst. 
Analyze the following sales data for Sri Krishna Engineering:
${JSON.stringify(productSales)}.
Provide a brief analysis report including:
1. High demand products
2. Low demand products
3. Emerging trends or recommendations.
Format your response as a concise, professional markdown report.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
    });

    res.json({ insights: chatCompletion.choices[0]?.message?.content });
  } catch (error) {
    console.error('Groq Insights Error:', error);
    res.status(500).json({ message: 'Error generating AI insights', error: error.message });
  }
};

const chatAssistant = async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ message: 'Valid messages array is required' });
  }

  try {
    const products = await Product.find({}).select('name type price');
    const systemPrompt = `You are a helpful customer support agent for Sri Krishna Engineering. 
We sell industrial components. Answer queries politely and concisely. 
Our current inventory includes: ${JSON.stringify(products)}. 
Do not make up products we don't have. If a user asks something completely unrelated to our business or industrial products, politely guide them back.`;

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: apiMessages,
      model: 'llama-3.1-8b-instant',
      temperature: 0.5,
    });

    res.json({ reply: chatCompletion.choices[0]?.message?.content || 'I am currently unable to answer.' });
  } catch (error) {
    console.error('Groq Chat Error:', error);
    res.status(500).json({ message: 'Error communicating with AI assistant', error: error.message });
  }
};

const getRecommendations = async (req, res) => {
  const { productId, productName } = req.body;
  if (!productId || !productName) return res.status(400).json({ message: 'ProductId and ProductName are required' });

  try {
    const products = await Product.find({ _id: { $ne: productId } }).select('name type size price');
    const prompt = `You are an industrial supply assistant. The user is currently viewing the product: "${productName}".
Based on this, suggest 4 related products from our catalog that they might also need or find useful. 
Here is our catalog: ${JSON.stringify(products)}.
Return ONLY a JSON array of the "_id" strings of the 4 best matching products. Do not include markdown or other text.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.5,
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || '[]';
    let matchedIds = [];
    try {
      const cleanJson = responseContent.replace(/```json/g, '').replace(/```/g, '').trim();
      matchedIds = JSON.parse(cleanJson);
    } catch (e) {
      console.error('Failed to parse Groq response:', responseContent);
    }

    if (!Array.isArray(matchedIds) || matchedIds.length === 0) {
      const fallback = await Product.find({ _id: { $ne: productId } }).limit(4);
      return res.json(fallback);
    }

    const recommended = await Product.find({ _id: { $in: matchedIds } });
    res.json(recommended);
  } catch (error) {
    console.error('Groq Recommendations Error:', error);
    res.status(500).json({ message: 'Error generating recommendations', error: error.message });
  }
};

const suggestProductsFromQuery = async (req, res) => {
  const { requirement } = req.body;
  if (!requirement) return res.status(400).json({ message: 'Requirement text is required' });

  try {
    const products = await Product.find({}).select('name type size');
    const prompt = `You are an industrial supply assistant for Sri Krishna Engineering.
The user is filling out a contact form and typed this requirement: "${requirement}".
Analyze their text and suggest up to 3 product types or specific product names from our catalog that they might be looking for.
Here is our catalog: ${JSON.stringify(products)}.
Return ONLY a JSON array of strings (e.g. ["Steel Flanges", "Connector Valve"]). No other text.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || '[]';
    let suggestions = [];
    try {
      const cleanJson = responseContent.replace(/```json/g, '').replace(/```/g, '').trim();
      suggestions = JSON.parse(cleanJson);
    } catch (e) {
      console.error('Failed to parse Groq suggestion:', responseContent);
    }

    res.json({ suggestions });
  } catch (error) {
    console.error('Groq Suggestion Error:', error);
    res.status(500).json({ message: 'Error generating suggestions', error: error.message });
  }
};

module.exports = { searchProducts, getDemandInsights, chatAssistant, getRecommendations, suggestProductsFromQuery };
