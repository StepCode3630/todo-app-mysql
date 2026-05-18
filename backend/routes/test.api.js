const router = require('express').Router();
const { User, Todo } = require('../models');

router.post('/reset', async (req, res) => {
  try {
    await Promise.all([Todo.deleteMany({}), User.deleteMany({})]);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('TEST RESET failed:', err);
    return res.status(500).json({ ok: false, error: 'reset_failed' });
  }
});

module.exports = router;
