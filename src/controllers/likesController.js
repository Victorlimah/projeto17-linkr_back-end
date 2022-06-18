import chalk from "chalk";
import { searchLike } from "../repositories/likesRepository.js";

export async function checkLiked(req, res){
    let { postId, username } = req.body;
    postId = parseInt(postId);
    try{
        const like = await searchLike(postId, username);
        res.status(200).send({liked: like.rows.length > 0});
    } catch(err){
        console.log(chalk.red(`ERROR CHECKING LIKE: ${err}`));
        res.status(500).send({error: err.message});
    }

}