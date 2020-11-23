const fs = require('fs');
const https = require("http");
const config = require('../config/config');

/* MT5 cron */

class MT5{

	call(method, args) {
	    if (typeof this[method] !== 'undefined') {
	      this[method](...args);
	    }
	}	
	
	getPrices(kind){
		return new Promise((resolve,reject)=>{
			var last_spread_time = Date.now();
			var start = last_spread_time;
			var reset = false;

			const req = https.get(config.mt5.mt5_api_url+"?kind="+kind, response => {
			    var body = '';
			    response.on('data', function(chunk){
			        body += chunk;
			    });
			    response.on('error',function(e){
			    	console.log(e);
			    });
			    response.on('end', function(){
			    	const ret = JSON.parse(body);
			    	if(ret['success']==true && ret['res']){
				        var tick = ret['res'].result;
				        var spreads = {};
				        var current;
			
				        if(fs.existsSync(config.mt5.mt5_rep+'/mt5_spread_'+kind+'.json')){
				        	var json = fs.readFileSync(config.mt5.mt5_rep+'/mt5_spread_'+kind+'.json','utf8');		        	
				        	var current_spread = JSON.parse(json);
					        console.log('last time = '+current_spread['time']+'; time = '+last_spread_time);
					        console.log('time since exec : '+(last_spread_time - current_spread['time'])/1000);

				        	if((last_spread_time - current_spread['time']) < 24*60*60*1000){
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
				        
				        fs.writeFile(config.mt5.mt5_rep+'/mt5_spread_'+kind+'.json', JSON.stringify({'time':last_spread_time,'spreads':spreads}), (err) => {  
				            if (err) throw err;
				            console.log('File saved');
				    		console.log('exec time = '+((Date.now()-start)/1000));
				    		req.end();
				    		return resolve();
				        });	        
			    	}
			    });
			});
		}).then(setTimeout(function(){ exec(); }, config.mt5.mt5_update_delay));
	}
}

//--- Execution ---
function exec(){
	const methodName = process.argv[2];
	const args = process.argv.slice(3);
	if (typeof methodName === 'undefined') {
	  console.log('unknown method');
	}

	const mt5 = new MT5();
	mt5.call(methodName, args);
	//setInterval(function(){mt5.call(methodName, args)},config.mt5.mt5_update_delay);
	
}

exec();
