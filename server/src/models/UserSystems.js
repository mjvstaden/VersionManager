module.exports = (sequelize, DataTypes) => {
    const UserSystems = sequelize.define('UserSystems', {
        UserId: DataTypes.INTEGER,
        SystemId: DataTypes.INTEGER
    });
    return UserSystems;
}
