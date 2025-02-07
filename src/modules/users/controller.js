import * as UserService from "./service.js";
import path from "path";
import fs from "fs/promises";
import Joi from "joi";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";
import sgMail from "@sendgrid/mail";
import { nanoid } from "nanoid";
import { AVATARS_DIRECTORY } from "../../middlewares.js";

const emailValidate = Joi.string()
  .email({ minDomainSegments: 2, tlds: { allow: true } })
  .required();
const validationObject = Joi.object({
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  email: emailValidate,
});

sgMail.setApiKey(process.env.API_EMAIL);

const msg = (to, token) => {
  return {
    to,
    from: "m.jarek@bres-bud.pl", // Use the email address or domain you verified above
    subject: "Sending with Twilio SendGrid is Fun",
    text: `/users/verify/${token}`,
    html: `<strong>/users/verify/${token}</strong>`,
  };
};

export const userSignup = async (req, res) => {
  const { password, email } = req.body;
  try {
    Joi.attempt({ password, email }, validationObject);
  } catch (err) {
    return res.status(400).json({
      status: err.name,
      code: 400,
      message: err.details[0].message,
    });
  }

  const hash = bcryptjs.hashSync(password, 12);
  const newUser = {
    email,
    password: hash,
    avatarURL: gravatar.url(email),
    verificationToken: nanoid(),
  };

  if (await UserService.exists(email))
    return res.status(409).json({
      status: "Conflict",
      code: 409,
      message: "Email in use",
    });

  return await UserService.create(newUser)
    .then((data) => {
      sgMail.send(msg(data.email, data.verificationToken));
      return res.status(201).json({
        status: "201 Created",
        body: {
          user: {
            email: data.email,
            subscription: data.subscription,
            avatar: data.avatarURL,
          },
        },
      });
    })
    .catch((err) => console.log(err));
};
export const userLogin = async (req, res) => {
  const { password, email } = req.body;
  if (!password || !email)
    return res.status(400).json({
      status: "400 ValidationError",
      message: "EMAIL and PASSWORD is not allowed to be empty",
    });
  const isUser = await UserService.exists(email);

  if (!isUser)
    return res.status(401).json({
      status: "401 Unauthorized",
      body: {
        message: "Email or password is wrong",
      },
    });

  const user = await UserService.getById(isUser._id);

  if (!bcryptjs.compareSync(password, user.password))
    return res.status(401).json({
      status: "401 Unauthorized",
      body: {
        message: "Email or password is wrong",
      },
    });
  const payload = { id: user._id };
  const token = jwt.sign(payload, process.env.SECRET);

  try {
    return await UserService.update(user._id, token).then((data) =>
      res.status(200).json({
        status: "200 OK",
        body: {
          token: data.token,
          user: {
            email: data.email,
            subscription: data.subscription,
          },
        },
      })
    );
  } catch (err) {
    res.json({
      status: "Error",
      body: {
        message: err.message,
      },
    });
  }
};
export const userLogout = async (req, res) => {
  const userId = req.user;
  const token = null;
  try {
    return await UserService.update(userId, token).then(() =>
      res.json({
        status: "204 No Content",
      })
    );
  } catch (err) {
    res.json({
      status: "Error",
      body: {
        message: err.message,
      },
    });
  }
};

export const userCurrent = async (req, res) => {
  const userId = req.user;
  try {
    return await UserService.getById(userId).then((data) =>
      res.status(200).json({
        status: "200 OK",
        body: {
          email: data.email,
          subscription: data.subscription,
        },
      })
    );
  } catch (err) {
    res.json({
      status: "Error",
      body: {
        message: err.message,
      },
    });
  }
};

export const userAvatar = async (req, res) => {
  const userId = req.user;
  if (!req.file) return res.sendStatus(400);

  const { path: temporaryName, originalname: originalName } = req.file;
  const fileName = path.join(AVATARS_DIRECTORY, userId + "_" + originalName);

  try {
    await fs.rename(temporaryName, fileName);
    Jimp.read(fileName)
      .then((picture) => {
        return picture
          .resize(250, 250) // resize
          .write(fileName); // save
      })
      .catch((err) => {
        console.error(err);
      });
    return UserService.updateAvatar(userId, fileName).then((data) =>
      res.status(200).json({
        status: "200 OK",
        body: {
          avatarURL: data.avatarURL,
        },
      })
    );
  } catch (error) {
    await fs.unlink(temporaryName);
    return res.sendStatus(500);
  }
};

export const userEmailVerify = async (req, res) => {
  const verifyToken = req.params.verify;
  if (!verifyToken) {
    return res.status(400).json({
      status: "Bad request",
      code: 400,
    });
  }
  const user = await UserService.findEmailToken(verifyToken);
  if (user.length === 0) {
    return res.status(404).json({
      status: "User not found",
      code: 404,
    });
  }
  const [{ verify: userVerify, _id: userId }] = user;

  if (userVerify)
    return res.status(400).json({
      status: "Email was already confirmed",
      code: 400,
    });
  try {
    UserService.confirmEmail(userId).then(() =>
      res.status(200).json({
        status: "200 OK",
        body: {
          message: "Verification successful",
        },
      })
    );
  } catch (err) {
    res.json({
      status: "Error",
      body: {
        message: err.message,
      },
    });
  }
};

export const userReplyEmail = async (req, res) => {
  const { email } = req.body;
  if (!email)
    res.status(400).json({
      code: 400,
      message: "You don't sent any email",
    });

  try {
    Joi.attempt(email, emailValidate);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: err.name,
      code: 400,
      message: err.details[0].message,
    });
  }

  if (!(await UserService.exists(email)))
    return res.status(404).json({
      status: "Not Found",
      code: 404,
    });

  try {
    const user = await UserService.findByEmail(email);
    if (user[0].verify)
      return res.status(400).json({
        status: "Bad Request",
        code: 400,
        message: "Verification has already been passed",
      });
    else {
      sgMail.send(msg(email, user[0].verificationToken)).then(() =>
        res.status(200).json({
          status: "200 OK",
          message: "Verification email sent",
        })
      );
    }
  } catch (err) {
    return res.status(400).json({
      code: 400,
      message: err,
    });
  }
};
