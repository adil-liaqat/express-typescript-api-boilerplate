import nodemailer from 'nodemailer'
import ejs from 'ejs'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'

import { SendMailOption } from '../types/config/mailer'
import { Templates } from '../types/templates'
import { i18next } from './i18n'

const MAILER_TEMPLATE_PATH: string = path.join(__dirname, '../../src/templates')

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

async function renderTemplate(template: Templates, data: object = {}, lang: string = 'en'): Promise<string> {
  const templateContent = await promisedFileRead(MAILER_TEMPLATE_PATH + '/' + template + '.ejs', 'utf8')
  return ejs.render(templateContent, {
    ...data,
    __: i18next.getFixedT(lang)
  }, {
    async: true
  })
}

export default async function sendMail({ template, lang, data, ...rest }: SendMailOption) {
  try {
    const html: string = await renderTemplate(template, data, lang)

    if (!rest.from) {
      rest.from = process.env.MAIL_FROM
    }

    await transporter.sendMail({
      ...rest,
      html
    })
  } catch (error) {
    throw error
  }
}
