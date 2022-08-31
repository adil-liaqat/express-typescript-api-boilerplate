import i18next from 'i18next'
import { faker } from '@faker-js/faker'
import moment from 'moment'

import { UserAttributes, RefreshTokenAttributes } from '../../src/types/models'
import { db } from '../../src/models'
import { randomString } from '../../src/helpers'

export const cleanUpDatabase = async() => db.sequelize.sync({ force: true, match: /_test$/ })

export const generateUser = async(data: Partial<UserAttributes> = {}) => {
  const defaults: Partial<UserAttributes> = {
    email: faker.internet.email(),
    password: faker.random.alphaNumeric(10),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    verified: true
  }
  return db.User.create(<UserAttributes>{ ...defaults, ...data }, { context: { i18n: i18next } })
}

export const generateRefreshToken = async(data: Partial<RefreshTokenAttributes> = {}) => {
  if (!data.user_id) {
    data.user_id = (await generateUser()).id
  }
  const defaults: Partial<RefreshTokenAttributes> = {
    token: randomString(),
    token_expires_at: moment().add(1, 'day').toDate(),
    is_used: false
  }

  return db.RefreshToken.create(<RefreshTokenAttributes>{ ...defaults, ...data }, { context: { i18n: i18next } })
}
