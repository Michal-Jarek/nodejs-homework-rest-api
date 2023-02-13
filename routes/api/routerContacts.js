import express from "express";
import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContact,
} from "../../models/contacts.js";

const contactsRouter = express.Router();

contactsRouter.get("/", async (req, res, next) => {
  res.json({
    status: "succes",
    code: 200,
    data: await listContacts(),
  });
});

contactsRouter.get("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;
  const contact = await getContactById(id);

  if (!(contact instanceof Error))
    res.status(200).json({
      status: "succes",
      code: 200,
      data: contact,
    });
  else
    res.status(contact.cause).json({
      status: contact.name,
      code: contact.cause,
      message: contact.message,
    });
});

contactsRouter.post("/", async (req, res, next) => {
  const respondAddContact = await addContact(req.body);

  if (!(respondAddContact instanceof Error))
    res.status(201).json({
      status: "succes",
      code: 201,
      data: respondAddContact,
    });
  else
    res.status(respondAddContact.cause).json({
      status: respondAddContact.name,
      code: respondAddContact.cause,
      message: respondAddContact.message,
    });
});

contactsRouter.delete("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;
  const deleteContact = await removeContact(id);

  if (!(deleteContact instanceof Error))
    res.status(200).json({
      status: "succes",
      code: 200,
      message: deleteContact.message,
    });
  else
    res.status(deleteContact.cause).json({
      status: deleteContact.name,
      code: deleteContact.cause,
      message: deleteContact.message,
    });
});

contactsRouter.put("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;
  const respondPutContact = await updateContact(id, req.body);

  if (!(respondPutContact instanceof Error))
    res.status(200).json({
      status: "succes",
      code: 200,
      data: respondPutContact,
    });
  else
    res.status(respondPutContact.cause).json({
      status: respondPutContact.name,
      code: respondPutContact.cause,
      message: respondPutContact.message,
    });
});

export default contactsRouter;
