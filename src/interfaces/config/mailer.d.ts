import { Templates } from '../templates';

export interface SendMailOption {
  to: string,
  from?: string,
  subject: string,
  template: Templates,
  data: object
}
