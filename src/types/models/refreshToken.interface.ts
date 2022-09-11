import { Model, ModelStatic, Optional } from 'sequelize'

export interface RefreshTokenAttributes {
  id: number
  user_id: number
  token: string
  token_expires_at?: Date
  is_used: boolean
  revoked_at?: Date
  replaced_by_token?: string
  created_at?: Date
  updated_at?: Date
}

export interface RefreshTokenCreationAttributes extends Optional<RefreshTokenAttributes, 'id' | 'is_used'> {}

export interface RefreshToken
  extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>,
    RefreshTokenAttributes {
  toJSON: () => RefreshTokenAttributes
}

export interface RefreshTokenInterface extends ModelStatic<RefreshToken> {}
