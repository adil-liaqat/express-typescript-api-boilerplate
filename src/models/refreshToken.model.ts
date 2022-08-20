import { Sequelize, DataTypes } from 'sequelize';

import {
  RefreshTokenAttributes,
  RefreshTokenInterface,
  RefreshToken
} from '../interfaces/models/refreshToken.interface';

export const RefreshTokenFactory = (sequelize: Sequelize): RefreshTokenInterface => {
  const RefreshTokenModel: RefreshTokenInterface = <RefreshTokenInterface>sequelize.define<RefreshToken>('refresh_token', {
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
    }
  }, {
    tableName: 'refresh_token'
  })

  RefreshTokenModel.prototype.toJSON = function(this: RefreshToken): RefreshTokenAttributes {
    const values: RefreshTokenAttributes = Object.assign({}, this.get());
    return values;
  };

  return RefreshTokenModel;
}
