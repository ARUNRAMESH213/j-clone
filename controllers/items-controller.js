const express = require("express");
const { authenticateUser, isLoggedIn ,isOwnerOfEpic, isOwnerOfCategory,isOwnerOfItem} = require("../middleware/auth");
const router = express.Router();
const itemsService = require("../services/items-service");

router.get("/",authenticateUser,isLoggedIn, async (req, res) => {
  const epicId = req.body.epic_id;

  // res.send(await itemsService.getItems(Number(epicId)));
  res.send(await itemsService.getItems(req.user));
});

router.get("/:id",authenticateUser, isLoggedIn,isOwnerOfItem, async (req, res) => {
  const item = await itemsService.getItemById(Number(req.params.id));

  if (!item) {
    res.status(404).send({ message: "Item not found" });
    return;
  }

  res.send(item);
});

router.post("/", authenticateUser,isLoggedIn, isOwnerOfCategory, async (req, res) => {
  const item = await itemsService.createItem(req.body);

  if (!item) {
    res.status(400).send({ message: "Invalid input" });
    return;
  }

  res.status(201).send(item);
});

router.put("/:id",authenticateUser, isLoggedIn,isOwnerOfItem, async (req, res) => {
  const updatedItem = await itemsService.updateItem(
    Number(req.params.id),
    req.body
  );

  if (!updatedItem) {
    res.status(400).send({ message: "Invalid input" });
    return;
  }

  res.send(updatedItem);
});

router.delete("/:id",authenticateUser, isLoggedIn,isOwnerOfItem, async (req, res) => {
  const item = await itemsService.deleteItem(Number(req.params.id));

  if (!item) {
    res.status(404).send({ message: "Item not found" });
    return;
  }

  res.send(item);
});

module.exports = router;
