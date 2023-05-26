const {Component} = require('../models')


// Write a function that compares two components (an one and a update that needs to happen) and return a list of changes
function getUpdatedComponent(component_old, component_new) {
    const updated_component = {
        name: "",
        version: "",
        history: false,
        previous_state: component_old.id,
        subsystemId: null,
    }

    if (component_new.name !== null) {
        updated_component.name = component_new.name
    } else {
        updated_component.name = component_old.name
    }
   
    if (component_new.version !== null) {
        updated_component.version = component_new.version
    } else {
        updated_component.version = component_old.version
    }

    if (component_new.subsystemId !== null) {
        updated_component.subsystemId = component_new.subsystemId
    } else {
        updated_component.subsystemId = component_old.subsystemId
    }

    return updated_component
}

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
      console.log('req.params.componentId', req.params.componentId)
      const component = await Component.findByPk(req.params.componentId)
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
    // Implement history functionality 
    async put (req, res) {
        try {
            const component_old = await Component.findByPk(req.params.componentId)
            const component_new = req.body
            const updated_component = getUpdatedComponent(component_old, component_new)

            //  Create new component with the updated values
            const component = await Component.create(updated_component)

            //  Update the old component to have history = true
            await Component.update({history: true}, {
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