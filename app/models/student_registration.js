const CRUD = require('./_crud');
const MysqlService = require('../services/mysql');

class StudentRegistration extends CRUD {
  static getDbName() {
    return 'student_registration';
  }

  static getModels() {
    return {
      StudentRegistration,
    };
  }

  static getFields() {
	return {
	  ID: { name: 'id', type: 'INT' },
	  TEACHER_ID: { name: 'teacher_id', type: 'INT' },
	  STUDENT_ID: { name: 'student_id', type: 'INT' },
	};
  }

  static getQueries() {
    return {
      find_by_symbol: `SELECT ${MysqlService.formatFields(StudentRegistration)} 
    	  			   FROM ${StudentRegistration.getDbName()} ${StudentRegistration.name} 
    	  			   WHERE TRIM(${StudentRegistration.name}.Symbol)=?`,
      find_all: `SELECT ${MysqlService.formatFields(StudentRegistration)} 
      	  	     FROM ${StudentRegistration.getDbName()} ${StudentRegistration.name}
      	  	     ORDER BY ${StudentRegistration.name}.id ASC`,
    };
  }

  format(modelData) {
    return CRUD.format(StudentRegistration.getModels(), modelData);
  }
  
  static format(modelData) {
    return CRUD.format(StudentRegistration.getModels(), modelData);
  }
  
  constructor(mysql) {
    super(mysql, StudentRegistration);

    this.mysql = mysql;
  }

  findBySymbol(symbol) {
    return new Promise((resolve, reject) => {
      return this.mysql.query(this.getQuery('find_by_symbol'), symbol)
        .then((rows) => {
          if (rows.length < 1) {
            const notFound = new Error('No StudentRegistration for this symbol');
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
            const notFound = new Error('No StudentRegistration');
            notFound.status = 404;
            return reject(notFound);
          }
          return resolve(rows);
        })
        .catch(reject);
    })
  }
  
}

module.exports = StudentRegistration;