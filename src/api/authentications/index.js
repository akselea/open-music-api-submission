const routes = require('./routes');
const AuthenticationsHandler = require('./handler');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, {
    usersService,
    authenticationsService,
    tokenManager,
    validator,
  }) => {
    const authenticationsHandler = new AuthenticationsHandler(
      usersService,
      authenticationsService,
      tokenManager,
      validator,
    );
    server.route(routes(authenticationsHandler));
  },
};
