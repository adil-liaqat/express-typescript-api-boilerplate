import { Request, Response, NextFunction } from 'express';
import { sync } from 'glob';
import { union } from 'lodash';

export const globFiles = (location: string): string[] => {
  return union([], sync(location));
}

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
(req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
