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

export function getFollowing(username){
  return db.query(`
    SELECT u.username
    FROM follow AS f
    JOIN users AS u
    ON u.id = f."followingId" 
    WHERE f."followerId"=(SELECT id FROM users WHERE username=$1)
  `, [username])
}

export function getFollowingById(id){
  return db.query(`
    SELECT u.username
    FROM follow AS f
    JOIN users AS u
    ON u.id = f."followingId" 
    WHERE f."followerId"=$1
  `, [id])
}