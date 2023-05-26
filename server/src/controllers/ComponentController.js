const {Component} = require('../models')

module.exports = {
  async index (req, res) {
    try {
      let components = null
      const search = req.query.search
      if (search) {
        components = await Component.findAll({
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
        components = await Component.findAll()
      }
      res.send(components)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to fetch the components'
      })
    }
  },
  async show (req, res) {
    try {
      const component = await Component.findById(req.params.componentId)
      res.send(component)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to show the components'
      })
    }
  },
  async post (req, res) {
    try {
      const component = await Component.create(req.body)
      res.send(component)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to create the component'
      })
    }
  },
  async put (req, res) {
    try {
      await Component.update(req.body, {
        where: {
          id: req.params.componentId
        }
      })
      res.send(req.body)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to update the component'
      })
    }
  }
}