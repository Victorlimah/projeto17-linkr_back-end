import { hash } from "bcrypt";
import { db } from "./../data/db.js";

export function getHashtag(param, value){
    return db.query(`
    SELECT * FROM hashtags WHERE "${param}"=$1
    `, [value])
}

export function insertHashtags(hashtag){
    return db.query(`
    INSERT INTO hashtags (name) VALUES ($1) RETURNING *
    `, [hashtag.toLowerCase()])  
}

export function linkHashtags(postId, hashtagId) {
  return db.query( `
    INSERT INTO "publicationsHashtags"
        ("publicationId", "hashtagId")
    VALUES ($1, $2)
    `, [postId, hashtagId]
  );
}

export function getTrendingHashtags() {
  return db.query(`
    SELECT h.name, h.id, COUNT(h.id) AS quantity
    FROM "publicationsHashtags" ph
    JOIN hashtags h ON ph."hashtagId" = h.id
    GROUP BY(H.ID)
    ORDER BY quantity DESC
    LIMIT 10
  `)
}

export function getTimelineByHashtag(hashtag) {
  hashtag = '#' + hashtag.hashtag

  return db.query(`
  SELECT u.username AS username, u.picture AS picture, p.link, p.description
  FROM users u
  JOIN publications p ON p."userId" = u.id 
  JOIN "publicationsHashtags" ph ON ph."publicationId"=p.id
  JOIN hashtags h ON h.id = ph."hashtagId"
  WHERE h.name = $1
  LIMIT 20
  `, [hashtag])
}