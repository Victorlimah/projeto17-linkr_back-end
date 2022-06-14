import { db } from "./../data/db.js";

export function newUser(username, email, password, picture) {
  return db.query(
    `
    INSERT INTO 
      users (username, email, password, picture)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [username, email, password, picture]
  );
}
