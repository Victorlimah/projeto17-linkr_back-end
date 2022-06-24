import { db } from "./../data/db.js";

export function countComments(postId){
  return db.query(`
    SELECT COUNT(*) FROM comments WHERE "publicationId"=$1
  `,  [postId]
  );
}

export function insertComments(postId, userName, comment){
  return db.query(`
    INSERT INTO comments ("publicationId", "userName", "comment") VALUES ($1, $2, $3)
  `, [postId, userName, comment]
  );
}

export function getComments(postId){
  return db.query(`
    SELECT "userName", "comment", u.picture
    FROM comments
    JOIN users u ON comments."userName"=u.username
    WHERE "publicationId"=$1
  `, [postId]
  );
}
