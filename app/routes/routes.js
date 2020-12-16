const cors = require('cors');
const authMiddleware = require('./auth/middleware');
const getRoot = require('./core/get_root');
const getTeachers = require('./teacher/get_all_teacher');
const registerStudents = require('./teacher/register_students');
const getCommonStudents = require('./teacher/get_common_students');
const suspendStudent = require('./teacher/suspend_student');
const retrieveForNotifications = require('./teacher/retrieve_for_notifications');

const routes = (app) => {
  app.use(cors());

  // CORE
  app.get('/', getRoot); // Show some API info

  // API Routes
  app.get('/get_teachers', getTeachers); // Get all teachers
  app.get('/api/commonstudents', getCommonStudents); // Get common students registered to a teacher
  app.post('/api/register', registerStudents); // Register students to a teacher
  app.post('/api/suspend', suspendStudent); // Suspend a specific student
  app.post('/api/retrievefornotifications', retrieveForNotifications); // Retrieve student who can receive a notification

  // Check Token & add user data to request
  app.use(authMiddleware); // Retrieve token information
};

module.exports = routes;