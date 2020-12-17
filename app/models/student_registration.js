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
      find_common: `SELECT DISTINCT student.email email
				   FROM student_registration
				   INNER JOIN student ON student_registration.student_id = student.id
				   INNER JOIN teacher ON student_registration.teacher_id = teacher.id
				   WHERE teacher.email IN (?)`,
      find_for_notification: `SELECT DISTINCT student.email
				   FROM student_registration
				   INNER JOIN student ON student_registration.student_id = student.id AND student.suspended = FALSE
				   INNER JOIN teacher ON student_registration.teacher_id = teacher.id
				   WHERE teacher.email IN (?) OR student.email IN (?)`,
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

  findCommon(emails) {
    return new Promise((resolve, reject) => {
      return this.mysql.query(this.getQuery('find_common'), emails)
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

  findForNotification(teachers, students) {
    return new Promise((resolve, reject) => {
      return this.mysql.query(this.getQuery('find_for_notification'), [teachers, students])
        .then((rows) => {
          return resolve(rows);
        })
        .catch(reject);
    })
  }
  
}

module.exports = StudentRegistration;