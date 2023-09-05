const { Pool } = require("pg");

const pool = new Pool({
  user: "kejrvqye",
  host: "trumpet.db.elephantsql.com",
  database: "kejrvqye",
  password: "QI5rzGbfg4JxXLvXFHzz4RCLy9x0-BA5",
  port: 5432,
});

// add user

async function add(user) {
  try {
    const client = await pool.connect();
    await client.query("BEGIN");

    const insertProfileQuery = `
        INSERT INTO profiles (firstName, lastName, state, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `;

    const profileValues = [
      user.firstName,
      user.lastName,
      user.state,
      user.role,
    ];
    const profileResult = await client.query(insertProfileQuery, profileValues);

    const profileId = profileResult.rows[0].id;

    const insertUserQuery = `
        INSERT INTO users (username, email, role, profileId)
        VALUES ($1, $2, $3, $4)
      `;

    const userValues = [user.username, user.email, user.role, profileId];
    await client.query(insertUserQuery, userValues);

    await client.query("COMMIT");
    console.log("New user added to the database.");

    client.release();
    return user;
  } catch (error) {
    console.error("Error adding new user to the database:", error);
  }
}

// add(newUser);

// clg db

async function getAll(tableName) {
  try {
    const client = await pool.connect();

    const query = `SELECT * FROM ${tableName}`;
    const result = await client.query(query);

    console.log(`Contents of the "${tableName}" table:`);
    console.table(result.rows);

    client.release();
  } catch (error) {
    console.error(`Error logging contents of the "${tableName}" table:`, error);
  } finally {
    console.log("end");
  }
}

async function getById(tableName, id) {
  try {
    const client = await pool.connect();

    const query = `SELECT * FROM ${tableName} WHERE id = $1`;
    const result = await client.query(query, [id]);

    client.release();

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error(
      `Error getting record from ${tableName} with ID ${id}:`,
      error
    );
    throw error;
  }
}

// delete by id

async function deleteUserById(contactId) {
  try {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("DELETE FROM users WHERE id = $1", [contactId]);
      await client.query("DELETE FROM profiles WHERE id = $1", [contactId]);
      await client.query("COMMIT");
      console.log(
        `Contact with ID ${contactId} has been deleted from both tables.`
      );
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error deleting contact:", error);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error obtaining a client from the pool:", error);
  }
}

async function updateUserById(
  userId,
  newUsername,
  newEmail,
  newFirstName,
  newLastName,
  newRole,
  newState
) {
  try {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const updateUserQuery = `
          UPDATE users
          SET username = $2, email = $3, role = $6, dateCreate = NOW()
          WHERE id = $1
        `;
      await client.query(updateUserQuery, [
        userId,
        newUsername,
        newEmail,
        newRole,
      ]);

      const updateProfileQuery = `
          UPDATE profiles
          SET firstName = $2, lastName = $3, state = $7
          WHERE id = $1
        `;
      await client.query(updateProfileQuery, [
        userId,
        newFirstName,
        newLastName,
        newState,
      ]);

      await client.query("COMMIT");

      console.log(`User with ID ${userId} has been updated in both tables.`);
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error updating user:", error);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error obtaining a client from the pool:", error);
  }
}

function disconnect() {
  console.log("fin");
  return pool.end();
}

module.exports = {
  getById,
  add,
  deleteUserById,
  updateUserById,
  getAll,
  disconnect,
};
