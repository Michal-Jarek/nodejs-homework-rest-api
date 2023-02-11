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
    if (!contactById) throw new Error("Not found", { cause: "404" });
    else return contactById;
  } catch (err) {
    return err;
  }
};

const removeContact = async (contactId) => {
  // const contactArray = contactsPath
  //   ? await listContacts(contactsPath).catch((error) => error)
  //   : await listContacts().catch((error) => error);
  // const contactById = await getContactById(contactId);
  // if (contactById.name === "Error") return console.log(contactById.message);
  // const filteredContact = contactArray.filter(
  //   (data) => data.id !== contactId.toString()
  // );
  // await fs
  //   .writeFile(
  //     contactsPath || defaultPath,
  //     JSON.stringify(filteredContact, null)
  //   )
  //   .catch((error) => {
  //     console.log(`Error in writeFile deleteContactById: ${error}`);
  //     return error;
  //   });
  // return console.log("Delete is completed");
};

const addContact = async (body) => {
  const contactArray = await listContacts();
  const idSortedArray = contactArray
    .map((contact) => parseInt(contact.id))
    .sort((a, b) => a - b);
  const newId = idSortedArray[idSortedArray.length - 1] + 1;
  const { name, email, phone } = body;
  console.log(await body);

  const newContact = {
    id: newId.toString(),
    name,
    email,
    phone,
  };
  const newArray = [...contactArray, newContact];
  await fs
    .writeFile(contactsPath, JSON.stringify(newArray, null))
    .catch((error) => {
      console.log(`Error in writeFile addContact: ${error}`);
      return error;
    })
    .then(() => console.log("Save a new contact end with Succes"));
};

const updateContact = async (contactId, body) => {};

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
