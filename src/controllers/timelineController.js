import chalk from "chalk";
import { getPosts, postPosts } from "../repositories/timelineRepository.js";
import dotenv from "dotenv";

dotenv.config();

export async function Timeline(req, res) {
    try {
        const infos = await getPosts();
        res.status(201).send(infos.rows)
    } catch(err) {
        console.log(chalk.red(`ERROR: ${err.message}`))
        res.status(500).send(err.message)
    }
}

export async function PostUrl(req, res) {
    const { url, description } = req.body;

    try {
        await postPosts(url, description);
        res.status(201).send("Url posted succesfully");
    } catch(err) {
        console.log(chalk.red(`ERROR: ${err.message}`))
        res.send(500).send(err.message);
    }
}
