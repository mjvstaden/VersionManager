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
      id: Joi.number().integer().min(1).required(),
      faulty: Joi.number().integer().min(0).max(1).required()
    });

    try {
      const value = await schema.validateAsync(req.body);
      next();
    } catch (error) {
      console.log(error)
      switch (error.details[0].context.key) {
        case 'id':
          res.status(400).send({
            error: 'You must provide a vaild component id for the dependency soure.'
          });
          break;
        case 'faulty':
          res.status(400).send({
            error: `You must provide a valid status for the dependency.`
          });
          break;
      }
    }
  },
};
