const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  // Add CORS headers for audio/media
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache');

  // Decode the URL to handle spaces and special characters
  let decodedUrl = decodeURIComponent(req.url);
  let filePath = path.join(__dirname, decodedUrl === '/' ? 'index.html' : decodedUrl);
  
  // Security: prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    console.log(`[BLOCKED] ${decodedUrl}`);
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  console.log(`[REQUEST] ${decodedUrl} -> ${filePath}`);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log(`[ERROR] File not found: ${filePath}`);
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    console.log(`[SUCCESS] Serving ${filePath} as ${contentType} (${data.length} bytes)`);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, 'localhost', () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
