const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const db = require('../config/config.js').db;

const sequelize = new Sequelize(
    db.database,
    db.user,
    db.password,
    db.options
)

fs
    .readdirSync(__dirname)
    .filter((file) => 
        file !== 'index.js'
    )
    .forEach((file) => {
        if (file.slice(-3) === '.js') {
            const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
            db[model?.name] = model
        }     
    })


Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db