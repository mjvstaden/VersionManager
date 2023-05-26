module.exports = (sequelize, DataTypes) => {
    const Dependency = sequelize.define('Dependency', {
        faulty: DataTypes.BOOLEAN,
        source: DataTypes.INTEGER,
        target: DataTypes.INTEGER,
    }, {
        hooks: {
        }
    });

    Dependency.associate = function(models) {
        Dependency.belongsTo(models.Component, {foreignKey: 'source'});
        Dependency.belongsTo(models.Component, {foreignKey: 'target'});
    }

    return Dependency;
}