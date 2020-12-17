const MysqlService = require('../../services/mysql');
const Student = require('../../models/student');

/* Suspend a student. */
module.exports = (req, res, next) => {
  const mysql = new MysqlService();
  const student = new Student(mysql);
  mysql.connect();
  result = {};

  student.suspend(req.query.student).then((rows) => {
    mysql.disconnect();
    result.message = 'ok';
    res.json(result);
  }).catch(err => next(err));
};
