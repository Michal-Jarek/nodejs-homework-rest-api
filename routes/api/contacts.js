import express from "express";
import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
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
  
  console.log(req.body);
  const { name, email, phone } = req.body;
  addContact(req.body);
  res.json({ message: "template message" });
});

contactsRouter.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

contactsRouter.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

export default contactsRouter;
