const InvariantError = require('../../exceptions/InvariantError');
const {
  PostPlaylistPayloadSchema,
  PostSongOnPlaylistPayloadSchema,
  DeleteSongOnPlaylistPayloadSchema,
} = require('./schema');

const PlaylistValidator = {
  validatePostPlaylistPayload: (payload) => {
    const validationResult = PostPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePostSongOnPlaylistPayload: (payload) => {
    const validationResult = PostSongOnPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeleteSongOnPlaylistPayload: (payload) => {
    const validationResult = DeleteSongOnPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistValidator;
