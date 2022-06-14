import { db } from "./../data/db.js";

export function getUser(param, value) {
  return db.query(`
    SELECT * FROM users WHERE ${param}=$1
    `, [value]);
}

export function insertToken(userId, token) {
  return db.query(`
    INSERT INTO sessions ("userId", token) VALUES ($1, $2)
    `, [userId, token]);
}