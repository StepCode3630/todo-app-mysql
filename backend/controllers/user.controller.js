const bcrypt = require('bcrypt');

const cleanUser = (user) => {
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

const UserController = {
  createUser: async (req, res) => {
    const { email, password } = req.body;
    const { User } = req.app.locals.models;

    await User.create({
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 8)
    })
      .then((result) => {
        return res.status(201).json({ user: cleanUser(result) });
      })
      .catch((error) => {
        console.error('ADD USER: ', error);
        if (error && error.name === 'SequelizeUniqueConstraintError') {
          return res.status(409).json({ message: 'Un compte avec cet email existe déjà !' });
        }
        return res.status(500).json({ message: "Erreur lors de l'inscription !" });
      });
  },
  getUser: async (req, res) => {
    const { User } = req.app.locals.models;

    const user = await User.findById(req.sub).select('-password');
    if (user) {
      console.log('GET USER: ', user);
      return res.status(200).json({ user: cleanUser(user) });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  },
  editUser: async (req, res) => {
    const { User } = req.app.locals.models;
    const user = await User.findById(req.sub);

    if (!user) return res.status(404).json({ message: 'Not found' });

    user.name = req.body.name || user.name;
    user.address = req.body.address || user.address;
    user.zip = req.body.zip || user.zip;
    user.location = req.body.location || user.location;

    await user.save();

    console.log('EDIT USER: ', user);
    return res.status(200).json({ user: cleanUser(user) });
  },
  deleteCurrentUser: async (req, res) => {
    const { User } = req.app.locals.models;

    await User.findByIdAndDelete(req.sub)
      .then(() => {
        console.log('DELETE USER: ', req.sub);
        res.clearCookie('token').status(204).send();
      })
      .catch((error) => {
        console.error('DELETE USER: ', error);
        return res.status(500).json({ message: 'Erreur lors de la suppression du compte !' });
      });
  }
};

module.exports = UserController;
