import { db } from "./../data/db.js";

export function searchLike(postId, userName) {
  return db.query(`
    SELECT * FROM likes WHERE "publicationId"=$1 AND "userName"=$2
  `, [postId, userName]);
}

export function insertLike(postId, userName) {
  return db.query(`
    INSERT INTO likes ("publicationId", "userName") VALUES ($1, $2)
  `, [postId, userName]);
}

export function unlike(postId, userName) {
  return db.query(`
    DELETE FROM likes WHERE "publicationId"=$1 AND "userName"=$2
  `, [postId, userName]);
}

export function countLikes(postId) {
  return db.query(`
    SELECT COUNT(*) FROM likes WHERE "publicationId"=$1
  `, [postId]);
}