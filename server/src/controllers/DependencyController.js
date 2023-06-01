const {Dependency} = require('../models')

module.exports = {
  async index (req, res) {
    try {
      let dependencies = null
      const search = req.query.search
      if (search) {
        dependencies = await Dependency.findAll()
      } else {
        dependencies = await Dependency.findAll()
      }
      res.send(dependencies)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to fetch the dependencies'
      })
    }
  },
  async show (req, res) {
    try {
      const dependency = await Dependency.findAll({
        where: {
          source: req.params.sourceId,
          target: req.params.targetId
        }
      })
      res.send(dependency)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to show the dependency'
      })
    }
  },
  async post (req, res) {
    try {
      const dependency = await Dependency.create(req.body)
      res.send(dependency)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to create the dependency'
      })
    }
  },
  async put (req, res) {
    try {
      await dependency.update(req.body, {
        where: {
          id: req.params.dependencyId
        }
      })
      res.send(req.body)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to update the dependency'
      })
    }
  }
}