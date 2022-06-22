import { db } from "./../data/db.js";

export function countComments(postId){
  return db.query(`
    SELECT COUNT(*) FROM comments WHERE "publicationId"=$1
  `,  [postId]
  );
}