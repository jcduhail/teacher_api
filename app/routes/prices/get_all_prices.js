const MysqlService = require('../../services/mysql');
const Prices = require('../../models/prices');

/* GET users listing. */
module.exports = (req, res, next) => {
  const prefix = req.params.prefix;
  const db = req.params.db;
  const live = req.params.live;
  const mysql = new MysqlService(prefix,db,live);
  const prices = new Prices(mysql);
  mysql.connect();
  prices.findAll().then((rows) => {
    mysql.disconnect();
    res.json(Prices.format(rows));
  }).catch(err => next(err));
};
