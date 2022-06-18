import chalk from "chalk";
import { getPosts, postPosts, postUsers } from "../repositories/timelineRepository.js";
import dotenv from "dotenv";
import urlMetadata from "url-metadata";
import { addHashtag } from "../services/addHashtag.js";
import extractHashtags from "../utils/extractHashtags.js";
import { getTrendingHashtags } from "../repositories/hashtagRepository.js";
import { countLikes } from "../repositories/likesRepository.js";

dotenv.config();

export async function Timeline(_req, res) {
    const postsArray = []
    const options = {
        descriptionLength: 700
    }
    try {
        const infos = await getPosts();
        for (let info of infos.rows) {
            const likes = await countLikes(info.id);
            try {
                const response = await urlMetadata(info.link, options)
                const publicationsInfos = {
                    id: info.id,
                    likes: likes.rows[0].count,
                    username: info.username,
                    picture: info.picture,
                    link: info.link,
                    description: info.description,
                    linkPicture: response.picture,
                    linkTilte: response.title,
                    linkDescription: response.description
                }
                postsArray.push(publicationsInfos)

            } catch (e) {
                const publicationsInfos = {
                    id: info.id,
                    likes: likes.rows[0].count,
                    username: info.username,
                    picture: info.picture,
                    link: info.link,
                    description: info.description,
                    linkPicture: undefined,
                    linkTilte: undefined,
                    linkDescription: undefined
                }
                postsArray.push(publicationsInfos)
            }
        }
        res.status(200).send(postsArray)
    } catch (err) {
        console.log(chalk.red(`ERROR: ${err}`))
        res.status(500).json(err)
    }
}

export async function TimelineUsers(req, res) {

    const { value } = req.body;

    try {
        if (value) {
            const post = await postUsers(value);
            res.status(200).send(post.rows);
        }
    } catch (err) {
        console.log(chalk.red(`ERROR: ${err.message}`));
        res.status(500).send(err.message);
    }
}

export async function PostUrl(req, res) {
    let { url, description, id } = req.body;
    id = Number(id);

    try {
        const post = await postPosts(url, description, id);
        const hashtags = extractHashtags(description);
        console.log(hashtags)
        if (hashtags?.length > 0)
            await addHashtag(post.rows[0].id, hashtags);
        res.status(201).send("Url posted succesfully");
    } catch (err) {
        console.log(chalk.red(`ERROR on PostUrl: ${err.message}`))
        res.status(500).send(`ERROR: ${err.message}`);
    }
}

export async function getTrending(req, res) {
    try {
        const search = await getTrendingHashtags()
        if(!search.rows) return res.sendStatus(404)

        const hashtags = search.rows
        res.status(200).send(hashtags)
    } catch(e) {
        console.log(e, "Error on getHashtags")
        return res.sendStatus(500)
    }
}
