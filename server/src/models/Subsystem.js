module.exports = (sequelize, DataTypes) => {
    const Subsystem = sequelize.define('Subsystem', {
        name: DataTypes.STRING,
        version: DataTypes.STRING,
        history: DataTypes.BOOLEAN,
    }, {
        hooks: {
        }
    });

    Subsystem.associate = function(models) {
        Subsystem.hasMany(models.Component)
        Subsystem.belongsTo(models.System);
        Subsystem.hasMany(models.Component);
    }
    
    return Subsystem;
}