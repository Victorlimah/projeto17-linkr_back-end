import chalk from "chalk";
import { getPosts } from "../repositories/timelineRepository.js";
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
    try {
        
    }
}
