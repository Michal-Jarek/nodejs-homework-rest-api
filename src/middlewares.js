import path from "path";
import multer from "multer";
import passport from "passport";
import dotenv from "dotenv";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "./modules/users/model.js";


export const UPLOAD_DIRECTORY = path.join(process.cwd(), "tmp");
export const AVATARS_DIRECTORY = path.join(process.cwd(), "src", "public", "avatars");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, UPLOAD_DIRECTORY);
  },
  filename: (req, file, callback) => {
    const date = Date.now();
    const name = [date, file.originalname].join("_");
    callback(null, name);
  },
  limits: { fileSize: 1_048_576 },
});

export const upload = multer({ storage });



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
