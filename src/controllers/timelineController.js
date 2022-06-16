import chalk from "chalk";
import { getPosts, postPosts } from "../repositories/timelineRepository.js";
import dotenv from "dotenv";
import urlMetadata from "url-metadata";
import { addHashtag } from "../services/addHashtag.js";
import extractHashtags from "../utils/extractHashtags.js";

dotenv.config();

export async function Timeline(req, res) {
    const postsArray = []
    const options = {
        descriptionLength: 750
    }
    try {
        const infos = await getPosts();
        infos.rows.map(info => {
            urlMetadata(info.link, options).then(
                function (metadata) { // success handler
                    console.log(metadata)
                    const publicationsInfos = {
                        username: info.username,
                        picture: info.picture,
                        link: info.link,
                        description: info.description,
                        linkPicture: metadata.title,
                        linkTilte: metadata.title,
                        linkDescription: metadata.description
                }
                postsArray.push(publicationsInfos)
                },
                function (error) { // failure handler
                    console.log(error)
                })

        })
        res.status(201).send(postsArray)
    } catch (err) {
        console.log(chalk.red(`ERROR: ${err.message}`))
        res.status(500).send(err.message)
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
