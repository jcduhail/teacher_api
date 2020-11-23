const fs = require('fs');
const https = require("https");

/* MT5 cron */
module.exports = (req, res, next) => {

	var last_spread_time = Date.now();
	var reset = false;
	
	https.get("https://devsecure7.bitwallet.com/sys47/ja/mt5_api/MT5_ShiftFX_Test_Use.php?kind=std", response => {
	    var body = '';

	    response.on('data', function(chunk){
	        body += chunk;
	    });

	    response.on('end', function(){
	    	ret = JSON.parse(body);
	    	if(ret['success']==true){
		        var tick = ret['res'].result;
		        var spreads = {};
		        var current;
		        //console.log(tick);
	
		        if(fs.existsSync('D:/src/api/mt5_spread_std.json')){
		        	var json = fs.readFileSync('D:/src/api/mt5_spread_std.json','utf8');		        	
		        	var current_spread = JSON.parse(json);

		        	if((last_spread_time - current_spread['time']) < 24*60*60){
			            last_spread_time = current_spread['time'];
			        }else{
			            reset = true;
			        }
			        
			        for(var k in tick){
		        		if(tick[k].symbol.trim()==''){
		        			continue;
		        		}
			            
		        		current = parseFloat(((tick[k].ask - tick[k].bid)*1000).toFixed(2));
			            var spread = current_spread['spreads'][tick[k].symbol];
			            var nb_spread = spread['nb_spread'];
			            var avg = spread['avg'];
			            if(current != spread['current']){
			                nb_spread++;
			                avg = parseFloat(((spread['avg']*(nb_spread-1) + current)/nb_spread).toFixed(2));
			            }
			            
			            if(nb_spread>1){
			            	var lowest = (current < spread['lowest'] && current > 0 ?current:spread['lowest']);
			                spreads[tick[k].symbol] = {
			                    'nb_spread': reset?1:nb_spread,
			   	                'ask': parseFloat(tick[k].ask),
			   	                'bid': parseFloat(tick[k].bid),
			                    'current': current,
			                    'avg': avg,
			                    'lowest': parseFloat(lowest.toFixed(2)),
			                    'best': parseFloat((current > spread['best']?current:spread['best']).toFixed(2)),
			   	                'short': parseFloat(tick[k].short),
			   	                'long': parseFloat(tick[k].long)
			                };
			            }else{
			                spreads[tick[k].symbol] = {
			                    'nb_spread': 1,
			   	                'ask': parseFloat(tick[k].ask),
			   	                'bid': parseFloat(tick[k].bid),
			                    'current': current,
			                    'avg': current,
			                    'lowest': current,
			                    'best': current,
			   	                'short': parseFloat(tick[k].short),
			   	                'long': parseFloat(tick[k].long)
			                };
			            }
			        }		        	
		        }else{
		        	for(var k in tick){
		        		if(tick[k].symbol.trim()==''){
		        			continue;
		        		}
		        		current = parseFloat(((tick[k].ask - tick[k].bid)*1000).toFixed(2));
		   	            spreads[tick[k].symbol] = {
		   	                'nb_spread': 1,
		   	                'ask': parseFloat(tick[k].ask),
		   	                'bid': parseFloat(tick[k].bid),
		   	                'current': current,
		   	                'avg': current,
		   	                'lowest': current,
		   	                'best': current,
		   	                'short': parseFloat(tick[k].short),
		   	                'long': parseFloat(tick[k].long)
		   	            };
		        	}
		        }
		        
		        fs.writeFile('D:/src/api/mt5_spread_std.json', JSON.stringify({'time':last_spread_time,'spreads':spreads}), (err) => {  
		            // throws an error, you could also catch it here
		            if (err) throw err;
	
		            // success case, the file was saved
		            console.log('File saved');
		        });	        
		        
		    	res.json(JSON.parse(body));
	    	}else{
	    		res.json('{error}');
	    	}
	    		
	    });
	});
};
