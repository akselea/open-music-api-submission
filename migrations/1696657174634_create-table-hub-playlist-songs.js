/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlistId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    songId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('playlist_songs', 'unique_playlistId_and_songId', 'UNIQUE("playlistId", "songId")');
  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.playlistId_playlists.id', 'FOREIGN KEY("playlistId") REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.songId_songs.id', 'FOREIGN KEY("songId") REFERENCES songs(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
};
