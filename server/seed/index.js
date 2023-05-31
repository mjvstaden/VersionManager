const {
    sequelize,
    System,
    Subsystem,
    Component,
    Dependency,
    User,
    UserSystems
  } = require('../src/models')
  
  const Promise = require('bluebird')
  const systems = require('./systems.json')
  const subsystems = require('./subsystems.json')
  const components = require('./components.json')
  const dependencies = require('./dependencies.json')
  const usersystems = require('./usersystems.json')
  const users = require('./users.json')
  
  sequelize.sync({force: true})
    .then(async function () {
      
      await Promise.all(
      systems.map(system => {
          System.create(system)
        })
      )
  
      await Promise.all(
        subsystems.map(subsystem => {
          Subsystem.create(subsystem)
        })
      )
  
      await Promise.all(
        components.map(component => {
          Component.create(component)
        })
      )

      await Promise.all(
        dependencies.map(dependency => {
          Dependency.create(dependency)
        })
      )

      await Promise.all(
        users.map(user => {
          User.create(user)
        })
      )

      await Promise.all(
        usersystems.map(usersystem => {
          UserSystems.create(usersystem)
        })  
      )
    })