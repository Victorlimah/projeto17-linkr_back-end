import { db } from "./../data/db.js";

export function getHashtag(param, value){
    return db.query(`
    SELECT * FROM hashtags WHERE "${param}"=$1
    `, [value])
}

export function insertHashtags(hashtag, postId){
    return db.query(`
    INSERT INTO hashtags (name, "publicationId") VALUES ($1, $2) RETURNING *
    `, [hashtag.toLowerCase(), postId])  
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
    SELECT h.name, COUNT(h.name) AS quantity
    FROM hashtags h
    JOIN "publicationsHashtags" ph ON ph."hashtagId" = h.id
    JOIN publications p ON p.id = ph."publicationId"
    GROUP BY(H.name)
    ORDER BY quantity DESC
    LIMIT 10
  `)
}

export function getTimelineByHashtag(hashtag) {
  hashtag = '#' + hashtag.hashtag

  return db.query(`
  SELECT p.id, u.username AS username, u.picture AS picture, p.link, p.description
  FROM users u
  JOIN publications p ON p."userId" = u.id 
  JOIN "publicationsHashtags" ph ON ph."publicationId"=p.id
  JOIN hashtags h ON h.id = ph."hashtagId"
  WHERE h.name = $1
  LIMIT 20
  `, [hashtag])
}