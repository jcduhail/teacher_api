const net = require('net');
//const io = require('socket.io-client');

/* MT5 connection */
module.exports = (req, res, next) => {
	var host = 'dealfx51.fxservers.net';
	var port = 443;
	var data = {'SYMBOL':'*'};
	var prefix_webapi = 'MT5WEBAPI%04x%04x';
	var query = '002a00030TICK_LAST|SYMBOL=*|\r\n';
	var querylen = 51;
	var qauth = 'MT5WEBAPI00a200010AUTH_START|VERSION=1755|AGENT=WebAPI|LOGIN=2222|TYPE=MANAGER|CRYPT_METHOD=NONE|';
	var qauthlen = 180;
	
	//qauth = 'MT5WEBAPI00a200010A U T H _ S T A R T | V E R S I O N = 1 7 5 5 | A G E N T = W e b A P I | L O G I N = 2 2 2 2 | T Y P E = M A N A G E R | C R Y P T _ M E T H O D = N O N E |';
	let buffer = Buffer.from(qauth, 'utf8');
	qauth = buffer.toString('utf16le');
	
	//buffer = Buffer.from(qauth, 'utf16le');
	//qauth = buffer.toString('utf8');
	
	console.log(qauth);
	// TICK_LAST
	var socket = new net.Socket({allowHalfOpen: true});
	socket.setEncoding('utf16le');
	console.log(socket.bufferSize);
	console.log(socket);
	socket.connect (port, host, function() {
	    console.log('CONNECTED TO: ' + host + ':' + port);

	    /*var ret = socket.write(qauth,'UTF8',function(error,data){
	    	console.log('write data auth');
		    socket.on('data', function(d){
				console.log('receive data');
			    console.log(d.toString());
			});
	    	
	    	console.log(data);
	    	console.log(error);
	    	//console.log(socket);
	    });
	    
	    console.log('ret='+ret);*/
	    
	    /*socket.write(query,'UTF8',function(){
	    	console.log('write data query');
	    });*/
	    //socket.end();
	});

	socket.on('connect', function(d){
		console.log('CONNEXION OK');
		socket.write('hello');
	    socket.write(qauth,'utf16le',function(error,data){
	    	console.log(socket.bytesRead);
	    	console.log('write data auth on connect');
	    });
	});
	//console.log(socket);
	socket.on('data', function(d){
		console.log('receive data');
	    console.log(d.toString());
	    socket.destroy();
	});
	socket.on('drain', function(d){
		console.log('drain');
		console.log(d);
	});
	socket.on('lookup', function(d){
		console.log('lookup');
		console.log(d);
	});
	socket.on('ready', function(d){
		console.log('ready');
		console.log(d);
	    socket.write(qauth,'utf16le',function(error,data){
	    	console.log('write data auth on ready');
	    });

	});
	socket.on('timeout', function(d){
		console.log('timeout');
		console.log(d);
	});
	socket.on('close', function(){
		console.log('Connection closed')
	});
	socket.on('end', (e) => {
	  console.log('Connection ended');
	  console.log(e);
	});	
	socket.on('error', function(e){
		console.log(e);
	});
	
	// Socket.io
	/*const socketio = io.connect('dealfx51.fxservers.net:443');
	socketio.on('connect', () => {
		  console.log('Successfully connected!');
		});*/	
	//console.log('io connect');
	//console.log(socketio);
	
	/*const client = net.createConnection('443','dealfx51.fxservers.net', () => {
	  console.log('connected to server!');
	  client.write(qauth,(e)=>{
		  console.log('data sent : '+qauth);
		  console.log(e);
	  });
	});
	  client.write(qauth,(e)=>{
		  console.log('data sent : '+qauth);
		  console.log(e);
	  });
	client.on('data', (data) => {
	  console.log('data received');
	  console.log(data.toString());
	  client.end();
	});
	  console.log(client);
	client.on('end', () => {
	  console.log('disconnected from server');
	});	
	client.on('error', (e) => {
	  console.log(e);
	});*/	
	
	res.json('{mt5:connect}');
};
