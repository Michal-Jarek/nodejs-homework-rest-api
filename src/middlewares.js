import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "./modules/users/model.js";
import dotenv from "dotenv";

dotenv.config();
const secret = process.env.SECRET;

const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(params, (payload, done) => {
    User.find({ _id: payload.id })
      .then(([user]) =>
        (!user || !user.token)  ? done(new Error("User not found!")) : done(null, user)
      )
      .catch(done);
  })
);
export const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (!user || error || !user.token)
      return res.status(401).json({ message: "Not authorized" });
    req.user = user.id;
    next();
  })(req, res, next);
};
