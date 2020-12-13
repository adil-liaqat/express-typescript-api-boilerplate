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
}

export interface UserAuthenticateAttributes extends UserPublicAttributes {
  token: string;
}


export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'verified' | 'full_name'> {}

export interface User
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {
      generateAuthToken(): string;
      toJSON(): UserPublicAttributes
    }

export interface UserInterface extends ModelCtor<User> {
  authenticate(email: string, password: string): Promise<UserAuthenticateAttributes>;
}
