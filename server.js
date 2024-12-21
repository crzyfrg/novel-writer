const http = require('http');
    const fs = require('fs');
    const path = require('path');
    const personaManager = require('./persona');
    const gemini = require('./gemini');

    const port = 3000;

    const server = http.createServer(async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
        return;
      }

      if (req.url === '/') {
        const filePath = path.join(__dirname, 'index.html');
        fs.readFile(filePath, (err, content) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
          }
        });
      }
      else if (req.url === '/personas' && req.method === 'GET') {
        const personas = await personaManager.getPersonas();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(personas));
      } else if (req.url === '/personas' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
              body += chunk;
          });
          req.on('end', async () => {
              try {
                  const { name, description } = JSON.parse(body);
                  await personaManager.addPersona(name, description);
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ message: 'Persona added successfully' }));
              } catch (error) {
                  res.writeHead(400, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Invalid JSON' }));
              }
          });
      } else if (req.url === '/generate' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', async () => {
          try {
            const { apiKey, persona, context, prompt } = JSON.parse(body);
            const response = await gemini.generateText(apiKey, persona, context, prompt);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ response }));
          } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
          }
        });
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    });

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
