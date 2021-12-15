const express = require("express");

const router = express.Router();
const categoriesService = require("../services/categories-service");
const {
  authenticateUser,
  isLoggedIn,
  isOwnerOfEpic,
  isOwnerOfCategory,
} = require("../middleware/auth");

function catchError(fn) {
  return async function (req, res) {
    try {
      await fn(req, res);
    } catch (err) {
      console.error("Error: ", err);
      res.status(500).send({
        message: "Internal server error",
      });
    }
  };
}

const getAllCategories = catchError(async function (req, res) {
  res.send(await categoriesService.getAllCategories(req.user));
});

router.get("/", authenticateUser, isLoggedIn, getAllCategories);

router.post(
  "/",
  // validateCategoryBody,
  authenticateUser,
  isLoggedIn,
  isOwnerOfEpic,
  catchError(async (req, res) => {
    const newCategory = await categoriesService.createCategory(req.body);

    if (!newCategory) {
      res.status(400).send({
        message: "Invalid category data",
      });
      return;
    }

    res.status(201).send(newCategory);
  })
);

router.get(
  "/:id",
  authenticateUser,
  isLoggedIn,
  isOwnerOfCategory,
  async (req, res) => {
    const category = await categoriesService.getCategoryById(
      Number(req.params.id)
    );

    if (!category) {
      res.status(404).send({
        message: "Category not found",
      });
      return;
    }

    res.send(category);
  }
);

function validateCategoryBody(req, res, next) {
  req.body = {
    name: req.body.name,
    epic_id: req.body.epic_id,
  };

  if (typeof req.body.epic_id !== "number") {
    res.status(400).send({
      message: "epic_id should be an integer",
    });
    return;
  }

  if (!req.body.name) {
    res.status(400).send({
      message: "Name cannot be empty",
    });
    return;
  }

  next();
}

router.put(
  "/:id",
  authenticateUser,
  isLoggedIn,
  isOwnerOfCategory,
  async (req, res) => {
    const updatedCategory = await categoriesService.updateCategory(
      Number(req.params.id),
      req.body
    );

    if (!updatedCategory) {
      res.status(404).send({
        message: "Category not found",
      });
      return;
    }

    res.send(updatedCategory);
  }
);

router.delete(
  "/:id",
  authenticateUser,
  isLoggedIn,
  isOwnerOfCategory,
  async (req, res) => {
    const deletedCategory = await categoriesService.deleteCategory(
      Number(req.params.id)
    );

    if (!deletedCategory) {
      res.status(404).send({
        message: "Category not found",
      });
      return;
    }

    res.send(deletedCategory);
  }
);

module.exports = router;
