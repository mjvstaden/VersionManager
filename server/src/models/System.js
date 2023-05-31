module.exports = (sequelize, DataTypes) => {
    const System = sequelize.define('System', {
        name: DataTypes.STRING,
    }, {
        hooks: {
        }
    });
    System.associate = function(models) {
        System.hasMany(models.Subsystem)
        System.belongsToMany(models.User, {through: 'SystemsUsers'})
    }

    return System;
}