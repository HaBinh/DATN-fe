const express = require('express');
const http = require('http');
const path = require('path');

const forceSSL = function() {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(
       ['https://', req.get('Host'), req.url].join('')
      );
    }
    next();
  }
}

const app = express();

app.use(express.static(path.join(__dirname,'dist')));
app.use(forceSSL());

app.get('*', (req,res) => {
	res.sendFile(path.join(__dirname,'dist/index.html'));
});

const port = process.env.PORT || '3001';

app.set('port', port);


const server = http.createServer(app);
server.listen(port, () => console.log('Running'));
