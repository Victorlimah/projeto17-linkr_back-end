import { db } from "./../data/db.js";

export function getPosts() {
    return db.query(`
    SELECT u.username AS username, u.picture AS picture, p.link, p.description
    FROM users AS u
    JOIN publications AS p ON p."userId"=u.id
    LIMIT 20
    `)
}

export function postPosts(url, description, id) {
    return db.query(`
    INSERT INTO publications
    (link, description, "userId")
    VALUES ($1, $2, $3) RETURNING id
    `, [url, description, id])
}
