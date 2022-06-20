import chalk from "chalk";
import urlMetadata from "url-metadata";
import { getTimelineByHashtag } from "../repositories/hashtagRepository.js";

export async function hashtagTimeline(req, res) {
    const hashtag = req.params
    const postsArray = []
    const options = {
        descriptionLength: 200
    }
    try {
        const infos = await getTimelineByHashtag(hashtag);
        for(let info of infos.rows) {
            const metadata = await urlMetadata(info.link, options)
            const publicationsInfos = {
                id: info.id,
                username: info.username,
                picture: info.picture,
                link: info.link,
                description: info.description,
                linkPicture: metadata.picture,
                linkTitle: metadata.title,
                linkDescription: metadata.description
            }
            postsArray.push(publicationsInfos)
        }

        res.status(201).send(postsArray)
    } catch (err) {
        console.log(chalk.red(`ERROR on hashtagTimeline: ${err.message}`))
        res.status(500).send(err.message)
    }
}