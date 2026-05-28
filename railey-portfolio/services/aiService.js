const https = require('https');
const config = require('../config/api');
const persona = require('../config/persona');

/**
 * Send messages to the Groq API and get an AI response.
 * @param {Array} messages - Array of message objects with { role, content }
 * @returns {Promise<object>} - The parsed JSON response from Groq
 */
function askGroq(messages) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: config.groq.model,
      messages: messages
    });

    const options = {
      hostname: config.groq.baseUrl,
      path: config.groq.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.groq.apiKey}`,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(new Error('Failed to parse Groq response'));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

/**
 * Simple wrapper: send a plain string, get a plain string back.
 * Injects the system persona automatically.
 * @param {string} userMessage - The user's message
 * @returns {Promise<string>} - The AI's reply text
 */
async function chat(userMessage) {
  const response = await askGroq([
    { role: 'system', content: persona },
    { role: 'user', content: userMessage }
  ]);
  return response.choices?.[0]?.message?.content || 'No response from AI.';
}

module.exports = { chat };
