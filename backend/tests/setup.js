process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const { User, Todo } = require('../models');

beforeAll(async () => {
  const uri = process.env.DB_URL || 'mongodb://127.0.0.1:27017/db_todoapp_test';
  await mongoose.connect(uri);
  global.models = { User, Todo };
});

beforeEach(async () => {
  await Promise.all([Todo.deleteMany({}), User.deleteMany({})]);
});

afterAll(async () => {
  await mongoose.connection.close();
});
