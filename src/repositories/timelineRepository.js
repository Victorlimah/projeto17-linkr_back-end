import { db } from "./../data/db.js";

// export function getPosts() {
//     return db.query(`
//     SELECT p.id AS id, u.username AS username, u.picture AS picture, p.link, p.description, p."originalPost", p."reposterName"
//     FROM users AS u
//     JOIN publications AS p ON p."userId"=u.id
//     ORDER BY p.id DESC
//     LIMIT 20
//     `)
// }

export function getPosts(id, page) {
    return db.query(`
    SELECT p.id AS id, u2.username AS username, u2.picture AS picture, p.link, 
    p.description, p."originalPost", p."reposterName"
    FROM users AS u2
    JOIN publications AS p 
    ON p."userId"=u2.id
    JOIN follow AS f
    ON u2.id = f."followingId" 
    JOIN users AS u1
    ON u1.id = f."followerId"  
    WHERE f."followerId"=$1
    ORDER BY p.id DESC
    LIMIT 10
    OFFSET $2
    `, [id, Number(page*10)])
}

export function getPostsUser(id) {
    return db.query(`
    SELECT p.id AS id, u.username AS username, u.picture AS picture, p.link, p.description
    FROM users AS u
    JOIN publications AS p ON p."userId"=u.id
    WHERE u.id=$1
    ORDER BY p.id DESC
    LIMIT 10
    `, [id])
}

export function getInfoUser(id) {
    return db.query(`
    SELECT u.username AS username, u.picture AS picture
    FROM users AS u
    WHERE u.id=$1
    `, [id])
}

export function getFollowId(follower, following) {
    return db.query(`
    SELECT f.id
    FROM follow AS f
    JOIN users AS u1
    ON f."followerId" = u1.id
    JOIN users AS u2
    ON f."followingId" = u2.id
    WHERE u1.id=$1 AND u2.id=$2
    `, [follower, following])
}

export function verifyFollow(id) {
    return db.query(`
    SELECT f."followingId"
    FROM follow AS f
    JOIN users AS u
    ON f."followerId" = u.id
    WHERE f."followerId"=$1
    `,[id])
}

export function postPosts(url, description, id) {
    return db.query(`
    INSERT INTO publications
    (link, description, "userId")
    VALUES ($1, $2, $3) RETURNING id
    `, [url, description, id])
}

export function postUsers(value) {
    return db.query(`SELECT users.username, users.picture, users.id 
    FROM users 
    WHERE UPPER(username) LIKE UPPER($1)`, [value + "%"])
}

export function catchUsersFollow(value, id) {
    return db.query(`SELECT u2.username, u2.picture, u2.id 
    FROM follow AS f
    JOIN users AS u1
    ON u1.id = f."followerId"  
    JOIN users AS u2
    ON u2.id = f."followingId" 
    WHERE UPPER(u2.username) LIKE UPPER($1)
    AND f."followerId"=$2`, [value + "%", id])
}

export function postFollowing(follower, following) {
    return db.query(`INSERT INTO follow ("followerId", "followingId")
    VALUES($1, $2)`, [follower, following])
}

export function getPublication(postId) {
    return db.query(`SELECT p."userId" 
    FROM publications p
    WHERE p.id = $1
    LIMIT 1
    `, [postId])
}

export function deletePublication(postId) {
    return db.query(`DELETE FROM publications p WHERE p.id = $1`, [postId])
}

export function deleteFollowing(follower, following) {
    return db.query(`DELETE FROM follow f WHERE f."followerId" = $1 AND f."followingId" = $2`, [follower, following])
}

export function updatePublication(postId, description) {
    return db.query(`
    UPDATE publications p
    SET description=$1
    WHERE p.id=$2
    `, [description, postId])
}

export function observeAPI(id) {
    return db.query(`
    SELECT p.id AS id, u2.username AS username, u2.picture AS picture, p.link, 
    p.description, p."originalPost", p."reposterName"
    FROM users AS u2
    JOIN publications AS p 
    ON p."userId"=u2.id
    JOIN follow AS f
    ON u2.id = f."followingId" 
    JOIN users AS u1
    ON u1.id = f."followerId"  
    WHERE f."followerId"=$1
    ORDER BY p.id DESC
    `, [id])
}


