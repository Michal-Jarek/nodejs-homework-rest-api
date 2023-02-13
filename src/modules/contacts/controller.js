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

export const deleteContact = async (req, res) => {
  const id = req.params.contactId;
 if (id.length < 12)
   return res.status(400).json({
     status: "Bad request",
     code: 400,
     message:
       "Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer",
   });
  
  const exists = await ContactService.exists(id);
  if (!exists)
    return res.status(404).json({
      status: "Eroor",
      code: 404,
      message: "Contact doesn't exist",
    });

  const deletedContact = await ContactService.deleteById(id);
  res.status(200).json({
    status: "succes",
    code: 200,
    message: deletedContact,
  });
};
export const updateContact = async (req, res) => {
  const id = req.params.contactId;
 if (id.length < 12)
   return res.status(400).json({
     status: "Bad request",
     code: 400,
     message:
       "Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer",
   });
  const { name, email, phone } = req.body;

  const exists = await ContactService.exists(id);

  if (!exists)
    return res.status(404).json({
      status: "Eroor",
      code: 404,
      message: "Contact doesn't exist",
    });
  try {
    Joi.attempt({ name, email, phone }, validationObject);

    const updatedContact = {
      name,
      email,
      phone,
    };
    return await ContactService.update(id, updatedContact)
      .catch((err) => err)
      .then((data) =>
        res.status(202).json({
          status: "succes",
          code: 200,
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
