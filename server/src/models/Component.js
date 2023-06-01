module.exports = (sequelize, DataTypes) => {
    const Component = sequelize.define('Component', {
        name: DataTypes.STRING,
        version: DataTypes.STRING,
        history: DataTypes.BOOLEAN,
        previous_state: DataTypes.INTEGER,
        action: DataTypes.STRING,
    });

    Component.associate = function(models) {
        Component.belongsTo(models.Subsystem);
        Component.belongsTo(models.User);
    }
    
    return Component;
}