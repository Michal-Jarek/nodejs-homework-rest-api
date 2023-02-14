import * as UserService from "./service.js";
import Joi from "joi";

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
  const newUser = { email, password };

  if ((await UserService.exists(email)))
    return res.status(409).json({
      status: "Conflict",
      code: 409,
      message: "Email in use",
    });
  
  return await UserService.create(newUser)
    .catch((err) => console.log(err))
    .then((data) =>
      res.status(201).json({
        status: "Created",
        code: 201,
        data: data,
      })
    );

  return res.status(200).json({
    status: "ok",
  });
};
