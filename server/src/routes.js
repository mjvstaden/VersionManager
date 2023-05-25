const AuthenticationController = require("./controllers/AuthenticationController")
const AuthenticationControllerPolicy = require("./policies/AuthenticationControllerPolicy")

module.exports = function(app) {
    app.post('/register', 
        AuthenticationControllerPolicy.register,
        AuthenticationController.register)
}
