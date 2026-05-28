// config/api.js — Central config for all external API services
// Reads secret keys from .env and exports clean, reusable config objects

module.exports = {
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    model: 'llama-3.3-70b-versatile',
    baseUrl: 'api.groq.com',
    path: '/openai/v1/chat/completions'
  },
  server: {
    port: process.env.PORT || 3000
  }
};
