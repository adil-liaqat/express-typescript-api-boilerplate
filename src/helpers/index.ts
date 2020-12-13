import { sync } from 'glob';
import { union } from 'lodash';

import { INextFunction, IRequest, IResponse } from '../interfaces/express';

export const globFiles = (location: string): string[] => {
  return union([], sync(location));
}

export const asyncHandler = (fn: (req: IRequest, res: IResponse, next: INextFunction) => Promise<any>) =>
(req: IRequest, res: IResponse, next: INextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
