import { faker } from '@faker-js/faker'
import { randomString } from '@src/helpers'
import { db } from '@src/models'
import { RefreshTokenAttributes, UserAttributes } from '@src/types/models'
import moment from 'moment'

export const cleanUpDatabase = async() => db.sequelize.sync({ force: true, match: /_test$/ })

export const generateUser = async(data: Partial<UserAttributes> = {}) => {
  const defaults: Partial<UserAttributes> = {
    email: faker.internet.email(),
    password: faker.random.alphaNumeric(10),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    verified: true
  }
  return db.User.create(<UserAttributes>{ ...defaults, ...data })
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

  return db.RefreshToken.create(<RefreshTokenAttributes>{ ...defaults, ...data })
}
