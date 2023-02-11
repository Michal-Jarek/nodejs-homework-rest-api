import express from "express";
import { addContact, getContactById, listContacts, removeContact } from "../../models/contacts.js";


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
  console.log(contact.code);
  res.status(404);
  // if (contact)
  //   res.status(200).json({
  //     status: "succes",
  //     code: 200,
  //     data: contact,
  //   });
  // else
  //   res.status(404).json({
  //     status: "Not found",
  //     code: 404,
  //   });
});

contactsRouter.post("/", async (req, res, next) => {
  res.json({ message: "template message" });
});

contactsRouter.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

contactsRouter.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

export default contactsRouter;
