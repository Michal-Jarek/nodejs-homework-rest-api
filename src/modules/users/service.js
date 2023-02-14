import {User} from "./model.js"

export const create = async (user) => User.create(user);
export const exists = async (email) => User.exists({ email: email });