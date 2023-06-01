const Joi = require('joi');

module.exports = {
  async post(req, res, next) {
    const schema = Joi.object({
      name: Joi.string().required(),
      version: Joi.string(),
      history: Joi.number(),
      SubsystemId: Joi.number().integer().min(1).required(),
      action: Joi.string(),
    });
    try {
      const value = await schema.validateAsync(req.body);
      next();
    } catch (error) {
      console.log(error);
      switch (error.details[0].context.key) {
        case 'name':
          res.status(400).send({
            error: 'You must provide a name for the component.'
          });
          break;
        case 'SubsystemId':
          res.status(400).send({
            error: `You must provide a valid sub-system id for the component.`
          });
          break;
      }
    }
  },
  
  async put(req, res, next) {
    const schema = Joi.object({
      id: Joi.number().integer().min(1).required(),
      name: Joi.string().required(),
      version: Joi.string(),
      history: Joi.number(),
      SubsystemId: Joi.number().integer().min(1),
      action: Joi.string(),
    });

    try {
      const value = await schema.validateAsync(req.body);
      next();
    } catch (error) {
      console.log(error);
      switch (error.details[0].context.key) {
        case 'name':
          res.status(400).send({
            error: 'You must provide a name for the component.'
          });
          break;
        case 'SubsystemId':
          res.status(400).send({
            error: `You must provide a valid sub-system id for the component.`
          });
          break;
      }
    }
  },
};
