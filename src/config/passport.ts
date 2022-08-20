import passport from 'passport';
import { IVerifyOptions, Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy } from 'passport-jwt';
import { db } from '../models';
import { User, UserAuthenticateAttributes } from '../types/models/user.interface';
import { Payload } from '../types/jwt/payload.interface';
import { IRequest } from '../types/express';
import { AesDecrypt } from '../helpers';
import { JWT_ALGORITHM } from './app';

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
async(
  req: IRequest, email: string, password: string, done: (err: any, data?: any, opts?: IVerifyOptions) => void
) => {
  try {
    const user: UserAuthenticateAttributes = await db.User.authenticate(email, password, { context: { i18n: req.i18n } });
    done(null, user);
  } catch (error: any) {
    done(error, false, { message: error.message })
  }
})
);

passport.use(new JWTStrategy({
  algorithms: [JWT_ALGORITHM],
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
  passReqToCallback: true
},
async(req: IRequest, payload: Payload, cb: (err: any, data?: User) => void) => {
  try {
    const user: User = await db.User.findByPk(payload.id, { context: { i18n: req.i18n } });
    cb(null, user);
  } catch (error: any) {
    cb(error);
  }
}
));
