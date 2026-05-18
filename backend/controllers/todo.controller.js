const mongoose = require('mongoose');

const cleanTodo = (todo) => {
  const obj = todo.toObject();
  return {
    id: obj._id.toString(),
    text: obj.text,
    date: obj.date,
    completed: obj.completed
  };
};

const TodoController = {
  createTodo: async (req, res) => {
    try {
      const user_id = req.sub;
      const { text, date } = req.body;
      const { Todo } = req.app.locals.models;

      await Todo.create({
        text: text,
        date: date,
        completed: false,
        user_id: user_id
      });
    } catch (error) {
      console.error('ADD TODO: ', error);
      return res.status(500).json({ message: "Erreur lors de l'ajout de la tâche !" });
    }
  },
  getAllTodo: async (req, res) => {
    const user_id = req.sub;
    const { Todo } = req.app.locals.models;
    try {
      const todos = await Todo.find({ user_id }).sort({ date: 1 }).select('-user_id');
      return res.status(200).json(todos.map((todo) => cleanTodo(todo)));
    } catch (error) {
      console.error('GET ALL TODO: ', error);
      return res.status(500).json({ message: 'Erreur lors de la récupération des tâches !' });
    }
  },
  editTodo: async (req, res) => {
    try {
      const { Todo } = req.app.locals.models;
      const user_id = req.sub;
      const todo_id = req.params.id;
      const { completed, text, date } = req.body;

      const todo = await Todo.findOneAndUpdate(
        { _id: todo_id, user_id: user_id },
        { completed, text, date },
        { returnDocument: 'after' }
      );

      if (!todo) return res.status(404).json({ message: 'Not found' });

      return res.json(cleanTodo(todo));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error updating todo' });
    }
  },

  deleteTodo: async (req, res) => {
    try {
      const user_id = req.sub;
      const todo_id = req.params.id;
      const query = { _id: todo_id, user_id: user_id };

      const { Todo } = req.app.locals.models;

      const deleted = await Todo.findOneAndDelete(query);

      if (!deleted) {
        return res.status(404).json({ message: 'Todo not found' });
      }

      return res.status(200).json({ id: todo_id });
    } catch (error) {
      console.error('DELETE TODO:', error);
      return res.status(500).json({ message: 'Error deleting todo' });
    }
  },
  getSearchTodo: async (req, res) => {
    try {
      const user_id = new mongoose.Types.ObjectId(req.sub);
      const query = req.query.q;
      const { Todo } = req.app.locals.models;

      const todos = await Todo.find({ user_id, $text: { $search: query } })
        .sort({ date: 1 })
        .select('-user_id');

      console.log('SEARCH TODO: ', todos);

      return res.status(200).json(todos.map((todo) => cleanTodo(todo)));
    } catch (error) {
      console.error('SEARCH TODO: ', error);

      return res.status(500).json({ message: 'Erreur lors de la recherche des tâches !' });
    }
  }
};

module.exports = TodoController;
