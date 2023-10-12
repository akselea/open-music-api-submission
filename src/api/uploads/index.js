const routes = require('./routes');
const UploadsHandler = require('./handler');

module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, {
    albumsService,
    storagesService,
    validator,
  }) => {
    const uploadsHandler = new UploadsHandler(
      albumsService,
      storagesService,
      validator,
    );
    server.route(routes(uploadsHandler));
  },
};
