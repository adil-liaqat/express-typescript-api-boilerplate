import { Templates } from '@src/enums/template.enum'
export interface SendMailOption {
  to: string
  from?: string
  subject: string
  lang?: string
  template: Templates
  data: object
}
