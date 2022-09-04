import cls from 'cls-hooked'
import { User } from 'types/models'

import { INextFunction, IRequest, IResponse } from '../types/express'

const nsid: string = 'request'

export default (_req: IRequest, _res: IResponse, next: INextFunction): void => {
  const ns = cls.getNamespace(nsid) || cls.createNamespace(nsid)
  ns.run(() => next())
}

export const setLanguage = (language: string) => {
  const ns = cls.getNamespace(nsid)
  if (ns?.active) {
    return ns.set('language', language)
  }
}

export const getLanguage = () => {
  const ns = cls.getNamespace(nsid)
  if (ns?.active) {
    return ns.get('language')
  }
}

export const getUser = () => {
  const ns = cls.getNamespace(nsid)
  if (ns?.active) {
    return ns.get('user')
  }
}

export const setUser = (user: User) => {
  const ns = cls.getNamespace(nsid)
  if (ns?.active) {
    return ns.set('user', user)
  }
}
