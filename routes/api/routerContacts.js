import express from "express";
import * as contactController from "../../src/modules/contacts/controller.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactController.listContacts);

contactsRouter.get("/:contactId", contactController.getContactById);

contactsRouter.post("/", contactController.createContact);

contactsRouter.delete("/:contactId", contactController.deleteContact);

contactsRouter.put("/:contactId", contactController.updateContact);

contactsRouter.patch("/:contactId/favorite", contactController.toggleFavorite);




export default contactsRouter;
