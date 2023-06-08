const {UserSystems} = require('../models')

module.exports = {
    async bulkCreate(req, res) {
        try {
            const userSystems = await UserSystems.bulkCreate(req.body)
            res.send(userSystems)
        } catch (err) {
            res.status(500).send({
                error: 'an error has occured trying to assign system to users.'
            })
        }
    },
}