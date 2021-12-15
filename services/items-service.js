const knex = require("../db");
const { getCategoryById } = require("./categories-service");  
const {getAllEpics}=require("./epics-service")

async function getItems(user) {
  let items = [];

  if (user.id) {
    items = await knex("items")
      .select("items.*")
      .leftJoin("categories", "items.category_id", "=", "categories.id")
      .leftJoin("epics", "categories.epic_id", "=", "epics.id")
      // .where("epics.id", epicId);
      .where("epics.owner_id", user.id);
      console.log(items);
  } else {
    items = await knex("items").select();
  }

  for (let item of items) {
    item.category = await getCategoryById(item.category_id);
    // item.epic=await getAllEpics(item.category.epic_id)
    // console.log(item.category);
    console.log(item.epic);
    // item.epics=await getAllEpics(item.category.epic_id);
   item.epics=await knex("items").select()
   .where("id",item.category.epic_id);  
  }

  return items;

}

async function createItem(item) {
  const category = await getCategoryById(item.category_id);

  if (!category) {
    return null;
  }

  item.created_at = new Date();
  item.updated_at = new Date();

  const [id] = await knex("items").insert(item);

  item.id = id;
  item.category = category;
  console.log(item);

  return item;
}

async function getItemById(id) {
  const item = await knex("items").where({ id }).first();

  if (!item) {
    return null;
  }

  item.category = await getCategoryById(item.category_id);

  return item;
}

async function updateItem(id, itemInput) {
  const item = await getItemById(id);

  if (!item) {
    return null;
  }

  if (itemInput.category_id) {
    const category = await getCategoryById(itemInput.category_id);

    if (!category) {
      return null;
    }
  }

  itemInput.updated_at = new Date();

  await knex("items").where({ id }).update(itemInput);

  return getItemById(id);
}

async function deleteItem(id) {
  const item = await getItemById(id);

  if (!item) {
    return null;
  }

  await knex("items").where({ id }).del();

  return item;
}

module.exports = {
  getItems,
  createItem,
  getItemById,
  updateItem,
  deleteItem,
};
