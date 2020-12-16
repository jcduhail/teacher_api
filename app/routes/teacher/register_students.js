const MysqlService = require('../../services/mysql');
const Student = require('../../models/student');
const Teacher = require('../../models/teacher');
const StudentRegistration = require('../../models/student_registration');

/* register new students. */
module.exports = (req, res, next) => {
  const mysql = new MysqlService();
  const teacher = new Teacher(mysql);
  const student = new Student(mysql);
  const student_registration = new StudentRegistration(mysql);

  mysql.connect();

  teacher.findByEmail(req.query.teacher).then((rows) => {
	var teacher_id = teacher.format(rows[0]).Teacher.id;
	var students = req.query.students;
	var student_id = '';
	var result = {};
	
	var job = new Promise((resolve, reject) => {
		students.forEach((obj, index, array) => {
			student.findByEmail(obj).then((rows) => {
				student_id = student.format(rows[0]).Student.id;
				student_registration.create({teacher_id:teacher_id, student_id:student_id}).then(row=>{
					result[obj] = 'student registered to teacher '+req.query.teacher;
					if (index === array.length -1) resolve();
				}).catch(err=>{
					result[obj] = 'student was already registered to teacher '+req.query.teacher;
					if (index === array.length -1) resolve();
				});
			}).catch(err => {
				//insert new one
				
				student.create({email: obj}).then((row)=>{
					student_id = student.format(row).Student.id;
					student_registration.create({teacher_id:teacher_id, student_id:student_id}).then(row=>{
 						result[obj] = 'new student registered to teacher '+req.query.teacher;
						if (index === array.length -1) resolve();
					}).catch(err=>{
						if (index === array.length -1) resolve();
					});
				});
			});		
		});
	});
	
	job.then(() => {
	    mysql.disconnect();
		result.message = 'ok';
	    res.json(result);		
	});

  }).catch(err => next(err));
};
