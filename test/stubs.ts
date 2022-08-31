import logger from '@src/logger'
import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import sinon from 'sinon'

const sandbox = sinon.createSandbox()

sandbox.stub(nodemailer, 'createTransport').returns(<Mail><unknown>{
  sendMail: sandbox.stub().returns({})
})

sandbox.stub(logger, 'info')
sandbox.stub(logger, 'warn')
sandbox.stub(logger, 'debug')

export default sandbox
