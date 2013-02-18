var http    = require('http'),
    Browser = require('zombie'),
    url     = require('url'),
    path    = require('path'),
    fs      = require('fs'),
    log     = require('winston');

var launch_browser = function(){
  var browser = new Browser();
  browser.visit("http://localhost:1337/index.html", {"debug": true}, function (e, browser, status) {
    log.info('e::'+e);
    log.info('status::'+status);
    if (browser.error ){
      log.error("Errors reported:", browser.errors);
    }
  });
  // Zombie doesn't make request for images, so this is the work around
  browser.visit("http://localhost:8008/default.jpg");
};


var serve_static = function(req, res){
  log.info("in serve static");
  // Variables
  var uri = decodeURI(url.parse(req.url).pathname),
      clientPathStr = process.cwd() + '/',
      filename = '';

    // Create filename
    filename = path.join(clientPathStr, uri); 
    // If requested file exist
    if(!fs.existsSync(filename)){
      log.error("script-server/server.js::serveStatic, looking for non-existing file '"+filename+"'");
    }
    else{
      var mimeType = "text/html";
      res.writeHead(200, mimeType);
      var fileStream = fs.createReadStream(filename);
      fileStream.pipe(res);
      log.info("script-server/server.js::serveStatic, served static file '"+filename+"'");
    }

};

// Start Server
http.createServer(function (req, res) {
  req.chunks = [];
  req.on('data', function (chunk) {
    req.chunks.push(chunk.toString());
  });
  req.url = decodeURI(req.url);
  log.info(req.url);
  if(req.url === "/"){
    launch_browser();
  }
  else{
    serve_static(req, res);
  }
}).listen(1337, '0.0.0.0');
log.info('onetrack.js::Server running at http://127.0.0.1:1337/');
