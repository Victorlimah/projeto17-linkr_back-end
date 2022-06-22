import { db } from "./../data/db.js";

export function repostPost(url, description, userId, originalPostId, reposterName) {
  return db.query(`
    INSERT INTO publications
    (link, description, "userId", "originalPost", "reposterName")
    VALUES ($1, $2, $3, $4, $5) RETURNING id
  `, [url, description, userId, originalPostId, reposterName])
}

export function countReposts(originalPostId) {
  return db.query(`
    SELECT COUNT(p."originalPost") AS quantity
    FROM PUBLICATIONS p
    WHERE p."originalPost" = $1
    GROUP BY p."originalPost"
  `, [originalPostId])
}

export function getUserIdByPublication(publicationId) {
  return db.query(`
    SELECT u.id 
    FROM users u
    JOIN publications p ON p."userId" = u.id
    WHERE p.id = $1
  `, [publicationId])
}