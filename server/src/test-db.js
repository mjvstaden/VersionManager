const Sequelize = require('sequelize');
const config =require('./config/config');
const db = require('./config/config.js').db;
const {User} = require('./models');

const sequelize = new Sequelize(db.database, db.user, db.password, db.options);

async function testDBConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  try {

    // Find all users
    const users = await User.findAll();
    console.log("All users:", JSON.stringify(users, null, 2));

    const user = await User.create({email: 'test@gmail.com', password: '123456'});
    console.log('user', user.toJSON());
    } catch (err) {
        console.log('err', err)
  }
}

testDBConnection();
