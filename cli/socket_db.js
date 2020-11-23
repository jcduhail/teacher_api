let count = 0;
const util = require('util')
const WebSocket = require('ws')
const ws = new WebSocket('wss://sandbox.qcpotc.com/indicPrice')
const fs = require('fs');
const accept_coins = ["BTC", "ETH", "XRP", "USDT", "USD", "JPY", "EUR"];

const config = {
//    path: '/home/www/domains/dev10.cextrans.com/public_html/front/json_stats/symbols.json',
    path: '/home/zeong/htdocs/front/json_stats/symbols.json',
};

const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit : 10,
    host     : 'cxtrans-1.cluster-czrrrknj22ob.us-west-2.rds.amazonaws.com',
    user     : 'devadmin',
    password : 'hdje3K89sWLjdcS91',
    database : 'cextrans_common',
    debug    :  false
});

function execTrans(symbols) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return ;
        }
        connection.beginTransaction(function (err) {
            if (err) {
                return ;
            }

			if (symbols)
			{
				let isNow = new Date();
				let isTimeStamp = Math.floor(isNow / 1000);
				for(var key in symbols) {
					if (symbols[key].hasOwnProperty('Base') && symbols[key].hasOwnProperty('Quote') && symbols[key].hasOwnProperty('Buy') && symbols[key].hasOwnProperty('Sell'))
					{
						let data = symbols[key];
						if (accept_coins.includes(data.Base) && accept_coins.includes(data.Quote))
						{
							let valueFormat = '(base, quote, buy, sell, timestamp_at) VALUES (?,?,?,?,?)';
							let valueQuery = mysql.format(valueFormat,[data.Base,data.Quote,data.Buy,data.Sell,isTimeStamp]);
							let historicalQuery = 'INSERT INTO crypto_historical_data ' + valueQuery;
							connection.query(historicalQuery,(err, response) => {
								if(err) {
									console.log("data error: " + err);
									connection.rollback(function (err) {
										console.log("data rollback error: " + err);
										connection.release();
										return;
									});
								}
								//console.log('HDID: ' + response.insertId + '. Symbol: ' + data.Base + '/' + data.Quote + ', Buy ' + data.Buy + ', Sell ' + data.Sell);
							});
//							let indicativeQuery = 'INSERT INTO crypto_historical_last ' + valueQuery + ' ON DUPLICATE KEY UPDATE buy = VALUES(buy), sell = VALUES(sell), update_at = ' + connection.escape(isNow) + ', timestamp_at = VALUES(timestamp_at)';
							let updateFormat = "UPDATE crypto_historical_last SET buy =?, sell=?, update_at=?, timestamp_at=? WHERE base=? AND quote=?";
							let updateQuery = mysql.format(updateFormat,[data.Buy, data.Sell, isNow, isTimeStamp, data.Base, data.Quote]);
							connection.query(updateQuery,(err, response) => {
								if(err) {
									console.log("update error: " + err);
									connection.rollback(function (err) {
										console.log("update rollback error: " + err);
										connection.release();
										return;
									});
								}
								//console.log('AffectedRows: ' + response.affectedRows + '. Symbol: ' + data.Base + '/' + data.Quote + ', Buy ' + data.Buy + ', Sell ' + data.Sell);
								if (response.affectedRows === 0)
								{
									let indicativeQuery = 'INSERT INTO crypto_historical_last ' + valueQuery;
									connection.query(indicativeQuery,(err, response) => {
										if(err) {
											console.log("last error: " + err);
											connection.rollback(function (err) {
												console.log("last rollback error: " + err);
												connection.release();
												return ;
											});
										}
										//console.log('IDID: ' + response.insertId + '. Symbol: ' + data.Base + '/' + data.Quote + ', Buy ' + data.Buy + ', Sell ' + data.Sell);
									});
								}
							});
						}
					}
				}
				connection.commit(function (err, info) {
					//console.log("commit info: " + JSON.stringify(info));
					if (err) {
						console.log("commit failed: " + err);
						connection.rollback(function (err) {
							console.log("commit error: " + err);
							connection.release();
							return ;
						});
					} else {
						connection.release();
						return ;
					}
				})
			}
        });
    });
}

ws.on('message', (message) => {
	//console.log(new Date() + ': ')
	if (message && message.length > 20)
	{
		let isNow = new Date();
		let isTimeStamp = Math.floor(isNow / 1000);
		fs.writeFile(config.path, message, (err) => {  
			if (err) throw err;
		});
		symbols = JSON.parse(message)
		if (symbols)
		{
			execTrans(symbols, function(err, info){
			if(err){
			   console.error("failed.");
			}else{
			   console.log("done.");
			}
			})
		}
	}
})
