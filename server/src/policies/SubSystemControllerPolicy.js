const Joi = require('joi');

module.exports = {
  async post(req, res, next) {
    const schema = Joi.object({
      name: Joi.string().required(),
      version: Joi.string(),
      history: Joi.number(),
      SystemId: Joi.number().integer().min(1).required(),
      color: Joi.string().regex(/^#[0-9A-F]{6}$/i)
    });

    try {
      const value = await schema.validateAsync(req.body);
      next();
    } catch (error) {
      console.log(error);
      switch (error.details[0].context.key) {
        case 'name':
          res.status(400).send({
            error: 'You must provide a name for the sub-system.'
          });
          break;
        case 'SystemId':
          res.status(400).send({
            error: `You must provide a valid system id for the component.`
          });
          break;
      }
    }
  },
   
  async put(req, res, next) {
    const schema = Joi.object({
      id: Joi.number().integer().min(1).required(),
      name: Joi.string().min(2).max(30),
      version: Joi.string(),
      history: Joi.number().min(0).max(1),
      SystemId: Joi.number().integer().min(1),
      action: Joi.string(),
      color: Joi.string().regex(/^#[0-9A-F]{6}$/i)
    });

    try {
      const value = await schema.validateAsync(req.body);
      next();
    } catch (error) {
      console.log(error);
      switch (error.details[0].context.key) {
        case 'name':
          res.status(400).send({
            error: 'You must provide a name for the sub-system.'
          });
          break;
        case 'SystemId':
          res.status(400).send({
            error: `You must provide a valid system id for the component.`
          });
          break;
      }
    }
  }
};
