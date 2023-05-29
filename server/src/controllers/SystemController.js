const {System} = require('../models')
const {Subsystem} = require('../models')

module.exports = {
  async index (req, res) {
    try {
      let systems = null
      const search = req.query.search
      if (search) {
        systems = await System.findAll({
          where: {
            $or: [
              'name', 
            ].map(key => ({
              [key]: {
                $like: `%${search}%`
              }
            }))
          }
        })
      } else {
        systems = await System.findAll()
      }
      res.send(systems)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to fetch the systems'
      })
    }
  },
  async show (req, res) {
    try {
      const system = await System.findByPk(req.params.systemId)
      res.send(system)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to show the systems'
      })
    }
  },
  async getChildren (req, res) {
    try {
      const children = await Subsystem.findAll({
        where: {
          SystemId: req.params.systemId,
          history: false
        }
      })
      res.send(children)
    }
    catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to fetch the sub-system children'
      })
    }
  },
  async post (req, res) {
    try {
      const system = await System.create(req.body)
      res.send(system)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to create the system'
      })
    }
  },
  async put (req, res) {
    try {
      await System.update(req.body, {
        where: {
          id: req.params.systemId
        }
      })
      res.send(req.body)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to update the system'
      })
    }
  }
}