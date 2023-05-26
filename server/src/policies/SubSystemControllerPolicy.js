const Joi = require('joi');

module.exports = {
  async post(req, res, next) {
    const schema = Joi.object({
      name: Joi.string().required(),
      version: Joi.string(),
      history: Joi.number(),
      SystemId: Joi.number().integer().min(1).required()
    });

    try {
      const value = await schema.validateAsync(req.body);
      next();
    } catch (error) {
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
