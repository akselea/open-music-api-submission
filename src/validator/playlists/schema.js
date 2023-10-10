const Joi = require('joi');

const PostPlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const PostSongOnPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

const DeleteSongOnPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  PostPlaylistPayloadSchema,
  PostSongOnPlaylistPayloadSchema,
  DeleteSongOnPlaylistPayloadSchema,
};
