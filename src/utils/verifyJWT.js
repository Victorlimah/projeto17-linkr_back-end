import chalk from "chalk";
import jwt from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) return res.status(401).send({ error: "No token provided" });

        token = token.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return res.status(401).send({ error: "Invalid token" });

        res.locals.user = decoded;
        next();
    } catch (err) {
        console.log(chalk.red(`ERROR VERIFYING JWT: ${err}`));
        return res.status(401).send({message: "Auth failed" });
    }
}