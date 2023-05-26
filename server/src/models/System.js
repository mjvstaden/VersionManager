module.exports = (sequelize, DataTypes) => {
    const System = sequelize.define('System', {
        name: DataTypes.STRING,
    }, {
        hooks: {
        }
    });
    System.associate = function(models) {
        System.hasMany(models.Subsystem)
    }

    return System;
}