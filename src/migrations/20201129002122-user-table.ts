'use strict'

import { DataTypes, ModelAttributes, QueryInterface, Sequelize } from 'sequelize'

import { User, UserCreationAttributes } from '../types/models'

export = {
  up: (queryInterface: QueryInterface, sequelize: Sequelize): Promise<any> => {
    return queryInterface.createTable('user', <ModelAttributes<User, UserCreationAttributes>>{
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      confirmation_token: {
        type: DataTypes.STRING,
        allowNull: true
      },
      confirmation_expires_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      reset_password_token: {
        type: DataTypes.STRING,
        allowNull: true
      },
      reset_password_expires_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.Sequelize.fn('now')
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.Sequelize.fn('now')
      }
    })
  },

  down: (queryInterface: QueryInterface, sequelize: Sequelize): Promise<any> => {
    return queryInterface.dropTable('user')
  }
}
