// Controllers 
const AuthenticationController = require("./controllers/AuthenticationController")
const SystemController = require("./controllers/SystemController")
const SubSystemController = require("./controllers/SubSystemController")
const ComponentController = require("./controllers/ComponentController")
const DependencyController = require("./controllers/DependencyController")
// Policies 
const AuthenticationControllerPolicy = require("./policies/AuthenticationControllerPolicy")
const ComponentControllerPolicy = require("./policies/ComponentControllerPolicy")
const SubSystemControllerPolicy = require("./policies/SubSystemControllerPolicy")
const SystemControllerPolicy = require("./policies/SystemControllerPolicy")
const DependencyControllerPolicy = require("./policies/DependencyControllerPolicy")

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
        SystemControllerPolicy.put,
        SystemController.put)
    app.post('/systems',
        SystemControllerPolicy.post,
        SystemController.post)

    app.get('/subsystems',
        SubSystemController.index)
    app.get('/subsystems/:subsystemId',
        SubSystemController.show)
    app.put('/subsystems/:subsystemId',
        SubSystemControllerPolicy.put,
        SubSystemController.put)
    app.post('/subsystems',
        SubSystemControllerPolicy.post,
        SubSystemController.post)

    app.get('/components',
        ComponentController.index)
    app.get('/components/:componentId',
        ComponentController.show)
    app.put('/components/:componentId',
        ComponentControllerPolicy.put,
        ComponentController.put)
    app.post('/components',
        ComponentControllerPolicy.post,
        ComponentController.post)

    app.get('/dependencies',
        DependencyController.index)
    app.get('/dependencies/:dependenciesId',
        DependencyController.show)
    app.put('/dependencies/:dependenciesId',
        DependencyControllerPolicy.put,
        DependencyController.put)
    app.post('/dependencies',
        DependencyControllerPolicy.post,
        DependencyController.post)
}
