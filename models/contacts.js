import fs from "fs/promises";
import path from "path";

const contactsPath = path.resolve("./models/contacts.json");

const listContacts = async () => {
  const contacts = await fs
    .readFile(contactsPath, { encoding: "utf-8" })
    .then((data) => JSON.parse(data))
    .catch((err) => console.log(err.message));
  return contacts;
};

const getContactById = async (contactId) => {
  try {
    const contactArray = await listContacts();
    const contactById = contactArray.find(
      (data) => data.id === contactId.toString()
    );
    if (!contactById) throw new Error({status: "Not found",
       code: 404,});
    else return contactById;
  } catch (err) {
    return err;
  }
};

const removeContact = async (contactId) => {};

const addContact = async (body) => {};

const updateContact = async (contactId, body) => {};

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
