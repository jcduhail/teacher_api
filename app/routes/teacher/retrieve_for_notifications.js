const MysqlService = require('../../services/mysql');
const StudentRegistration = require('../../models/student_registration');

/* GET users listing. */
module.exports = (req, res, next) => {
  const mysql = new MysqlService();
  const student_registration = new StudentRegistration(mysql);
  mysql.connect();
  var result = {};

  result['recipients'] = Array('');
  var emailsArray = req.query.notification.match(/\S+[a-z0-9]@[a-z0-9\.]+/img);

  if (emailsArray) {
	for (var i = 0; i < emailsArray.length; i++) {
		result['recipients'].push(emailsArray[i].substring(1));
	}
  }

  student_registration.findForNotification(req.query.teacher, result['recipients']).then((rows) => {
    mysql.disconnect();
	result['recipients'] = Array();

	rows.forEach(obj=> {
		result['recipients'].push(obj.email);
	});
	
    res.json(result);
  }).catch(err => next(err));

};
