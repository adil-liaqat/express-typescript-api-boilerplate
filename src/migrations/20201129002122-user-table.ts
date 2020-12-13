'use strict';

import { QueryInterface, DataTypes, Sequelize, ModelAttributes } from 'sequelize';

import { User, UserAttributes, UserCreationAttributes } from '../interfaces/models/user.interface';

export = {
  up: (queryInterface: QueryInterface, sequelize: Sequelize): Promise<any> => {
    return queryInterface.createTable('user', <ModelAttributes<User, UserCreationAttributes>>{
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.Sequelize.fn('now'),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.Sequelize.fn('now'),
      },
    });
  },

  down: (queryInterface: QueryInterface, sequelize: Sequelize): Promise<any> => {
    return queryInterface.dropTable('user');
  },
};
