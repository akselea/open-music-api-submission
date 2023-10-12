const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor(cachesService) {
    this._pool = new Pool();
    this._cachesService = cachesService;
  }

  async addAlbum({ name, year, coverUrl = null }) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO albums VALUES ($1, $2, $3, $4) RETURNING id',
      values: [id, name, year, coverUrl],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan.');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan, cek kembali Id album.');
    }

    return result.rows[0];
  }

  async getSongByAlbumId(id) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE "albumId" = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    return result.rows;
  }

  async editAlbumById(id, { name, year, coverUrl }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, "coverUrl" = $3 WHERE id = $4 RETURNING id',
      values: [name, year, coverUrl, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal diperbarui.');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus.');
    }
  }

  async addAlbumCover(coverUrl, id) {
    const query = {
      text: 'UPDATE albums SET "coverUrl" = $1 WHERE id = $2 RETURNING id',
      values: [coverUrl, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Cover Album gagal ditambahkan.');
    }
  }

  async addAlbumLikes(userId, albumId) {
    const id = `likes-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Album gagal disukai.');
    }

    await this._cachesService.delete(`likes-${albumId}`);
  }

  async getAlbumLikes(albumId) {
    try {
      const result = await this._cachesService.get(`likes-${albumId}`);
      return {
        likes: JSON.parse(result),
        isCache: 1,
      };
    } catch (error) {
      const query = {
        text: 'SELECT "userId" FROM album_likes WHERE "albumId" = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      await this._cachesService.set(`likes-${albumId}`, JSON.stringify(result.rowCount));
      return { likes: result.rowCount };
    }
  }

  async deleteAlbumLikes(userId, albumId) {
    const query = {
      text: 'DELETE FROM album_likes WHERE "userId" = $1 AND "albumId" = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Album gagal tidak disukai.');
    }

    await this._cachesService.delete(`likes-${albumId}`);
  }

  async verifyAlbumId(id) {
    const query = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Id album tidak ditemukan.');
    }
  }

  async verifyAlbumLike(userId, albumId) {
    const query = {
      text: 'SELECT * FROM album_likes WHERE "userId" = $1 AND "albumId" = $2',
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);

    if (result.rows.length) {
      throw new InvariantError('Album telah disukai.');
    }
  }
}

module.exports = AlbumsService;
