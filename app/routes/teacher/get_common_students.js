const MysqlService = require('../../services/mysql');
const StudentRegistration = require('../../models/student_registration');

/* GET common students listing. */
module.exports = (req, res, next) => {
  const mysql = new MysqlService();
  const student_registration = new StudentRegistration(mysql);
  mysql.connect();
  var result = {};

  student_registration.findCommon(req.query.teacher).then((rows) => {
    mysql.disconnect();
	result['students'] = Array();
	rows.forEach(obj=> {
		result['students'].push(obj.email);
	});
    res.json(result);
  }).catch(err => next(err));

};
