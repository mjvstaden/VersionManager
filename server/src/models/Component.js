module.exports = (sequelize, DataTypes) => {
    const Component = sequelize.define('Component', {
        name: DataTypes.STRING,
        version: DataTypes.STRING,
        history: DataTypes.BOOLEAN,
    }, {
        hooks: {
        }
    });

    Component.associate = function(models) {
        Component.belongsTo(models.Subsystem);
        // Component.hasMany(models.Dependency);
    }
    
    return Component;
}