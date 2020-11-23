const config = {};

// ENV
config.ENV = 'local'; // local | test | dev | prod
config.env = config.ENV;

// Port
config.port = process.env.PORT || 8000;
config.securePort = process.env.SECURE_PORT || 8100;

// MySQL
config.mysql = {
  host: '',
  user: '',
  password: '',
  database: '',
};

// JWT HMAC SHA256
config.jwtSecret = '';

// APP
config.app = {
  name: 'bwapi',
  contactEmail: '',
};

// Keys
config.privateKey = '';
config.certificate = '';

// Domains
config.domains = {
  api: 'http://devsecure7.bitwallet.com',
};

module.exports = config;
