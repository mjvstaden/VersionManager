const Joi = require('joi');

module.exports = {
  async post(req, res, next) {
    const schema = Joi.object({
      source: Joi.number().integer().min(1).required(),
      target: Joi.number().integer().min(1).required(),
      faulty: Joi.boolean().required()
    });

    try {
      const value = await schema.validateAsync(req.body);
      next();
    } catch (error) {
      switch (error.details[0].context.key) {
        case 'source':
          res.status(400).send({
            error: 'You must provide a vaild component id for the dependency soure.'
          });
          break;
        case 'target':
          res.status(400).send({
            error: `You must provide a valid component id for the dependency target.`
          });
          break;
      }
    }
  },
  
  async put(req, res, next) {
    const schema = Joi.object({
      source: Joi.number().integer().min(1).required(),
      target: Joi.number().integer().min(1).required(),
      faulty: Joi.boolean().required()
    });

    try {
      const value = await schema.validateAsync(req.body);
      next();
    } catch (error) {
      switch (error.details[0].context.key) {
        case 'source':
          res.status(400).send({
            error: 'You must provide a vaild component id for the dependency soure.'
          });
          break;
        case 'target':
          res.status(400).send({
            error: `You must provide a valid component id for the dependency target.`
          });
          break;
      }
    }
  },
};
