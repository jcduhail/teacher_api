const CRUD = require('./_crud');
const MysqlService = require('../services/mysql');

class Student extends CRUD {
  static getDbName() {
    return 'student';
  }

  static getModels() {
    return {
      Student,
    };
  }

  static getFields() {
	return {
	  ID: { name: 'id', type: 'INT' },
	  EMAIL: { name: 'email', type: 'VARCHAR', length: 64 },
	  SUSPENDED: { name: 'suspended', type: 'BOOLEAN' },
	};
  }

  static getQueries() {
    return {
      find_by_email: `SELECT ${MysqlService.formatFields(Student)} 
    	  			   FROM ${Student.getDbName()} ${Student.name} 
    	  			   WHERE TRIM(${Student.name}.email)=?`,
      suspend: `UPDATE ${Student.getDbName()} ${Student.name}
			    SET ${Student.name}.suspended = TRUE
				WHERE ${Student.name}.email = ?`,
    };
  }

  format(modelData) {
    return CRUD.format(Student.getModels(), modelData);
  }
  
  static format(modelData) {
    return CRUD.format(Student.getModels(), modelData);
  }
  
  constructor(mysql) {
    super(mysql, Student);

    this.mysql = mysql;
  }

  findByEmail(email) {
    return new Promise((resolve, reject) => {
      return this.mysql.query(this.getQuery('find_by_email'), email)
        .then((rows) => {
          if (rows.length < 1) {
            const notFound = new Error('No Student for this email');
            notFound.status = 404;
            return reject(notFound);
          }
          return resolve(rows);
        })
        .catch(reject);
    })
  }

  suspend(email) {
    return new Promise((resolve, reject) => {
      return this.mysql.query(this.getQuery('suspend'), email)
        .then((rows) => {
          if (rows.affectedRows < 1) {
            const notFound = new Error('No Student for this email');
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
            const notFound = new Error('No Student');
            notFound.status = 404;
            return reject(notFound);
          }
          return resolve(rows);
        })
        .catch(reject);
    })
  }
  
}

module.exports = Student;