import { NextFunction, Request, Response } from 'express'

export function statusCode(code: number): MethodDecorator {
  return function (_target: Object, _propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const original: Function = descriptor.value
    descriptor.value = function (req: Request, res: Response, next: NextFunction) {
      res.statusCode = code
      return original(req, res, next)
    }
  }
}
