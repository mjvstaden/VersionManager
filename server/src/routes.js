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
const UserController = require("./controllers/UserController")

module.exports = function(app) {
    app.post('/register', 
        AuthenticationControllerPolicy.register,
        AuthenticationController.register)
    app.post('/login', 
        AuthenticationController.login)
    app.get('/users/all',
        AuthenticationController.index)
    app.get('/users/systems/:userId',
        UserController.getAssignedSystems)
    

    app.get('/systems',
        SystemController.index)
    app.get('/systems/:systemId',
        SystemController.show)
    app.get('/systems/children/:systemId',
        SystemController.getChildren)
    app.put('/systems/:systemId',
        SystemControllerPolicy.put,
        SystemController.put)
    app.post('/systems',
        SystemControllerPolicy.post,
        SystemController.post)

    app.get('/subsystems/all',
        SubSystemController.index)
    app.get('/subsystems/active',
        SubSystemController.indexActive)
    app.get('/subsystems/:subsystemId',
        SubSystemController.show)
    app.get('/subsystems/children/:subsystemId',
        SubSystemController.getChildren)
    app.get('/subsystems/history/:subsystemId',
        SubSystemController.getHistory)
    app.put('/subsystems/:subsystemId',
        SubSystemControllerPolicy.put,
        SubSystemController.put)
    app.post('/subsystems',
        SubSystemControllerPolicy.post,
        SubSystemController.post)
    app.put('/subsystems/delete/:subsystemId',
        SubSystemController.delete)

    app.get('/components/all',
        ComponentController.index)
    app.get('/components/active',
        ComponentController.indexActive)
    app.get('/components/:componentId',
        ComponentController.show)
    app.get('/components/history/:componentId',
        ComponentController.getHistory)
    app.put('/components/:componentId',
        ComponentControllerPolicy.put,
        ComponentController.put)
    app.post('/components',
        ComponentControllerPolicy.post,
        ComponentController.post)
    app.put('/components/delete/:componentId',
        ComponentController.delete)

    app.get('/dependencies/all',
        DependencyController.index)
    // app.get('/dependencies/active',
    //     DependencyController.indexActive)
    app.get('/dependencies/:sourceId/:targetId',
        DependencyController.show)
    app.put('/dependencies/:dependenciesId',
        DependencyControllerPolicy.put,
        DependencyController.put)
    app.post('/dependencies',
        DependencyControllerPolicy.post,
        DependencyController.post)
    app.delete('/dependencies/:dependencyId',
        DependencyController.delete)
}
