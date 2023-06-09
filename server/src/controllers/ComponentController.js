const { Op } = require('sequelize')
const {Component} = require('../models')
const {Dependency} = require('../models')

function getUpdatedComponent(component_old, component_new) {
    const updated_component = {
        name: "",
        version: "",
        history: false,
        previous_state: component_old.id,
        SubsystemId: null,
        action: component_new.action
    }

    if (component_new.name === undefined || component_new.name === null) {
        updated_component.name = component_old.name
    } else {  
        updated_component.name = component_new.name
    }

    if (component_new.version === undefined || component_new.version === null) {
      updated_component.version = component_old.version
    } else {
      updated_component.version = component_new.version
    }

    if (component_new.SubsystemId === undefined || component_new.SubsystemId === null) {
      updated_component.SubsystemId = component_old.SubsystemId
    } else {
      updated_component.SubsystemId = component_new.SubsystemId
    }

    return updated_component
}

async function updateDependencies(component_old, component_updated) {
  const dependencies = await Dependency.findAll({
    where: {
      [Op.or]: [
      {source: component_old.id},
      {target: component_old.id}
      ]
    }
  })
  console.log("Dependencies: ", dependencies)

  for (let i = 0; i < dependencies.length; i++) {
    if (dependencies[i].source === component_old.id) {
      dependencies[i].source = component_updated.id
    } else {
      dependencies[i].target = component_updated.id
    }
  }

  for (let i = 0; i < dependencies.length; i++) {
    console.log("Updated dependency: ", dependencies[i])
    console.log("Updated dependency id: ", dependencies[i].id)
    try {
      const update = await Dependency.update({source: dependencies[i].source, target: dependencies[i].target}, {
        where: {
          id: dependencies[i].id
        }
      })
      console.log("Update: ", update)
    }
    catch (err) {
      console.log(err)
    }
}
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
              sequelize.literal('lower(name)'), 
              sequelize.literal('lower(version)'), 
              sequelize.literal('lower(history)') 
            ].map(key => ({
              [key]: {
                $like: `%${search.toLowerCase()}%` 
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
  async indexActive (req, res) {
    try {
      let components = null
      const search = req.query.search
      if (search) {
        components = await Component.findAll({
          where: {
            $or: [
              sequelize.literal('lower(name)'), 
              sequelize.literal('lower(version)'), 
              sequelize.literal('lower(history)') 
            ].map(key => ({
              [key]: {
                $like: `%${search.toLowerCase()}%` 
              }
            }))
          }
        })
      } else {
        components = await Component.findAll({
          where: {
            history: false
          }
        })
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
      const component = await Component.findByPk(req.params.componentId)
      res.send(component)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to show the components'
      })
    }
  },
  async post (req, res) {
    console.log(req.body)
    try {
      const component = await Component.create(req.body)
      res.send(component)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to create the component'
      })
    }
  },
  async delete (req, res) {
    try {
      const component = await Component.findByPk(req.params.componentId)
      await Component.update({history: true}, {
      where: {
        id: req.params.componentId
        }
      })
      res.status(200).send({
        message: 'Component deleted'
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to delete the component'
      })
    }
  },
  async getHistory (req, res) {
    const component_id = req.params.componentId
    const history = []
    const component = await Component.findByPk(component_id)
    history.push(component)

    if (component.previous_state !== null) {
      let record = await Component.findByPk(component.previous_state)
      history.push(record)
      while (true) {
       try {
        record = await Component.findByPk(record.previous_state)
        if (record === null) {
          break
        }
        history.push(record)
        } catch (err) {
          break
       }
      }
    }
    return res.send(history)
  },
  // Implement history functionality 
  async put (req, res) {
    try {
      const component_old = await Component.findByPk(req.params.componentId)
      const component_new = req.body
      const updated_component = getUpdatedComponent(component_old, component_new)
      
      const component = await Component.create(updated_component)
      .then(component => {
        updateDependencies(component_old, component)
      })
      .catch(err => {
        console.log(err)
      })
      await Component.update({history: true}, {
          where: {
          id: req.params.componentId
          }
      })
      res.send(component)
      } catch (err) {
      res.status(500).send({
          error: 'an error has occured trying to update the component'
      })
    }
  },
}