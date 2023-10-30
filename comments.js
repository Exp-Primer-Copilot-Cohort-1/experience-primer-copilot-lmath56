// Create web server
const http = require('http');
const server = http.createServer();
const { parse } = require('querystring');
const fs = require('fs');
const url = require('url');

// Create server
server.on('request', (req, res) => {
  // Get path
  var path = url.parse(req.url).pathname;
  console.log(path);
  // Check path
  if (path === '/comments' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      var data = parse(body);
      if (data['comment'] !== '') {
        fs.appendFile('comments.txt', data['comment'] + '\n', err => {
          if (err) throw err;
          console.log('Saved!');
        });
      }
      res.writeHead(302, { Location: '/' });
      res.end();
    });
  } else if (path === '/comments' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.readFile('comments.txt', 'utf8', (err, data) => {
      if (err) throw err;
      res.write(
        '<!DOCTYPE html><html><head><title>Comments</title></head><body><h1>Comments</h1><form action="/comments" method="post"><input type="text" name="comment" placeholder="Comment"><input type="submit" value="Submit"></form><br><a href="/">Home</a><br><br>'
      );
      res.write(data);
      res.end('</body></html>');
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(
      '<!DOCTYPE html><html><head><title>Home</title></head><body><h1>Home</h1><a href="/comments">Comments</a><br><br><a href="/about">About</a></body></html>'
    );
    res.end();
  }
});

// Start server
server.listen(3000, () => {
  console.log('Server started on port 3000...');
});