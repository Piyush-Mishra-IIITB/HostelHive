const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().min(3).required(),

    description: Joi.string().min(10).required(),

    image: Joi.object({
      url: Joi.string().uri().allow("", null)
    }).optional(),

    price: Joi.number().min(0).required(),

    location: Joi.string().required(),

    country: Joi.string().required(),
  }).required()
});

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required()
});