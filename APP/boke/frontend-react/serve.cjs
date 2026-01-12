const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.jsx': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
};

const port = 3001;

http.createServer((req, res) => {
    let url = req.url.split('?')[0];
    let filePath = path.join(process.cwd(), url === '/' ? 'index.html' : url);
    
    // Simple SPA support: if file doesn't exist, try index.html
    if (!fs.existsSync(filePath)) {
        filePath = path.join(process.cwd(), 'index.html');
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('Not Found');
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*' 
            });
            res.end(content);
        }
    });
}).listen(port, () => {
    console.log(`Boke static server running at http://localhost:${port}`);
});
