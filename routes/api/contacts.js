const express = require("express");
const contacts = require("../../models/contacts");

const router = express.Router();

// http://localhost:3000/api/contacts
router.get("/", async (req, res, next) => {
  const all = await contacts.getAll();

  res.json(all);
});

// http://localhost:3000/api/contacts/AeHIrLTr6JkxGE6SN-0Rw
router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const cnt = await contacts.getById(contactId);
  if (cnt === null) {
    res.status(404);
    res.json({ message: "Not found" });
    return;
  }
  res.json(cnt);
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    res.json({ message: "missing required name field" });
    return;
  }
  const resp = await contacts.add(name, email, phone);
  res.status(201);
  res.json(resp);
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const cnt = await contacts.deleteContact(contactId);
  if (cnt === null) {
    res.status(404);
    res.json({ message: "Not found" });
    return;
  }
  res.status(200);
  res.json({ message: "contact deleted" });
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  const newCont = contacts.update(contactId, name, email, phone);
  if (newCont === null) {
    res.status(404);
    res.json({ message: "not found" });
    return;
  }
  res.json(newCont);
});

module.exports = router;
