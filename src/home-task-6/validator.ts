import joi from "joi";

export const VALIDATORS = {
  updateCart: joi.object().keys({
    id: joi.string().required(),
    items: joi.array().items(
      joi.object().keys({
        count: joi.number().required(),
        product: joi.object().keys({
          id: joi.string().required(),
          title: joi.string().required(),
          description: joi.string().required(),
          price: joi.number().required(),
        }),
      })
    ),
  }),
};
