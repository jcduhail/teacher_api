const MysqlService = require('../../services/mysql');
const Teacher = require('../../models/teacher');

/* GET users listing. */
module.exports = (req, res, next) => {
  const mysql = new MysqlService();
  const teacher = new Teacher(mysql);
  mysql.connect();
  teacher.findAll().then((rows) => {
    mysql.disconnect();
    res.json(Teacher.format(rows));
  }).catch(err => next(err));
};
