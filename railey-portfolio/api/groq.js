// api/groq.js — Vercel Serverless Function for the Groq API Endpoint

const { chat } = require('../services/aiService');

module.exports = async function handler(req, res) {
  // Allow preflight OPTIONS requests for CORS (Vercel usually handles this, but it's safe to have)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Vercel automatically parses the JSON body, so req.body is already an object
    const userMessage = req.body.message || '';

    // Call the Groq service
    const reply = await chat(userMessage);

    // Send the response back
    return res.status(200).json({ success: true, reply });
  } catch (err) {
    console.error('API error:', err.message);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};
