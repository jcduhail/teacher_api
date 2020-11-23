const fs = require('fs');
const request = require('request');
const querystring = require('querystring');

// conf
var currencies = ['BTC', 'XRP', 'ETH', 'USDT'];
var json_file = 'D:/src/api/qcpotc.json';
var url_update = 'https://dev10.cextrans.com/wk4/admin/crypto_historical/';

// init websocket client
var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();

var start = Date.now();
var nb_calls = 0;
var json_datas = []; 

// for test
currencies = ['BTC', 'USD', 'ETH'];

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});
 
client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
        	nb_calls ++;
        	var data = JSON.parse(message.utf8Data);
			//console.log(message.utf8Data);
        	data.forEach(element => {
        		if(currencies.includes(element.Base) && currencies.includes(element.Quote)){
        			json_datas.push(element);
        		}
        	});
        	console.log(json_datas);
        	// Update DB
        	/*var postData={
        			json_data:JSON.stringify(json_datas)
        		};
        	
        	request.post({
        		uri:url_update+'crypto_historical_update',
        		headers:{'content-type': 'application/x-www-form-urlencoded'},
        		body:querystring.stringify(postData)
        		},function(err,res,body){
        			console.log(body);
        			console.log(res.statusCode);
        	});
        	
        	// Write json
	        fs.writeFile(json_file, JSON.stringify(json_datas), (err) => {  
	            // throws an error, you could also catch it here
	            if (err) throw err;

	            // success case, the file was saved
	            console.log('File saved');
	        });*/	        
        	
    		console.log(nb_calls+' calls; refresh time = '+((Date.now()-start)/1000));
    		start = Date.now();
    		json_datas = [];
        }
    });
});

client.connect('wss://sandbox.qcpotc.com/indicPrice');