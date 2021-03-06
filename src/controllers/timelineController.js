import chalk from "chalk";
import {
    getPosts, getPostsUser, postPosts, postUsers, getPublication, getInfoUser, deletePublication,
    updatePublication, getFollowId, postFollowing, deleteFollowing, catchUsersFollow, verifyFollow, observeAPI
} from "../repositories/timelineRepository.js";
import dotenv from "dotenv";
import urlMetadata from "url-metadata";
import { addHashtag } from "../services/addHashtag.js";
import extractHashtags from "../utils/extractHashtags.js";
import { getTrendingHashtags } from "../repositories/hashtagRepository.js";
import { getFollowingById } from "../repositories/userRepository.js";

dotenv.config();

export async function Timeline(req, res) {
    const { page } = req.query;
    let { id } = req.params;
    id = Number(id);

    const postsArray = []
    const options = {
        descriptionLength: 200
    }

    try {
        const followSomeone = await verifyFollow(id);
        if (followSomeone.rows.length === 0) return res.send("You don't follow anyone yet. Search for new friends!");

        const infos = await getPosts(id, page);

        const following = (await getFollowingById(id)).rows;
        if(infos.rows.length === 0) return res.send("No posts found from your friends");

        for (let info of infos.rows) {
            try {
                const response = await urlMetadata(info.link, options)
                const publicationsInfos = {
                    id: info.id,
                    publisher: info.publisher,
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
                if(info.reposterName !== null) {
                    if(!following.some(user => user.username === info.reposterName)) {
                        continue;
                    }
                }
                postsArray.push(publicationsInfos)

            } catch (e) {
                const publicationsInfos = {
                    id: info.id,
                    publisher: info.publisher,
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
                if(info.reposterName !== null) {
                    if(!following.some(user => user.username === info.reposterName)) {
                        continue;
                    }
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

    const { page } = req.query;
    const { id } = req.params;
    const postsArray = []
    const array = [];
    const options = {
        descriptionLength: 200
    }
    try {
        const infos = await getPostsUser(id, page);
        const infoUser = await getInfoUser(Number(id));

        if (infos.rows.length !== 0) {
            for (let info of infos.rows) {
                try {
                    const response = await urlMetadata(info.link, options)
                    const publicationsInfos = {
                        id: info.id,
                        publisher: info.publisher,
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
        console.log(chalk.red(`ERROR IN GET POSTS: ${err}`))
        res.status(500).json(err)
    }
}

export async function TimelineUsers(req, res) {
    const { value, id } = req.body;
    let array = [];

    try {
        const post = await postUsers(value);
        const follow = await catchUsersFollow(value, id);

        if (follow.rows.length !== 0) {
            for (let user of follow.rows) {
                array.push(user);
            }
        }

        for (let user of post.rows) {
            if (!array.includes(user)) {
                array.push(user);
            }
        }

        for (let i = 0; i < array.length; i++) {
            for (let j = i + 1; j < array.length; j++) {
                if (array[i].username === array[j].username) {
                    array.splice(j, 1);
                }
            }
        }

        res.status(200).send(array);
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

            if (follow.rows.length !== 0) res.send(true);
            else res.send(false);     
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

export async function Observer(req, res) {
    const { id } = req.params
    try {
        const infos = await observeAPI(id)
        res.status(200).send(infos.rows)
    }
    catch (err) {
        console.log(chalk.red(`ERROR: ${err}`))
        return res.status(500).json(err)
    }
}

