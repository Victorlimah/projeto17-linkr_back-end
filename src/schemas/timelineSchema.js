import joi from "joi";

export const publishSchema = joi.object({
    url: joi.string().uri().required(),
    description: joi.string().required()
})