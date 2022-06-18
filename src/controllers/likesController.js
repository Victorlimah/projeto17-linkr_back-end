import chalk from "chalk";
import { countLikes, insertLike, searchLike, unlike } from "../repositories/likesRepository.js";

export async function checkLiked(req, res){
    let { postId, username } = req.body;
    postId = parseInt(postId);
    try{
        const likes = await countLikes(postId);
        const like = await searchLike(postId, username);
        res.status(200).send({liked: like.rows.length > 0, likes: likes.rows[0].count});
    } catch(err){
        console.log(chalk.red(`ERROR CHECKING LIKE: ${err}`));
        res.status(500).send({error: err.message});
    }
}

export async function newLike(req, res){
    let { postId, username } = req.body;
    postId = parseInt(postId);
    try{
      const like = await searchLike(postId, username);
      if(like.rows.length > 0){
        res.status(409).send({error: "You already liked this post"});
      } else {
        await insertLike(postId, username);
        const likes = await countLikes(postId);
            res.status(200).send({liked: true, likes: likes.rows[0].count});
        }
    } catch(err){
        console.log(chalk.red(`ERROR CHECKING LIKE: ${err}`));
        res.status(500).send({error: err.message});
    }
}

export async function deleteLike(req, res){
    let { postId, username } = req.body;
    postId = parseInt(postId);
    try{
      const like = await searchLike(postId, username);
      if(like.rows.length > 0){
        await unlike(postId, username);
        const likes = await countLikes(postId);
        res.status(200).send({liked: false, likes: likes.rows[0].count});
        } else {
            res.status(409).send({error: "You didn't like this post"});
        }
    } catch(err){
        console.log(chalk.red(`ERROR CHECKING LIKE: ${err}`));
        res.status(500).send({error: err.message});
    }
}