/* GET root. */
module.exports = (req, res) => {
  res.json({
    name: 'Bitwallet Node API',
    version: '1',
    subversion: '0',
  });
};
