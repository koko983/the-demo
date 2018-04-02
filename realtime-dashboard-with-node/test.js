const http = require('http');
const hostname = '127.0.0.1';
const port = 80;

var count = 0;
const server = http.createServer((req, res) => {
  count++;
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(`Count: ${count} \n`);
});

server.listen(port, () => {
  console.log(`Server running at ${port}`);
});