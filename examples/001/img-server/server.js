
var http  = require('http'),
    path  = require('path'),
    url   = require('url'),
    fs    = require('fs'),
    log   = require('winston');


var serveStatic = function(req, res){
  log.info("in serve static");
  // Variables
  var uri = decodeURI(url.parse(req.url).pathname),
      //clientPathStr = process.cwd() + '/client/',
      clientPathStr = process.cwd() + '/',
      filename = '';

  // Only try to serve/access files which are either client or audio files
    // Create filename
    filename = path.join(clientPathStr, uri); 
    // If requested file exist
    if(!fs.existsSync(filename)){
      log.error("img-server/server.js::serveStatic, looking for non-existing file '"+filename+"'");
    }
    else{
      var mimeType = "image/jpeg";
      res.writeHead(200, mimeType);
      var fileStream = fs.createReadStream(filename);
      fileStream.pipe(res);
      log.info("img-server/server.js::serveStatic, served static file '"+filename+"'");
    }

};


// Start Server
http.createServer(function (req, res) {
  req.chunks = [];
  req.on('data', function (chunk) {
    log.info('req.on');
    req.chunks.push(chunk.toString());
  });
  req.url = decodeURI(req.url);
  log.info(req.url);
  serveStatic(req, res);
}).listen(8008, '0.0.0.0');
log.info('img-server/server.js::Server running at http://127.0.0.1:8008/');
