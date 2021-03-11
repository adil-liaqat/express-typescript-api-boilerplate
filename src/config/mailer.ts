import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import fs from 'fs';
import {promisify} from 'util';

import { SendMailOption } from '../interfaces/config/mailer';
import { Templates } from '../interfaces/templates';

const MAILER_TEMPLATE_PATH: string = path.join(__dirname, '../../src/templates');


const transporter: nodemailer.Transporter = nodemailer.createTransport({
  host: process.env.MAIL_SMTP_HOST,
  port: <any>process.env.MAIL_SMTP_PORT,
  secure: process.env.MAIL_SMTP_SECURE === 'true',
  auth: {
    user: process.env.MAIL_SMTP_USER,
    pass: process.env.MAIL_SMTP_PASSWORD,
  },
});

async function renderTemplate(template: Templates, data: object = {}): Promise<string> {

  const promisedFileRead: Function = promisify(fs.readFile.bind(fs));

  const templateContent = await promisedFileRead(MAILER_TEMPLATE_PATH + '/' + template + '.ejs', 'utf8');
  return ejs.render(templateContent, data, {
    async: true,
  });
}

export default async function sendMail({template, data, ...rest}: SendMailOption) {
  try {
    const html: string = await renderTemplate(template, data);

    if (!rest.from) {
      rest.from = process.env.MAIL_FROM
    }

    await transporter.sendMail({
      ...rest,
      html,
    });
  } catch (error) {
    throw error;
  }
}
