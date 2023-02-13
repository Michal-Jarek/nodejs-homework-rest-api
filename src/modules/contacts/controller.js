import * as ContactService from "./service.js";
import Joi from "joi";

const validationObject = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  phone: Joi.string().min(3).max(20).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: true } }),
});

export const listContacts = async (req, res) => {
  const allContacts = await ContactService.getAll().catch((err) => err);
  console.log(allContacts);

  if (!(allContacts instanceof Error))
    return res.status(200).json({
      status: "succes",
      code: 200,
      data: allContacts,
    });
  else
    return res.status(allContacts.cause).json({
      status: allContacts.name,
      code: allContacts.cause,
      message: allContacts.message,
    });
};

export const getContactById = async (req, res) => {
  const id = req.params.contactId;
  if (id.length < 12)
    return res.status(400).json({
      status: "Bad request",
      code: 400,
      message:
        "Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer",
    });

  const requestedContact = await ContactService.getById(id);

  if (!requestedContact) return res.sendStatus(404);
  return res
    .status(200)
    .json({ status: "succes", code: 200, data: requestedContact });
};

export const createContact = async (req, res) => {
  const body = req.body;
  const { name, email, phone } = body;
  try {
    // ************ Validation empty body cells *********************
    Joi.attempt({ name, email, phone }, validationObject);

    const newContact = {
      name,
      email,
      phone,
    };
    return await ContactService.create(newContact)
      .catch((err) => err)
      .then((data) =>
        res.status(201).json({
          status: "succes",
          code: 201,
          data: data,
        })
      );
  } catch (err) {
    const e = new Error(err.details[0].message, {
      cause: "400",
    });
    e.name = err.name;
    return res.status(e.cause).json({
      status: e.name,
      code: e.cause,
      message: e.message,
    });
  }
};

//   const contactArray = await listContacts();

//   try {
//     // ************ Validation empty body cells *********************
//     Joi.attempt({ name, email, phone }, validationObject);

//     const newContact = {
//       id: newId.toString(),
//       name,
//       email,
//       phone,
//     };

//     const newArray = [...contactArray, newContact];
//     return await fs
//       .writeFile(contactsPath, JSON.stringify(newArray, null))
//       .catch((error) => {
//         console.log(`Error in writeFile addContact: ${error}`);
//         return error;
//       })
//       .then(() => newContact);
//   } catch (err) {
//     const e = new Error(err.details[0].message, {
//       cause: "400",
//     });
//     e.name = err.name;
//     return e;
//   }
// };

// export const updateTask = async (req, res) => {
//   const id = req.params.id;
//   const { name, isCompleted } = req.body;

//   const exists = await TasksService.exists(id);

//   if (!exists) return res.sendStatus(404);

//   const updatedTask = await TasksService.update(id, { name, isCompleted });

//   res.json(updatedTask);
// };

// export const deleteTask = async (req, res) => {
//   const id = req.params.id;

//   const exists = await TasksService.exists(id);

//   if (!exists) return res.sendStatus(404);

//   const deletedTask = await TasksService.deleteById(id);

//   res.json(deletedTask);
// };

//const contactsPath = path.resolve("./models/contacts.json");

// const removeContact = async (contactId) => {
//   const contactArray = await listContacts(contactsPath);
//   const contactById = await getContactById(contactId);
//   if (contactById.name === "Error") return contactById;
//   const filteredContact = contactArray.filter(
//     (data) => data.id !== contactId.toString()
//   );
//   return await fs
//     .writeFile(contactsPath, JSON.stringify(filteredContact, null))
//     .catch((error) => {
//       console.log(`Error in writeFile deleteContactById: ${error}`);
//       return error;
//     })
//     .then(() => {
//       return {
//         message: "contact deleted",
//       };
//     });
// };

// const updateContact = async (contactId, body) => {
//   const contactById = await getContactById(contactId);
//   if (contactById.name === "Error") return contactById;

//   const contactArray = await listContacts();
//   const { name, email, phone } = body;

//   try {
//     Joi.attempt({ name, email, phone }, validationObject);

//     const updatedContact = {
//       id: contactId,
//       name,
//       email,
//       phone,
//     };

//     const newArray = contactArray.filter((contact) => contact.id !== contactId);
//     newArray.push(updatedContact);
//     return await fs
//       .writeFile(
//         contactsPath,
//         JSON.stringify(
//           newArray.sort((a, b) => Number(a.id) - Number(b.id)),
//           null
//         )
//       )
//       .catch((error) => {
//         console.log(`Error in writeFile addContact: ${error}`);
//         return error;
//       })
//       .then(() => updatedContact);
//   } catch (err) {
//     const e = new Error(err.details[0].message, {
//       cause: "400",
//     });
//     e.name = err.name;
//     return e;
//   }
// };

// export {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContact,
// };
