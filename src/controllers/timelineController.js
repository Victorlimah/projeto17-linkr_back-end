import chalk from "chalk";
import {
    getPosts, getPostsUser, postPosts, postUsers, getPublication, getInfoUser, deletePublication,
    updatePublication, getFollowId, postFollowing, deleteFollowing
} from "../repositories/timelineRepository.js";
import dotenv from "dotenv";
import urlMetadata from "url-metadata";
import { addHashtag } from "../services/addHashtag.js";
import extractHashtags from "../utils/extractHashtags.js";
import { getTrendingHashtags } from "../repositories/hashtagRepository.js";

dotenv.config();

export async function Timeline(_req, res) {
    const postsArray = []
    const options = {
        descriptionLength: 200
    }
    try {
        const infos = await getPosts();
        for (let info of infos.rows) {
            try {
                const response = await urlMetadata(info.link, options)
                const publicationsInfos = {
                    id: info.id,
                    username: info.username,
                    picture: info.picture,
                    link: info.link,
                    description: info.description,
                    originalPost: info.originalPost,
                    reposterName: info.reposterName,
                    linkPicture: response.image,
                    linkTitle: response.title,
                    linkDescription: response.description
                }
                postsArray.push(publicationsInfos)

            } catch (e) {
                const publicationsInfos = {
                    id: info.id,
                    username: info.username,
                    picture: info.picture,
                    link: info.link,
                    description: info.description,
                    originalPost: info.originalPost,
                    reposterName: info.reposterName,
                    linkPicture: undefined,
                    linkTitle: undefined,
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

export async function TimelineUser(req, res) {

    const { id } = req.params;
    const postsArray = []
    const array = [];
    const options = {
        descriptionLength: 200
    }
    try {
        const infos = await getPostsUser(id);
        const infoUser = await getInfoUser(id);

        if (infos.rows.length !== 0) {
            for (let info of infos.rows) {
                try {
                    const response = await urlMetadata(info.link, options)
                    const publicationsInfos = {
                      id: info.id,
                      username: info.username,
                      picture: info.picture,
                      link: info.link,
                      description: info.description,
                      originalPost: info.originalPost,
                      reposterName: info.reposterName,
                      linkPicture: response.image,
                      linkTitle: response.title,
                      linkDescription: response.description,
                    };
                    postsArray.push(publicationsInfos)

                } catch (e) {
                    const publicationsInfos = {
                        id: info.id,
                        username: info.username,
                        picture: info.picture,
                        link: info.link,
                        description: info.description,
                        originalPost: info.originalPost,
                        reposterName: info.reposterName,
                        linkPicture: undefined,
                        linkTilte: undefined,
                        linkDescription: undefined
                    }
                    postsArray.push(publicationsInfos)
                }
            }
            array.push(infoUser.rows[0]);
            array.push(postsArray);
            res.status(200).send(array);
        } else if (infos.rows.length === 0 && infoUser.rows.length !== 0) {
            res.status(200).send(infoUser.rows);
        } else {
            res.send();
        }
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
        if (hashtags?.length > 0)
            await addHashtag(post.rows[0].id, hashtags);
        res.status(201).send("Url posted succesfully");
    } catch (err) {
        console.log(chalk.red(`ERROR on PostUrl: ${err.message}`))
        res.status(500).send(`ERROR: ${err.message}`);
    }
}

export async function postFollow(req, res) {

    const { follower, following } = req.body;

    try {

        if (Number(follower) !== Number(following)) {
            const follow = await getFollowId(follower, following);

            if (follow.rows.length !== 0) {
                res.send(true);
            } else {
                res.send(false);
            }
        }

    } catch (err) {
        console.log(chalk.red(`ERROR on postFollow: ${err.message}`))
        res.status(500).send(`ERROR: ${err.message}`);
    }
}

export async function postFollowUser(req, res) {

    const { follower, following } = req.body;

    try {

        if (Number(follower) !== Number(following)) {
            const follow = await getFollowId(follower, following);

            if (follow.rows.length === 0) {
                await postFollowing(follower, following);
                res.status(201).send(true);
            } else {
                await deleteFollowing(follower, following);
                res.status(201).send(false);
            }
        }
    } catch (err) {
        console.log(chalk.red(`ERROR on postFollow: ${err.message}`))
        res.status(500).send(`ERROR: ${err.message}`);
    }
}

export async function getTrending(req, res) {
    try {
        const search = await getTrendingHashtags()
        if (!search.rows) return res.sendStatus(404)

        const hashtags = search.rows
        res.status(200).send(hashtags)
    } catch (e) {
        console.log(e, "Error on getHashtags")
        return res.sendStatus(500)
    }
}

export async function getSpecificPublication(req, res) {
    const { postId } = req.params

    try {
        const search = await getPublication(postId)
        return res.status(200).send(search.rows[0])
    } catch (e) {
        console.log(e, "Error on getSpecificPublication")
        return res.sendStatus(500)
    }
}

export async function DeleteUserPost(req, res) {
    const post = Number(req.headers.publicationid)
    if (!post) return res.sendStatus(422)

    try {
        await deletePublication(post)
        return res.sendStatus(200)
    } catch (e) {
        console.log(e, "Error on DeleteUserPost")
        return res.sendStatus(500)
    }
}

export async function PutPost(req, res) {
    const post = Number(req.headers.publicationid)
    const { description } = req.body

    if (!post) return res.sendStatus(422);

    try {
        await updatePublication(post, description)
        return res.sendStatus(200)
    } catch (err) {
        console.log(chalk.red(`ERROR: ${err}`))
        return res.status(500).json(err)
    }
}
