const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(playlistsService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist({
      name, owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._playlistsService.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    await this._playlistsService.deletePlaylistById(playlistId);
    return {
      status: 'success',
      message: 'Playlist berhasil dihapus.',
    };
  }

  async postSongstoPlaylistHandler(request, h) {
    this._validator.validatePostSongOnPlaylistPayload(request.payload);
    const { songId } = request.payload;
    await this._songsService.verifySongId(songId);

    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    await this._playlistsService.addSongtoPlaylist({ playlistId, songId });
    await this._playlistsService.addPlaylistActivity(playlistId, songId, credentialId, 'add');

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist.',
    });
    response.code(201);
    return response;
  }

  async getSongsOnPlaylistHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const playlist = await this._playlistsService.getPlaylistById(playlistId);
    const songs = await this._playlistsService.getSongOnPlaylist(playlistId);
    return {
      status: 'success',
      data: {
        playlist: {
          ...playlist,
          songs,
        },
      },
    };
  }

  async deleteSongsOnPlaylistHandler(request) {
    this._validator.validateDeleteSongOnPlaylistPayload(request.payload);
    const { songId } = request.payload;
    await this._songsService.verifySongId(songId);

    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    await this._playlistsService.deleteSongOnPlaylist(songId);
    await this._playlistsService.addPlaylistActivity(playlistId, songId, credentialId, 'delete');
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist.',
    };
  }

  async getPlaylistActivitiesHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const activities = await this._playlistsService.getPlaylistActivity(playlistId);
    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistsHandler;
