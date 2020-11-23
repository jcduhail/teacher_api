const MysqlService = require('../../services/mysql');
const Prices = require('../../models/prices');

/* GET users listing. */
module.exports = (req, res, next) => {
  const db = req.params.db;
  const mysql = new MysqlService(db);
  const prices = new Prices(mysql);
  const symbol = req.params.symbol;
  mysql.connect();
  prices.findBySymbol(symbol).then((rows) => {
    mysql.disconnect();
    res.json(Prices.format(rows));
  }).catch(err => next(err));
};
