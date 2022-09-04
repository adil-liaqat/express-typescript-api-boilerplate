import ejs from 'ejs'
import fs from 'fs'
import i18next from 'i18next'
import nodemailer from 'nodemailer'
import path from 'path'
import { promisify } from 'util'

import { getLanguage } from '../middlewares/clsHooked.middleware'
import { SendMailOption } from '../types/config/mailer'
import { Templates } from '../types/templates'

const MAILER_TEMPLATE_PATH: string = path.join(__dirname, '../../templates')

const promisedFileRead: (
  path: string | number | Buffer | URL,
  options: string | { encoding?: null; flag?: string; }
) => Promise<string> = promisify(fs.readFile.bind(fs))

const transporter: nodemailer.Transporter = nodemailer.createTransport({
  host: process.env.MAIL_SMTP_HOST,
  port: <any>process.env.MAIL_SMTP_PORT,
  secure: process.env.MAIL_SMTP_SECURE === 'true',
  auth: {
    user: process.env.MAIL_SMTP_USER,
    pass: process.env.MAIL_SMTP_PASSWORD
  }
})

async function renderTemplate(template: Templates, data: object = {}): Promise<string> {
  const templateContent = await promisedFileRead(MAILER_TEMPLATE_PATH + '/' + template + '.ejs', 'utf8')
  return ejs.render(templateContent, {
    ...data,
    __: i18next.getFixedT(getLanguage())
  }, {
    async: true
  })
}

async function sendMail({ template, data, ...rest }: SendMailOption) {
  try {
    const html: string = await renderTemplate(template, data)

    if (!rest.from) {
      rest.from = process.env.MAIL_FROM
    }

    await transporter.sendMail({
      ...rest,
      html
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

export default { sendMail }
