import express from "express";
import * as contactController from "../../src/modules/contacts/controller.js";


const contactsRouter = express.Router();

contactsRouter.get("/", contactController.listContacts);

contactsRouter.get("/:contactId", contactController.getContactById);


contactsRouter.post("/", contactController.createContact);


// contactsRouter.delete("/:contactId", async (req, res, next) => {
//   const id = req.params.contactId;
//   const deleteContact = await removeContact(id);

//   if (!(deleteContact instanceof Error))
//     res.status(200).json({
//       status: "succes",
//       code: 200,
//       message: deleteContact.message,
//     });
//   else
//     res.status(deleteContact.cause).json({
//       status: deleteContact.name,
//       code: deleteContact.cause,
//       message: deleteContact.message,
//     });
// });

// contactsRouter.put("/:contactId", async (req, res, next) => {
//   const id = req.params.contactId;
//   const respondPutContact = await updateContact(id, req.body);

//   if (!(respondPutContact instanceof Error))
//     res.status(200).json({
//       status: "succes",
//       code: 200,
//       data: respondPutContact,
//     });
//   else
//     res.status(respondPutContact.cause).json({
//       status: respondPutContact.name,
//       code: respondPutContact.cause,
//       message: respondPutContact.message,
//     });
// });

export default contactsRouter;
