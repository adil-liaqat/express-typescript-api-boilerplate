import {Sequelize, DataTypes, Model, Optional, ModelCtor} from 'sequelize';

interface UserAttributes {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  verified: boolean;
  created_at: Date;
  updated_at: Date;
}

// Some attributes are optional in `User.build` and `User.create` calls
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public first_name!: string; // for nullable fields
  public last_name!: string;
  public email!: string;
  public password!: string;
  public verified!: boolean;
  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  verifyPassword(password: string): string {
    return password;
  }
}

interface UserInterface extends ModelCtor<User> {
  findByName(name: string): Promise<User>;
}

export const UserFactory = (sequelize: Sequelize): UserInterface => {

  const UserModel: UserInterface = <UserInterface>sequelize.define<User>('user', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'user',
  })


  UserModel.findByName = function(name): Promise<User> {
    return UserModel.findOne({where: {first_name: name}});
  }

  // UserModel.prototype.verifyPassword = function(password: string) {
  //   /* code here ... */
  // };

  return UserModel;
}
