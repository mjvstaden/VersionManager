const AuthenticationController = require("./controllers/AuthenticationController")
const SystemController = require("./controllers/SystemController")
const SubSystemController = require("./controllers/SubSystemController")
const ComponentController = require("./controllers/ComponentController")
const AuthenticationControllerPolicy = require("./policies/AuthenticationControllerPolicy")
const ComponentControllerPolicy = require("./policies/ComponentControllerPolicy")
const SubSystemControllerPolicy = require("./policies/SubSystemControllerPolicy")

module.exports = function(app) {
    app.post('/register', 
        AuthenticationControllerPolicy.register,
        AuthenticationController.register)
    app.post('/login', 
        AuthenticationController.login)

    app.get('/systems',
        SystemController.index)
    app.get('/systems/:systemId',
        SystemController.show)
    app.put('/systems/:systemId',
        SystemController.put)
    app.post('/systems',
        SystemController.post)

    app.get('/subsystems',
        SubSystemController.index)
    app.get('/subsystems/:subsystemId',
        SubSystemController.show)
    app.put('/subsystems/:subsystemId',
        SubSystemController.put)
    app.post('/subsystems',
        SubSystemControllerPolicy.post,
        SubSystemController.post)

    app.get('/components',
        ComponentController.index)
    app.get('/components/:componentId',
        ComponentController.show)
    app.put('/components/:componentId',
        ComponentController.put)
    app.post('/components',
        ComponentControllerPolicy.post,
        ComponentController.post)
}
