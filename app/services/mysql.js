const mysql = require('mysql');
const config = require('../../config/config');

class MysqlService {

  static formatFields(Model) {
    const modelName = Model.name;
    const fields = Model.getFields();
    const keys = Object.keys(fields);
    const formatedObject = [];
    keys.forEach((key) => {
      formatedObject.push(`${modelName}.${key} ${modelName}__${fields[key].name}`);
    });

    return formatedObject.join(', ');
  }

  constructor(prefix, db, suffix) {
	MysqlService.db = config.mysql.database;
	const conf = config.mysql;
    this.connected = false;
    this.mysqlConn = mysql.createConnection(conf);
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.mysqlConn.connect((err) => {
        if (err) {
          return reject(err);
        }

        this.connected = true;
        return resolve();
      });
    });
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      this.mysqlConn.end((err) => {
        if (err) {
          return reject(err);
        }

        this.connected = false;
        return resolve();
      });
    });
  }

  query(queryString, arg) {
    return new Promise((resolve, reject) => {
      if (arg) {
        return this.mysqlConn.query(queryString, arg, (err, rows) => {
          if (err) {
            return reject(err);
          }

          return resolve(rows);
        });
      }

      return this.mysqlConn.query(queryString, (err, rows) => {
        if (err) {
          return reject(err);
        }

        return resolve(rows);
      });
    });
  }
}


module.exports = MysqlService;
