const User = require('./src/models/User');
const sequelize = require('./src/config/db');

async function check() {
  try {
    await sequelize.authenticate();
    const users = await User.findAll();
    console.log(`Found ${users.length} users:`);
    users.forEach(u => console.log(u.email, u.name, u.role));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}
check();
