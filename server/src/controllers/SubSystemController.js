const {Subsystem} = require('../models')

module.exports = {
  async index (req, res) {
    try {
      let subsystems = null
      const search = req.query.search
      if (search) {
        subsystems = await Subsystem.findAll({
          where: {
            $or: [
              'name', 'version', 'history', 
            ].map(key => ({
              [key]: {
                $like: `%${search}%`
              }
            }))
          }
        })
      } else {
        subsystems = await Subsystem.findAll()
      }
      res.send(subsystems)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to fetch the sub-systems'
      })
    }
  },
  async show (req, res) {
    try {
      const subsystem = await Subsystem.findByPk(req.params.subsystemId)
      res.send(subsystem)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to show the sub-systems'
      })
    }
  },
  async post (req, res) {
    try {
      const subsystem = await Subsystem.create(req.body)
      res.send(subsystem)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to create the sub-system'
      })
    }
  },
  async put (req, res) {
    try {
      await Subsystem.update(req.body, {
        where: {
          id: req.params.subsystemId
        }
      })
      res.send(req.body)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to update the sub-system'
      })
    }
  }
}