const mongoose = require('mongoose');

async function connectToDatabase() {
  if (!process.env.DB_URL) {
    throw new Error('Missing DB_URL environment variable');
  }

  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

module.exports = {
  connectToDatabase
};
