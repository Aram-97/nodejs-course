import joi from "joi";

export const VALIDATORS = {
  updateProductInCart: joi.object().keys({
    productId: joi.string().required(),
    count: joi.number().required(),
  }),
};
