const {UserSystems} = require('../models')
const {User} = require('../models')

module.exports = {
    async getAssignedSystems (req, res) {
        try {
            systems = await UserSystems.findAll({
                where: {
                  UserId: req.params.userId,
                }
              })
              let system_ids = systems.map(system => system.SystemId)
              res.send(system_ids)
        }   catch (err) {
            res.status(500).send({
                error: 'an error has occured trying to fetch the systems'
            })
        }
    },
    async assignSystem (req, res) {
        try {
           
        } catch (err) {
            res.status(500).send({
                error: 'an error has occured trying to assign the system'
            })
        }
    },
    async getUsersByRole (req, res) {
        try {
            const users = await User.findAll({
                where: {
                  role: req.params.role,
                }
              })
              res.send(users)
        } catch (err) {
            res.status(500).send({
                error: 'an error has occured trying to fetch the users'
            })
        }
    }
}