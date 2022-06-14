import chalk from "chalk";
import { stripHtml } from "string-strip-html";

export async function sanitizeDataLogin(req, res, next) {
  let { email, password } = req.body;
  try {
    res.locals.email = stripHtml(email).result.trim();
    res.locals.password = stripHtml(password).result.trim();
    next();
  } catch (err) {
    console.log(chalk.red(`ERROR SANITIZING DATA: ${err}`));
    res.status(500).send({ error: err.message });
  }
}
