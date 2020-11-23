const cors = require('cors');
const authMiddleware = require('./auth/middleware');
const getRoot = require('./core/get_root');
const getPricesBySymbol = require('./prices/get_prices_by_symbol');
const getPrices = require('./prices/get_all_prices');
const mtCron = require('./mt5/mt_cron');

const routes = (app) => {
  app.use(cors());

  // CORE
  app.get('/', getRoot); // Show some API info
  app.get('/:db/:live/prices/:symbol', getPricesBySymbol); // Get prices for a symbol
  app.get('/:db/:live/prices', getPrices); // Get all prices
  app.get('/mt5', mtCron);

  // Check Token & add user data to request
  app.use(authMiddleware); // Retrieve token information
};

module.exports = routes;