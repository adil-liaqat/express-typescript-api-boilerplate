import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy } from 'passport-jwt';
import { db } from '../models';
import { Payload } from '../interfaces/jwt/payload.interface';
import { IRequest } from '../interfaces/express';
import { AesDecrypt } from '../helpers';

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
},
  async (email: string, password: string, done: Function) => {
    try {
      const user = await db.User.authenticate(email, password);
      done(null, user);
    } catch (error: any) {
      done(error, false, { message: error.message })
    }
  }),
);

passport.use(new JWTStrategy({
  algorithms: ['HS256'],
  jwtFromRequest: (req: IRequest) => {
    let token: string | null = req.headers.authorization || null;

    if (token) {
      token = token.split(' ')[1];
      try {
        token = AesDecrypt(token);
      } catch {
        token = null;
      }
    }

    return token;
  },
  secretOrKey: process.env.JWT_SECRET,
},
  async (payload: Payload, cb: Function) => {
    try {
      const user = await db.User.findByPk(payload.id);
      cb(null, user);
    } catch (error: any) {
      cb(error);
    }
  },
));
