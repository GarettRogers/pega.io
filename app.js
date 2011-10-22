/* CONFIGURATION */

/* Web Server Config */
var _postpath = '/send';
var _listenport = 8888;
var _listenaddr = '0.0.0.0';  //use '0.0.0.0' to listen on all interfaces

/* Slave (sub) Redis Server Config */
var _channelfilter = '*';
var _sub_db_addr = '127.0.0.1';
var _sub_db_passwd_protected = true;
var _sub_db_passwd = 'bbstreamserver';
var _sub_db_port = 6379;  //default redis port is 6379

/* Master (pub) Redis Server Config */
var _pub_db_addr = '127.0.0.1';
var _pub_db_passwd_protected = true;
var _pub_db_passwd = 'bbstreamserver';
var _pub_db_port = 6379;  //default redis port is 6379

/* SocketIO Config */
var _loglevel = 1;

/* simple-pub-sub Config */
var _secretkey = "mysecret";


/* SERVER CODE -- DO NOT MODIFY */
redis = require('redis');
express = require('express');
socketio = require('socket.io');
fs = require("fs"),
pub = redis.createClient(_pub_db_port, _pub_db_addr); if (_pub_db_passwd_protected) { pub.auth(_pub_db_passwd) }

sub = redis.createClient(_sub_db_port, _sub_db_addr); if (_sub_db_passwd_protected) { sub.auth(_sub_db_passwd) }
sub.on("pmessage", function(pattern, channel, json) { io.sockets.volatile.emit(channel, JSON.parse(json)); });
sub.psubscribe('*');

app = express.createServer(express.static(__dirname + '/public'),express.bodyParser());
//app = express.createServer(express.bodyParser());
app.listen(_listenport, _listenaddr);
app.get("/install.sh", function(req, res){
        fs.readFile(__dirname + "/public/install.sh", "binary", function(err, file) {

         // File could not be read, return a 500 error.
         if (err) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            res.write(err+"\n");
            res.end();
            return;
         }

         // File was found, and successfully read from the file system.
         // Return a 200 header and the file as binary data.
        res.writeHead(200, {"Content-Length":String(file.length),"Accept-Ranges":"bytes","Content-Type": "text/plain"});
         res.write(file, "binary");

         // End the response.
         res.end();
      });
  //res.sendfile(__dirname + "/public/install.sh");
});
app.post(_postpath, function(req, res){
  if(req.body.secretkey==_secretkey){
    delete req.body.secretkey; pub.publish(req.body.channel, JSON.stringify(req.body))
  }
});


io = socketio.listen(app);
io.configure(function () { io.set('log level', _loglevel) });

