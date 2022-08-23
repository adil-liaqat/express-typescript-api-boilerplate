import app from '../../src/server'
import chai from './chai'

const request = chai.request(app).keepOpen()

export { request }
