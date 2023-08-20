const client = require('./client');
const util = require('util');

// GET - /api/video-games - get all video games
async function getAllVideoGames() {
    try {
        const { rows: videoGames } = await client.query('SELECT * FROM videoGames');
        return videoGames;
    } catch (error) {
        throw new Error("Make sure you have replaced the REPLACE_ME placeholder.")
    }
}

// GET - /api/video-games/:id - get a single video game by id
async function getVideoGameById(id) {
    try {
        const { rows: [videoGame] } = await client.query(`
            SELECT * FROM videoGames
            WHERE id = $1;
        `, [id]);
        return videoGame;
    } catch (error) {
        throw error;
    }
}

// POST - /api/video-games - create a new video game
async function createVideoGame(body) {
    try {
        const { rows: [videoGame] } = await client.query(`
        INSERT INTO videoGames(name, description, price)
        VALUES($1, $2, $3)
        RETURNING *;
        `, [body.name, body.description, body.price]);
        return videoGame;
    } catch (error) {
        throw error;
    }
}



// PUT - /api/video-games/:id - update a single video game by id
async function updateVideoGame(videoGameId, fields = {}) {
    // build the set string
    const setString = Object.keys(fields).map((key, index) => `"${key}"=$${index + 1}`).join(', ');

    // return early if this is called without fields
    if (setString.length === 0) {
        return;
    }

    try {
        const { rows: [videoGame] } = await client.query(`
      UPDATE videoGames
      SET ${setString}
      WHERE id=${videoGameId}
      RETURNING *;
    `, Object.values(fields));

        return videoGame;
    } catch (error) {
        throw error;
    }
}

// DELETE - /api/video-games/:id - delete a single video game by id
async function deleteVideoGame(videoGameId) {
    try {
        const { rows: [videoGame] } = await client.query(`
      DELETE FROM videoGames
      WHERE id=$1
      RETURNING *;
    `, [videoGameId]);
        return videoGame;
    } catch (error) {
        throw error;
    }
}
module.exports = {
    getAllVideoGames,
    getVideoGameById,
    createVideoGame,
    updateVideoGame,
    deleteVideoGame
}