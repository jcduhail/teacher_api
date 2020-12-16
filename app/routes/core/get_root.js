/* GET root. */
module.exports = (req, res) => {
  res.json({
    name: 'Teacher Node API',
    version: '1',
    subversion: '0',
  });
};
