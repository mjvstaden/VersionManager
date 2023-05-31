const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

function hashPassword(user, options) {
    const SALT_FACTOR = 8

    if (!user.changed('password')) {
        return;
    }

    return bcrypt
        .genSaltAsync(SALT_FACTOR)
        .then(salt => bcrypt.hashAsync(user.password, salt, null))
        .then(hash => {
            user.setDataValue('password', hash);
        }
    );
}

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        username: DataTypes.STRING,
        role: DataTypes.STRING,
        password: DataTypes.STRING
    }, {
        hooks: {
        //   beforeCreate: hashPassword,
        //   beforeUpdate: hashPassword,
        //   beforeSave: hashPassword
        }
    });
    User.associate = function(models) {
        User.belongsToMany(models.System, {through: 'SystemsUsers'})
    },
    User.prototype.comparePassword = async function (password) {
        await bcrypt.compare(password, this.password).then(function (result) {
            console.log("\n\n Result: " + result + "\n\n")
            return result;
        });
    }
    return User;
}