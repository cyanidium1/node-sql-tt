const express = require("express");
const db = require("./db");

const router = express.Router();

// all
// http://localhost:3000/api/contacts
router.get("/", async (req, res, next) => {
  const all = await db.getAll("users");
  res.json(all);
});

// by id
// http://localhost:3000/api/contacts/AeHIrLTr6JkxGE6SN-0Rw
router.get("/:userId", async (req, res, next) => {
  const { userId } = req.params;
  db.getById("users", userId)
    .then((user) => {
      if (user) {
        // console.log(`user with ID ${userId}:`);
        // console.log(user);
        res.json(user);
      } else {
        // console.log(`user with ID ${userId} not found.`);
        res.json("not found");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

// post

// post {
//   username: "John",
//   email: "john@example.com",
//   firstName: "John",
//   lastName: "Smith",
//   state: "male",
//   role: "admin",
// };

router.post("/", async (req, res, next) => {
  const { username, email, firstName, lastName, state, role } = req.body;
  if (!username || !email || !firstName || !lastName || !state || !role) {
    res.status(400);
    res.json({ message: "missing required name field" });
    return;
  }
  const resp = await db.add(req.body);
  res.status(201);
  res.json(resp);
});

// delete

router.delete("/:userId", async (req, res, next) => {
  const { userId } = req.params;
  const cnt = await db.deleteUserById(userId);
  if (cnt === null) {
    res.status(404);
    res.json({ message: "Not found" });
    return;
  }
  res.status(200);
  res.json({ message: "User deleted" });
});

// update

// router.put("/:userId", async (req, res, next) => {
//   const { username, email, firstName, lastName, state, role } = req.body;
//   if (!username || !email || !firstName || !lastName || !state || !role) {
//     res.status(400);
//     res.json({ message: "missing required name field" });
//     return;
//   }
//   const { userId } = req.params;
//   db.updateUserById(
//     userId,
//     username,
//     email,
//     firstName,
//     lastName,
//     state,
//     role
//   );
// });

module.exports = router;
