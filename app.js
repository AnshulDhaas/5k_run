const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3000;

const users = {};

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/signup') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const userData = JSON.parse(body);
                const username = userData.user_name;
                const password = userData.pass_word;

                // Add user data to the dictionary using the username as the key
                users[username] = { password: password };

                console.log(`Sign-up successful for user: ${username}`); // Log the successful sign-up
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User registered successfully' }));
            } catch (error) {
                console.error('Error parsing JSON:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON' }));
            }
        });

        req.on('error', (error) => {
            console.error('Error with the request:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Server error' }));
        });
    } else {
        let filePath = '.' + req.url;
        if (filePath === './') {
            filePath = './index.html';
        }

        const extname = String(path.extname(filePath)).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.wasm': 'application/wasm'
        };

        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    fs.readFile('./404.html', (err, data) => {
                        if (err) {
                            console.error('Error reading 404.html:', err);
                            res.writeHead(500, { 'Content-Type': 'text/html' });
                            res.end('Server Error');
                        } else {
                            res.writeHead(404, { 'Content-Type': 'text/html' });
                            res.end(data, 'utf-8');
                        }
                    });
                } else {
                    console.error('File system error:', error);
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end('Server Error');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
});

server.listen(port, (error) => {
    if (error) {
        console.log('Something went wrong', error);
    } else {
        console.log("Server is listening on port " + port);
    }
});
