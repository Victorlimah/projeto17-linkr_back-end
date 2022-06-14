import chalk from "chalk";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { getUser, insertToken } from "../repositories/authRepository.js";

dotenv.config();

export async function SignIn(_req, res){
    try{
        let { email, password } = res.locals;

        let user = await getUser("email", email);
        if(user.rows.length === 0) return res.status(401).send({ error: "Invalid credentials" });

        let { password: pass } = user.rows[0];
        let isPasswordValid = bcrypt.compareSync(password, pass);
        if(!isPasswordValid) return res.status(401).send({ error: "Invalid credentials" });   

        const dataToken = { id: user.rows[0].id, name: user.rows[0].name};

        let token = jwt.sign(dataToken, process.env.JWT_SECRET, {expiresIn: "1h"});
        await insertToken(user.rows[0].id, token);

        return res.status(200).send({ token });
    } catch(err){
        console.log(chalk.red(`ERROR SIGNING IN: ${err}`));
        res.status(500).send({ error: err.message });
    }
}