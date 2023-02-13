import { Contact } from "./model.js";

export const getAll = async () => Contact.find();

export const getById = async (id) => Contact.findById(id);

export const create = async (contact) => Contact.create(contact);

export const exists = async (id) => Contact.exists({ _id: id });

export const deleteById = async (id) => Contact.findByIdAndDelete(id);

export const update = async (id, { name, email, phone }) => {
  return Contact.findByIdAndUpdate(id, { name, email, phone });
};
