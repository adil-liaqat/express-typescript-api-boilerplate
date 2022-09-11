import cls from 'cls-hooked'
import { NextFunction, Request, Response } from 'express'
import { User } from 'types/models'

const nsid: string = 'request'

export default (_req: Request, _res: Response, next: NextFunction): void => {
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
