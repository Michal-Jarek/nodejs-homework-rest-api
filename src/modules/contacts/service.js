import { Contact } from "./model.js";

export const getAll = async () => Contact.find();

export const getById = async (id) => Contact.findById(id);

export const create = async ({ name, email, phone }) =>
  Contact.create({ name, email, phone });

export const exists = async (id) => Contact.exists({ _id: id });

export const update = async (id, { name, isCompleted }) => {
  // Move to separate validation (middleware for example)
  let upsert = {};
  if (name) upsert.name = name;
  if (isCompleted !== undefined || isCompleted !== null)
    upsert.isCompleted = isCompleted;

  return Task.findByIdAndUpdate(id, upsert, { new: true });
};

export const deleteById = async (id) => Task.findByIdAndDelete(id);
