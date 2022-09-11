import { Options } from 'sequelize'

const options: Options = {
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: <any>process.env.DB_PORT,
  dialect: 'postgres',
  define: {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  },
  logging: process.env.NODE_ENV === 'production' ? false : (msg) => console.debug(msg)
}

export = options
