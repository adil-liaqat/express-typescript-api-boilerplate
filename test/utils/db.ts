import i18next from 'i18next'
import { faker } from '@faker-js/faker'

import { UserAttributes } from '../../src/types/models/user.interface'
import { db } from '../../src/models'

export const cleanUpDatabase = async() => db.sequelize.sync({ force: true, match: /_test$/ })

export const generateUser = async(data?: UserAttributes) => {
  const defaults: Partial<UserAttributes> = {
    email: faker.internet.email(),
    password: faker.random.alphaNumeric(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    verified: true
  }
  return db.User.create({ ...defaults, ...data }, { context: { i18n: i18next } })
}
