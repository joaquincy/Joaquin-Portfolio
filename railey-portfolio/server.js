// server.js — zero dependencies, plain Node.js only
const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

const PORT = process.env.PORT || 3000;
const GROQ_API_KEY = process.env.GROQ_API_KEY; // loaded from .env manually or via process.env

// Helper: read body from POST request
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

// Helper: serve static files from /public
function serveStatic(res, filePath) {
  const extMap = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
  };
  const ext = path.extname(filePath);
  const contentType = extMap[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- API: Groq AI endpoint (stub — wire up when ready) ---
  if (req.method === 'POST' && req.url === '/api/groq') {
    try {
      const body = JSON.parse(await readBody(req));
      const userMessage = body.message || '';

      // TODO: Replace stub below with real Groq API call
      // const groqResponse = await callGroq(userMessage);

      // STUB RESPONSE (replace later)
      const stub = {
        success: true,
        reply: `Groq AI stub received: "${userMessage}" — wire up GROQ_API_KEY to activate.`
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(stub));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Server error' }));
    }
    return;
  }

  // --- SERVE STATIC FILES from /public ---
  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
  serveStatic(res, filePath);
});

// Drop-in Groq API call using Node.js built-in https (for later use)
async function callGroq(userMessage) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: userMessage }]
    });

    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`🔑 Groq API Key: ${GROQ_API_KEY ? 'Loaded' : 'Not set — add to .env'}`);
});
