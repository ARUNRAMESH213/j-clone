const knex = require("../db");
const bcrypt = require("bcrypt");

async function createUser(user) {
  const [id] = await knex("users").insert(user);

  user.id = id;

  return user;
}
async function logInuser(username, password) {
  const user = await knex("users")
    .select()
    .where({
      username,
      // password,
    })
    .first();

  // return user;

  if(user && bcrypt.compareSync(password,user.password)){
    return user;
  }
  return null;
}

module.exports = {
  createUser,
  logInuser,
};
