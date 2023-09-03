const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.join(__dirname, "contacts.json");

const getAll = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const getById = async (Id) => {
  const contacts = await getAll();
  const result = contacts.find((el) => el.id === Id);
  return result || null;
};

const add = async (name, email, phone) => {
  const contacts = await getAll();
  const newCont = {
    id: Math.random() * 10000000000000000 + "",
    name,
    email,
    phone,
  };
  contacts.push(newCont);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newCont;
};

const deleteContact = async (id) => {
  const contacts = await getAll();
  const contactId = contacts.findIndex((el) => el.id === id);
  if (!contactId || contactId === -1) {
    return null;
  }
  const result = contacts.splice(contactId, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
};

const update = async (id, name, email, phone) => {
  const contacts = await getAll();
  const contactId = contacts.findIndex((el) => el.id === id);
  if (!contactId || contactId === -1) {
    return null;
  }
  contacts.splice(contactId, 1);
  const newCont = {
    id: id,
    name,
    email,
    phone,
  };
  contacts.push(newCont);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newCont;
};

module.exports = {
  getAll,
  getById,
  deleteContact,
  add,
  update,
};

// const getContactById = async (contactId) => {};

// const removeContact = async (contactId) => {};

// const addContact = async (body) => {};

// const updateContact = async (contactId, body) => {};

// module.exports = {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContact,
// };
