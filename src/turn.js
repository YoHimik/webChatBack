const config = require('./../config')[process.env.NODE_ENV].turn;
const turn = require('node-turn');
const options = {
  authMech: config.authMech,
  credentials: config.users,
  listeningPort: config.port,
  debugLevel: config.debug,
  listeningIps: config.ips
};
module.exports = new turn(options);
