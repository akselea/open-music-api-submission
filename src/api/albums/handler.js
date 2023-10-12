const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year, coverUrl } = request.payload;
    const albumId = await this._service.addAlbum({ name, year, coverUrl });

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });

    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    const songs = await this._service.getSongByAlbumId(id);

    const response = h.response({
      status: 'success',
      data: {
        album: {
          ...album,
          songs,
        },
      },
    });

    return response;
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    const { name, year, coverUrl } = request.payload;
    await this._service.editAlbumById(id, { name, year, coverUrl });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil diperbarui.',
    });

    return response;
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil dihapus.',
    });

    return response;
  }

  async postAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    await this._service.verifyAlbumId(albumId);

    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyAlbumLike(credentialId, albumId);

    await this._service.addAlbumLikes(credentialId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil disukai.',
    });
    response.code(201);
    return response;
  }

  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const { likes, isCache } = await this._service.getAlbumLikes(albumId);
    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });

    if (isCache) {
      response.header('X-Data-Source', 'cache');
    }
    return response;
  }

  async deleteAlbumLikesHandler(request) {
    const { id: albumId } = request.params;

    const { id: credentialId } = request.auth.credentials;

    await this._service.deleteAlbumLikes(credentialId, albumId);

    return {
      status: 'success',
      message: 'Album batal disukai.',
    };
  }
}

module.exports = AlbumsHandler;
