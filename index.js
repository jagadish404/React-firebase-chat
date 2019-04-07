var app = require('express')();
var http = require('http').Server(app);
var fs = require('fs');

app.get('/', function(req, res){
  const index = fs.readFileSync(`${__dirname}/build/index.html`, 'utf8');
  res.send(index);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});