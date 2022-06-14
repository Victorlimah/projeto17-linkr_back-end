import chalk from "chalk";
import bcrypt from "bcrypt";
import { stripHtml } from "string-strip-html";

export async function sanitizeData(req, res, next) {
    let { username, email, password, picture } = req.body;
    try{
        res.locals.username = stripHtml(username).result.trim();
        res.locals.email = stripHtml(email).result.trim();
        password = stripHtml(password).result.trim();
        res.locals.password = bcrypt.hashSync(password, 10);
        res.locals.picture = stripHtml(picture).result.trim();
        next();
    } catch(err){
        console.log(chalk.red(`ERROR SANITIZING DATA: ${err}`));
        res.status(500).send({error: err.message});
    }
}
