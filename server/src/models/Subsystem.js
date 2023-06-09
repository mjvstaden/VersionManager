module.exports = (sequelize, DataTypes) => {
    const Subsystem = sequelize.define('Subsystem', {
        name: DataTypes.STRING,
        version: DataTypes.STRING,
        history: DataTypes.BOOLEAN,
        previous_state: DataTypes.INTEGER,
        color: DataTypes.STRING,
        action: DataTypes.STRING
    }, {
        timestamps: true, 
    });

    Subsystem.associate = function(models) {
        Subsystem.hasMany(models.Component)
        Subsystem.belongsTo(models.System);
    }
    
    return Subsystem;
}