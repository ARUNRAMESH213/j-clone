const knex = require("../db");
const epicsService = require("./epics-service");

async function getAllCategories(user) {
  // let categories = await knex(categories).select();
  //not working
  const categories = await knex("categories")
    .select("categories.*")
    .leftJoin("epics", "epics.id", "=", "categories.epic_id")
    // .leftJoin("items","items.id","=","categories.id")
    .where("epics.owner_id", user.id);

  for (let category of categories) {
    // category.epics = await knex("epics").select().where("id",user.category.epics_id).first();
    category.epic= await epicsService.getEpicById(category.epic_id)
    category.items = await knex("items")
      .select()
      .where({"category_id":category.id});
  }
  // console.log(categories);
  return categories;

  /* Option 2 
  const categories = await knex("categories")
    .select({
      id: "categories.id",
      name: "categories.name",
      created_at: "categories.created_at",
      updated_at: "categories.updated_at",
      epic_id: "epics.id",
      epic_name: "epics.name",
      epic_created_at: "epics.created_at",
      epic_updated_at: "epics.updated_at",
    })
    .join("epics", "categories.epic_id", "=", "epics.id")
    .where("epics.owner_id", user.id);

  const results = [];

  for (let category of categories) {
    results.push({
      id: category.id,
      name: category.name,
      created_at: category.created_at,
      updated_at: category.updated_at,
      epic: {
        id: category.epic_id,
        name: category.epic_name,
        created_at: category.epic_created_at,
        updated_at: category.epic_updated_at,
      },
      items: await knex("items").select().where("category_id", category.id),
    });
  }
  return results;
  */
}

function getCategoryById(id) {
  return knex("categories").select("*").where("id", id).first();
}

async function createCategory(category) {
  const epicId = category.epic_id;

  const epic = await epicsService.getEpicById(epicId);

  if (!epic) {
    return null;
  }

  category.created_at = new Date();
  category.updated_at = new Date();

  const [id] = await knex("categories").insert(category);

  category.id = id;

  return category;
}

async function updateCategory(id, categoryInput) {
  const category = await getCategoryById(id);

  if (!category) {
    return null;
  }

  categoryInput.updated_at = new Date();

  await knex("categories").update(categoryInput).where("id", id);

  return getCategoryById(id);
}

async function deleteCategory(id) {
  const category = await getCategoryById(id);

  if (!category) {
    return null;
  }

  const itemIds = (
    await knex("items").select("id").where("category_id", id)
  ).map((item) => item.id);

  await knex("items").del().whereIn("id", itemIds);

  await knex("categories").del().where("id", id);

  return category;
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
