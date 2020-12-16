const CRUD = require('./_crud');
const MysqlService = require('../services/mysql');

class Teacher extends CRUD {
  static getDbName() {
    return 'teacher';
  }

  static getModels() {
    return {
      Teacher,
    };
  }

  static getFields() {
	return {
	  ID: { name: 'id', type: 'INT' },
	  EMAIL: { name: 'email', type: 'VARCHAR', length: 64 },
	};
  }

  static getQueries() {
    return {
      find_by_email: `SELECT ${MysqlService.formatFields(Teacher)} 
    	  			   FROM ${Teacher.getDbName()} ${Teacher.name} 
    	  			   WHERE TRIM(${Teacher.name}.email)=?`,
      find_all: `SELECT ${MysqlService.formatFields(Teacher)} 
      	  	     FROM ${Teacher.getDbName()} ${Teacher.name}
      	  	     ORDER BY ${Teacher.name}.id ASC`,
    };
  }

  format(modelData) {
    return CRUD.format(Teacher.getModels(), modelData);
  }
  
  static format(modelData) {
    return CRUD.format(Teacher.getModels(), modelData);
  }
  
  constructor(mysql) {
    super(mysql, Teacher);

    this.mysql = mysql;
  }

  findByEmail(email) {
    return new Promise((resolve, reject) => {
      return this.mysql.query(this.getQuery('find_by_email'), email)
        .then((rows) => {
          if (rows.length < 1) {
            const notFound = new Error('No Teacher for this email');
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
            const notFound = new Error('No Teacher');
            notFound.status = 404;
            return reject(notFound);
          }
          return resolve(rows);
        })
        .catch(reject);
    })
  }
  
}

module.exports = Teacher;