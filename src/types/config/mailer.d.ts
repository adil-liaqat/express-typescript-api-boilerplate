import { Templates } from '../templates'

export interface SendMailOption {
  to: string,
  from?: string,
  subject: string,
  lang?: string,
  template: Templates,
  data: object
}
