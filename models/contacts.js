import fs from "fs/promises";
import path from "path";
import Joi from "joi";

const validationObject = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  phone: Joi.string().min(3).max(20).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: true } }),
});

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
    if (!contactById) throw new Error("Not found", { cause: "404" });
    else return contactById;
  } catch (err) {
    return err;
  }
};

const removeContact = async (contactId) => {
  const contactArray = await listContacts(contactsPath);
  const contactById = await getContactById(contactId);
  if (contactById.name === "Error") return contactById;
  const filteredContact = contactArray.filter(
    (data) => data.id !== contactId.toString()
  );
  return await fs
    .writeFile(contactsPath, JSON.stringify(filteredContact, null))
    .catch((error) => {
      console.log(`Error in writeFile deleteContactById: ${error}`);
      return error;
    })
    .then(() => {
      return {
        message: "contact deleted",
      };
    });
};

const addContact = async (body) => {
  const contactArray = await listContacts();
  const idSortedArray = contactArray
    .map((contact) => parseInt(contact.id))
    .sort((a, b) => a - b);
  const newId = idSortedArray[idSortedArray.length - 1] + 1;
  const { name, email, phone } = body;

  try {
    // ************ Validation empty body cells *********************
    Joi.attempt({ name, email, phone }, validationObject);

    const newContact = {
      id: newId.toString(),
      name,
      email,
      phone,
    };

    const newArray = [...contactArray, newContact];
    return await fs
      .writeFile(contactsPath, JSON.stringify(newArray, null))
      .catch((error) => {
        console.log(`Error in writeFile addContact: ${error}`);
        return error;
      })
      .then(() => newContact);
  } catch (err) {
    const e = new Error(err.details[0].message, {
      cause: "400",
    });
    e.name = err.name;
    return e;
  }
};

const updateContact = async (contactId, body) => {
  const contactById = await getContactById(contactId);
  if (contactById.name === "Error") return contactById;

  const contactArray = await listContacts();
  const { name, email, phone } = body;

  try {
    Joi.attempt({ name, email, phone }, validationObject);

    const updatedContact = {
      id: contactId,
      name,
      email,
      phone,
    };

    const newArray = contactArray.filter((contact) => contact.id !== contactId);
    newArray.push(updatedContact);
    return await fs
      .writeFile(
        contactsPath,
        JSON.stringify(
          newArray.sort((a, b) => Number(a.id) - Number(b.id)),
          null
        )
      )
      .catch((error) => {
        console.log(`Error in writeFile addContact: ${error}`);
        return error;
      })
      .then(() => updatedContact);
  } catch (err) {
    const e = new Error(err.details[0].message, {
      cause: "400",
    });
    e.name = err.name;
    return e;
  }
};

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
