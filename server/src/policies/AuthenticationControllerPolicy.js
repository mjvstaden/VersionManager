const Joi = require('joi');

module.exports = {
  async register(req, res, next) {
    const schema = Joi.object({
      email: Joi.string().email(),
      username: Joi.string(),
      role: Joi.string().valid('Developer', 'SIT', 'Support'),
      password: Joi.string().regex(
        new RegExp('^[a-zA-Z0-9!@#$&()\\-`.+,/\]{8,32}$')
      )
    });

    try {
      const value = await schema.validateAsync(req.body);
      next();
    } catch (error) {
      switch (error.details[0].context.key) {
        case 'email':
          res.status(400).send({
            error: 'You must provide a valid email address.'
          });
          break;
        case 'password':
          res.status(400).send({
            error: `The password provided failed to match the following rules:
                        \n\n
                        1. It must contain ONLY the following characters: lower case, upper case, numerics.
                        \n\n
                        2. It must be at least 8 characters in length and not greater than 32 characters in length.
                    `
          });
          break;
        case 'username':
            res.status(400).send({
                error: 'You must provide a valid username.'
            });
            break;
        case 'role':
            res.status(400).send({
                error: 'You must provide a valid role.'
            });
      }
    }
  }
};
