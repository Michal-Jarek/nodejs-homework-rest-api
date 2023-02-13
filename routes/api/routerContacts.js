import express from "express";
import * as contactController from "../../src/modules/contacts/controller.js";


const contactsRouter = express.Router();

contactsRouter.get("/", contactController.listContacts);

contactsRouter.get("/:contactId", contactController.getContactById);

contactsRouter.post("/", contactController.createContact);


contactsRouter.delete("/:contactId", contactController.deleteContact);


contactsRouter.put("/:contactId", contactController.updateContact);

// if (!(respondPutContact instanceof Error))
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
