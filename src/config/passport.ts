import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import { db } from '../models';
import { Payload } from '../interfaces/jwt/payload.interface';

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
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
},
  async function (payload: Payload, cb: Function) {
    try {
      const user = await db.User.findByPk(payload.id);
      cb(null, user);
    } catch (error: any) {
      cb(error);
    }
  },
));
