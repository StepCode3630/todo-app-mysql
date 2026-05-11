const authenticateToken = require('./auth');
const { connectToDatabase, connectToRedis } = require('../config/database');

module.exports = async (app) => {
  try {
    await connectToDatabase();
    const redisClient = await connectToRedis();
    app.locals.redisClient = redisClient;
    console.log('Database connections established');
  } catch (error) {
    console.error('Error establishing database connections:', error);
    process.exit(1);
  }
};

module.exports = {
  authenticateToken
};
