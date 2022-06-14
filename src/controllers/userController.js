import chalk from "chalk";
import { newUser } from "../repositories/userRepository.js";

export async function createUser(_req, res) {
    const { username, email, password, picture} = res.locals;
    try{
       await newUser(username, email, password, picture);
        res.status(201).send({message: "User created successfully"});
    } catch(err){
        console.log(chalk.red(`ERROR CREATING USER: ${err}`));

        if(err.message.includes("duplicate key value violates unique constraint"))
            return res.status(409).send({error: "User already exists"});

        res.status(500).send({error: err.message});
    }
}
