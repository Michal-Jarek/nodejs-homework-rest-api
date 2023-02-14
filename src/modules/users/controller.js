import * as UserService from "./service.js";
import Joi from "joi";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./model.js";

const validationObject = Joi.object({
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: true } })
    .required(),
});

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
  const newUser = { email, password: hash };

  if (await UserService.exists(email))
    return res.status(409).json({
      status: "Conflict",
      code: 409,
      message: "Email in use",
    });

  return await UserService.create(newUser)
    .catch((err) => console.log(err))
    .then((data) =>
      res.status(201).json({
        status: "201 Created",
        ResponseBody: {
          user: {
            email: data.email,
            subscription: data.subscription,
          },
        },
      })
    );
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
      ResponseBody: {
        message: "Email or password is wrong",
      },
    });

  const user = await UserService.getById(isUser._id);

  if (!bcryptjs.compareSync(password, user.password))
    return res.status(401).json({
      status: "401 Unauthorized",
      ResponseBody: {
        message: "Email or password is wrong",
      },
    });
  const payload = { id: user._id, email };
  const token = jwt.sign(payload, process.env.SECRET);
  console.log(token);
  try {
    return await UserService.update(user._id, token).then((data) =>
      res.status(200).json({
        status: "200 OK",
        ResponseBody: {
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
      ResponseBody: {
        message: err.message,
      },
    });
  }
};
