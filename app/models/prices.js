const moment = require('moment');

const CRUD = require('./_crud');
const MysqlService = require('../services/mysql');

class Prices extends CRUD {
  static getDbName() {
    return MysqlService.db+'_prices';
  }

  static getModels() {
    return {
      Prices,
    };
  }

  static getFields() {
	switch(MysqlService.db){
		case 'mt4':
		    return {
		      SYMBOL: { name: 'SYMBOL', type: 'VARCHAR', length: 16 },
		      TIME: { name: 'TIME', type: 'DATETIME', length: 32 },
		      BID: { name: 'BID', type: 'DOUBLE' },
		      ASK: { name: 'ASK', type: 'DOUBLE' },
		      LOW: { name: 'LOW', type: 'DOUBLE' },
		      HIGH: { name: 'HIGH', type: 'DOUBLE' },
		      DIRECTION: { name: 'DIRECTION', type: 'INT', length: 11},
		      DIGITS: { name: 'DIGITS', type: 'INT', length: 11},
		      SPREAD: { name: 'SPREAD', type: 'INT', length: 11},
		      MODIFY_TIME: { name: 'MODIFY_TIME', type: 'DATETIME'},
		    };
	  		break;

		case 'mt5':
		default:
		    return {
		      Price_ID: { name: 'Price_ID', type: 'INT', length: 20 },
		      Symbol: { name: 'Symbol', type: 'VARCHAR', length: 32 },
		      Digits: { name: 'Digits', type: 'INT', length: 10 },
		      BidDir: { name: 'BidDir', type: 'INT', length: 10 },
		      AskDir: { name: 'AskDir', type: 'INT', length: 10 },
		      LastDir: { name: 'LastDir', type: 'INT', length: 10 },
		      Time: { name: 'Time', type: 'DATETIME'},
		      BidLast: { name: 'BidLast', type: 'DOUBLE'},
		      BidHigh: { name: 'BidHigh', type: 'DOUBLE'},
		      BidLow: { name: 'BidLow', type: 'DOUBLE'},
		      AskLast: { name: 'AskLast', type: 'DOUBLE'},
		      AskHigh: { name: 'AskHigh', type: 'DOUBLE'},
		      AskLow: { name: 'AskLow', type: 'DOUBLE'},
		      LastLast: { name: 'LastLast', type: 'DOUBLE'},
		      LastHigh: { name: 'LastHigh', type: 'DOUBLE'},
		      LastLow: { name: 'LastLow', type: 'DOUBLE'},
		    };
			break;
	  }
  }

  static getQueries() {
    return {
      find_by_symbol: `SELECT ${MysqlService.formatFields(Prices)} 
    	  			   FROM ${Prices.getDbName()} ${Prices.name} 
    	  			   WHERE TRIM(${Prices.name}.Symbol)=?`,
      find_all: `SELECT ${MysqlService.formatFields(Prices)} 
      	  	     FROM ${Prices.getDbName()} ${Prices.name}
      	  	     ORDER BY ${Prices.name}.Symbol ASC`,
    };
  }

  format(modelData) {
    return CRUD.format(Prices.getModels(), modelData);
  }
  
  static format(modelData) {
    return CRUD.format(Prices.getModels(), modelData);
  }
  
  constructor(mysql) {
    super(mysql, Prices);

    this.mysql = mysql;
  }

  findBySymbol(symbol) {
    return new Promise((resolve, reject) => {
      return this.mysql.query(this.getQuery('find_by_symbol'), symbol)
        .then((rows) => {
          if (rows.length < 1) {
            const notFound = new Error('No Prices for this symbol');
            notFound.status = 404;
            return reject(notFound);
          }
          return resolve(rows);
        })
        .catch(reject);
    })
  }

  findAll() {
    return new Promise((resolve, reject) => {
      return this.mysql.query(this.getQuery('find_all'))
        .then((rows) => {
          if (rows.length < 1) {
            const notFound = new Error('No Prices');
            notFound.status = 404;
            return reject(notFound);
          }
          return resolve(rows);
        })
        .catch(reject);
    })
  }
  
}

module.exports = Prices;