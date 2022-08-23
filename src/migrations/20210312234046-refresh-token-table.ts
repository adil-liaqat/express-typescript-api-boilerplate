'use strict'

import { QueryInterface, DataTypes, Sequelize, ModelAttributes } from 'sequelize'

import {
  RefreshToken,
  RefreshTokenCreationAttributes
} from '../types/models/refreshToken.interface'

export = {
  up: (queryInterface: QueryInterface, sequelize: Sequelize): Promise<any> => {
    return queryInterface.createTable('refresh_token', <ModelAttributes<RefreshToken, RefreshTokenCreationAttributes>>{
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false
      },
      token_expires_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      is_used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      revoked_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      replaced_by_token: {
        type: DataTypes.STRING,
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
    return queryInterface.dropTable('refresh_token')
  }
}
