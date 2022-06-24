import chalk from "chalk";
import { countComments, getComments, insertComments } from "../repositories/commentsRepository.js";
import { countLikes, getNames, insertLike, searchLike, unlike } from "../repositories/likesRepository.js";
import { countReposts } from "../repositories/repostRepository.js";
import { getFollowing } from "../repositories/userRepository.js";

export async function checkLiked(req, res){
    let { postId, username } = req.body;
    postId = parseInt(postId);
    try{
        const numberLikes = await countLikes(postId);
        const like = await searchLike(postId, username);
        const allNames = await getNames(postId, username);
        const numberComments = await countComments(postId);
        const repostsAmount = await countReposts(postId);
        const listComments =  (await getComments(postId)).rows;
        const following = (await getFollowing(username)).rows;


        const names = allNames.rows;
        const likes = numberLikes.rows[0].count;
        const comments = numberComments.rows[0].count;
        const reposts = repostsAmount.rows[0]?.quantity === undefined ? 0 : repostsAmount.rows[0]?.quantity;

        res.status(200).send({liked: like.rows.length > 0, likes, comments, reposts, names, listComments, following});
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
        const names = await getNames(postId, username);
            res.status(200).send({liked: true, likes: likes.rows[0].count, names: names.rows});
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
        const names = await getNames(postId, username);
        res.status(200).send({liked: false, likes: likes.rows[0].count, names: names.rows});
        } else {
            res.status(409).send({error: "You didn't like this post"});
        }
    } catch(err){
        console.log(chalk.red(`ERROR CHECKING LIKE: ${err}`));
        res.status(500).send({error: err.message});
    }
}

export async function newComment(req, res){
    let { postId, username, comment } = req.body;
    postId = parseInt(postId);
    try{
        await insertComments(postId, username, comment);
        const comments = await countComments(postId);
        const content = await getComments(postId);

        res.status(201).send({comments: comments.rows[0].count, content: content.rows});
    } catch(err){
        console.log(chalk.red(`ERROR CHECKING LIKE: ${err}`));
        res.status(500).send({error: err.message});
    }
}