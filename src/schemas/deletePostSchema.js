import Joi from "joi";

export const deletePostSchema = Joi.object({
    userId: Joi.number().required(),
    publicationId: Joi.number().required(),
})