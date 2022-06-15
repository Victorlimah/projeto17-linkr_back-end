import { db } from "./../data/db.js";

export function getPosts() {
    return db.query(`
    SELECT u.username AS name, u.picture AS picture
    FROM users AS u
    JOIN publications ON publications."userId"=users.id
    ORDER BY "createdAt"
    DESC LIMIT 20
    `)
}

export function postPosts(url, description) {
    return db.query(`
    INSERT INTO publications
    (link, description)
    VALUES ($1, $2)
    `, [url, descripition])
}