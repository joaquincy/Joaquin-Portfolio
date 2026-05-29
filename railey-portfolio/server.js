// server.js — Local development server (not used by Vercel)
require('dotenv').config(); // Load .env for local development
const http = require('http');
const fs = require('fs');
const path = require('path');

const config = require('./config/api');
const { chat } = require('./services/aiService');

const PORT = config.server.port;

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

  // --- API ROUTE: POST /api/groq ---
  if (req.url === '/api/groq' && req.method === 'POST') {
    try {
      const body = JSON.parse(await readBody(req));
      const userMessage = body.message || '';
      const reply = await chat(userMessage);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, reply }));
    } catch (err) {
      console.error('API error:', err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Server error' }));
    }
    return;
  }

  // --- SERVE STATIC FILES from /public ---
  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
  serveStatic(res, filePath);
});

server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
