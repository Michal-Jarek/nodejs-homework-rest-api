import { User } from "./model.js";

export const create = async (user) => User.create(user);
export const exists = async (email) => User.exists({ email: email });
export const getById = async (id) => User.findById(id);
export const update = async (id, token) =>
  User.findByIdAndUpdate(id, {token}, { new: true });
