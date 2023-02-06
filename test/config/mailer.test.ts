import mailer from '@src/config/mailer'
import { Templates } from '@src/enums/template.enum'
import { expect } from 'chai'
import ejs from 'ejs'
import nodemailer from 'nodemailer'
import sinon from 'sinon'

describe('CONFIG mailer function', () => {
  it('should return error if email sending failed', async () => {
    sinon.stub(ejs, 'render').returns('<div></div>')
    const { sendMail } = nodemailer.createTransport()

    const errorMessage: string = 'Email sending failed'

    // @ts-expect-error
    sendMail.onCall(sendMail.callCount).throws(Error(errorMessage))

    try {
      await mailer.sendMail({
        template: Templates.EMAIL_CONFIRMATION,
        data: {},
        subject: 'Hello',
        to: ''
      })
    } catch (error) {
      expect(error.message).to.be.eq(errorMessage)
    }
  })
})
