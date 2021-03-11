import { Model, ModelCtor, Optional } from 'sequelize/types';


export interface UserPublicAttributes {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  verified: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserAttributes extends UserPublicAttributes {
  password: string;
  confirmation_token: string;
  confirmation_expires_at: Date;
  reset_password_token: string;
  reset_password_expires_at: Date;
}

export interface UserAuthenticateAttributes extends UserPublicAttributes {
  token: string;
}


export interface UserCreationAttributes
  extends Optional<UserAttributes,
  'id' | 'verified' | 'full_name' |
  'confirmation_token' | 'confirmation_expires_at' |
  'reset_password_token' | 'reset_password_expires_at'> {}

export interface User
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {
      generateAuthToken(): string;
      toJSON(): UserPublicAttributes;
      hashPassword(): Promise<string>;
    }

export interface UserInterface extends ModelCtor<User> {
  authenticate(email: string, password: string): Promise<UserAuthenticateAttributes>;
}
