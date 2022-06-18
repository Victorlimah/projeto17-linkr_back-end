import { db } from "./../data/db.js";

export function getPosts() {
    return db.query(`
    SELECT p.id AS id, u.username AS username, u.picture AS picture, p.link, p.description
    FROM users AS u
    JOIN publications AS p ON p."userId"=u.id
    ORDER BY p.id DESC
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

export function postUsers(value) {
    return db.query(`SELECT users.username, users.picture 
    FROM users 
    WHERE UPPER(username) LIKE UPPER($1)`, [value + "%"])
}
