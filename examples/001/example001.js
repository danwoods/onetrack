var http      = require('http'),
    path      = require('path'),
    url       = require('url'),
    fs        = require('fs'),
    log       = require('winston'),
    onetrack  = require('../../lib/onetrack.js');

var simpleServer = function(port, serve, mimetype){

  var serveStatic = function(req, res){
    // Variables
    //var uri = decodeURI(url.parse(req.url).pathname),
    var    clientPathStr = process.cwd() + '/';
    //    filename = '';

      // Create filename
      //filename = path.join(clientPathStr, uri); 
      var filename = path.join(clientPathStr, serve); 
      //filename = serve;
      // If requested file exist
      if(!fs.existsSync(filename)){
        log.error("simpleServer[port|"+port+"]::serveStatic, looking for non-existing file '"+filename+"'");
      }
      else{
        res.writeHead(200, mimetype);
        var fileStream = fs.createReadStream(filename);
        fileStream.pipe(res);
        log.info("simpleServer[port|"+port+"]::serveStatic, served static file '"+filename+"'");
      }

  };

  this.init = function(){
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
    }).listen(port, '0.0.0.0');
    log.info('Server running at http://127.0.0.1:'+port+'/');
  };

};

var client = new simpleServer(8080, 'index.html', 'text/html');
var imgServer = new simpleServer(8008, 'default.jpg', 'image/jpeg');
var jsServer = new simpleServer(3003, 'default.js', 'text/javascript');

jsServer.init();
imgServer.init();
onetrack.init();
client.init();
