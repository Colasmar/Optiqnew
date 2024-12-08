const { Sequelize, DataTypes } = require('sequelize');

// Initialisation de Sequelize avec SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

// Définition du modèle Role
const Role = sequelize.define('Role', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

// Définition du modèle Activity
const Activity = sequelize.define('Activity', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

// Définition du modèle Task
const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Relations
Role.hasMany(Activity, { as: 'Activities' });
Activity.belongsTo(Role, { as: 'Guarantor' });

Activity.hasMany(Task, { as: 'Tasks' });
Task.belongsTo(Activity, { as: 'Activity' });

// Export des éléments
module.exports = { sequelize, Role, Activity, Task };
