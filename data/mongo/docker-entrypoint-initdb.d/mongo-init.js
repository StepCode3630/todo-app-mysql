db = db.getSiblingDB('db_todoapp');

db.createUser({
  user: 'app_backend',
  pwd: 'app_backend_pwd',
  roles: [
    { role: 'readWrite', db: 'db_todoapp' },
    { role: 'dbAdmin', db: 'db_todoapp' }
  ]
});

db.createUser({
  user: 'admin_app',
  pwd: 'admin_app_pwd',
  roles: [
    { role: 'dbAdmin', db: 'db_todoapp' },
    { role: 'userAdmin', db: 'db_todoapp' }
  ]
});

db.getSiblingDB('admin').createUser({
  user: 'backup_user',
  pwd: 'backup_user_pwd',
  roles: [{ role: 'backup', db: 'admin' }]
});
