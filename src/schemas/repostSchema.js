import joi from "joi";

export const repostSchema = joi.object({
  url: joi.string().uri().required(),
  description: joi.string(),
  reposterName: joi.required(),
  publicationId: joi.required()
})