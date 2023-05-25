module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        username: DataTypes.STRING,
        role: DataTypes.STRING,
        password: DataTypes.STRING
    });
    return User;
}