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