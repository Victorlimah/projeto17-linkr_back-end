import { db } from "./../data/db.js";

export function searchLike(postId, userName) {
  return db.query(`
    SELECT * FROM likes WHERE "publicationId"=$1 AND "userName"=$2
  `, [postId, userName]);
}