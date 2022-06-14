import Joi from "joi";

export const userSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    picture: Joi.string().uri().required()
})