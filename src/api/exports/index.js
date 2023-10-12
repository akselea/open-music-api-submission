const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, {
    ProducersService,
    playlistsService,
    validator,
  }) => {
    const exportsHandler = new ExportsHandler(
      ProducersService,
      playlistsService,
      validator,
    );
    server.route(routes(exportsHandler));
  },
};
