const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(albumsService, storagesService, validator) {
    this._albumsService = albumsService;
    this._storagesService = storagesService;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadImageHandler(request, h) {
    const { cover } = request.payload;
    this._validator.validateImageHeaders(cover.hapi.headers);
    const filename = await this._storagesService.writeFile(cover, cover.hapi);

    const { id } = request.params;
    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
    await this._albumsService.addAlbumCover(coverUrl, id);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
