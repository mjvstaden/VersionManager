const {Subsystem} = require('../models')
const {Component} = require('../models')

function getUpdatedSubSystem(subsystem_old, subsystem_new) {
  const updated_subsystem = {
      name: "",
      version: "",
      history: false,
      previous_state: subsystem_old.id,
      SystemId: null,
  }

  if (subsystem_new.name === undefined || subsystem_new.name === null) {
      updated_subsystem.name = subsystem_old.name
  } else {  
      updated_subsystem.name = subsystem_new.name
  }

  if (subsystem_new.version === undefined || subsystem_new.version === null) {
    updated_subsystem.version = subsystem_old.version
  } else {
    updated_subsystem.version = subsystem_new.version
  }

  if (subsystem_new.SystemId === undefined || subsystem_new.SystemId === null) {
    updated_subsystem.SystemId = subsystem_old.SystemId
  } else {
    updated_subsystem.SystemId = subsystem_new.SystemId
  }

  return updated_subsystem
}

async function getChildren (subsystem) {
  // console.log("Subsystem", subsystem)
  const children = await Component.findAll({
    where: {
      SubsystemId: subsystem.previous_state,
      history: false
    }
  })
  return children
}

async function deleteChildren (subsystem_id) {
  const children = await Component.findAll({
    where: {
      SubsystemId: subsystem_id,
      history: false
    }
  })
  children.forEach(async (child) => {
    await child.update({ history: true });
  });
}

async function updateComponentIds(subsystem) {
  try {
    const children = await getChildren(subsystem);
    // console.log("Children", children);
    children.forEach(async (child) => {
      await child.update({ SubsystemId: subsystem.id });
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  async index (req, res) {
    try {
      let subsystems = null
      const search = req.query.search
      if (search) {
        subsystems = await Subsystem.findAll({
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
        subsystems = await Subsystem.findAll()
      }
      res.send(subsystems)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to fetch the sub-systems'
      })
    }
  },
  async indexActive (req, res) {
    try {
      let subsystems = null
      const search = req.query.search
      if (search) {
        subsystems = await Subsystem.findAll({
          where: {
            history: false,
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
        subsystems = await Subsystem.findAll({
          where: {
            history: false
          }
        })
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
  async getChildren (req, res) {
    try {
      const children = await Component.findAll({
        where: {
          SubsystemId: req.params.subsystemId,
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
      const subsystem = await Subsystem.create(req.body)
      res.send(subsystem)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to create the sub-system'
      })
    }
  },
  async delete (req, res) {
    try {
      // const subsystem = await Subsystem.findByPk(req.params.subsystemId)
      await Subsystem.update({history: true}, {
        where: {
          id: req.params.subsystemId
        }
      })
      await deleteChildren(req.params.subsystemId)
      res.status(200).send({
        message: 'Sub-system deleted'
      })
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to delete the sub-system'
      })
    }
  },
  async getHistory (req, res) {
    const history = []
    const subsystem = await Subsystem.findByPk(req.params.subsystemId)
    history.push(subsystem)

    if (subsystem.previous_state !== null) {
      let record = await Subsystem.findByPk(subsystem.previous_state)
      history.push(record)
      while (true) {
       try {
        record = await Subsystem.findByPk(record.previous_state)
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
      const subsystem_old = await Subsystem.findByPk(req.params.subsystemId)
      const subsystem_new = req.body
      const updated_subsystem = getUpdatedSubSystem(subsystem_old, subsystem_new)
      const subsystem = await Subsystem.create(updated_subsystem)
      updateComponentIds(subsystem)
      await Subsystem.update({history: true}, {
          where: {
          id: req.params.subsystemId
          }
      })
      res.send(subsystem)
      } catch (err) {
      console.log(err)
      res.status(500).send({
          error: 'an error has occured trying to update the sub-system'
      })
    }
  }
}