// services/aiService.js — Groq AI chat service using the official SDK

const Groq = require('groq-sdk');
const config = require('../config/api');
const persona = require('../config/persona');

// Initialize the Groq client with the API key from config
const groq = new Groq({ apiKey: config.groq.apiKey });

/**
 * Send a plain string message and get an AI reply back.
 * Injects the system persona automatically.
 * @param {string} userMessage - The user's message
 * @returns {Promise<string>} - The AI's reply text
 */
async function chat(userMessage) {
  const completion = await groq.chat.completions.create({
    model: config.groq.model,
    messages: [
      { role: 'system', content: persona },
      { role: 'user', content: userMessage }
    ],
  });

  return completion.choices?.[0]?.message?.content || 'No response from AI.';
}

module.exports = { chat };
