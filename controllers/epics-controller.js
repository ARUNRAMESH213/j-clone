const express = require("express");

const router = express.Router();
const epicsService = require("../services/epics-service");
// const {getAllEpics}=require("../services/epics-service")
const {
  authorizeRequest,
  authenticateUser,
  jwtAuthentication,
  isLoggedIn,
  isOwnerOfEpic,
} = require("../middleware/auth");

router.get("/", authenticateUser, jwtAuthentication ,isLoggedIn,async (req, res) => {
  res.send(await epicsService.getAllEpics(req.user));
});

router.post("/", authenticateUser,jwtAuthentication,isLoggedIn, async (req, res) => {
  try {
    const newEpic = await epicsService.createEpic(req.body.name, req.user);
    res.status(201).send(newEpic);
  } catch (err) {
    if (err.errno === 19) {
      res.status(400).send({
        error: "Epic name already exists",
      });
    } else {
      console.error(err);
      res.status(500).send({
        message: "Internal server error",
      });
    }
  }
});

router.get("/:id",authenticateUser, isLoggedIn,isOwnerOfEpic, async (req, res) => {
  const epic = await epicsService.getEpicById(Number(req.params.id));
  if (epic) {
    res.send(epic);
  } else {
    res.status(404).send({
      message: "Epic not found",
    });
  }
});

router.put("/:id", authenticateUser, jwtAuthentication , isLoggedIn,isOwnerOfEpic, async (req, res) => {
  const updatedEpic = await epicsService.updateEpic(
    Number(req.params.id),
    req.body.name
  );

  if (!updatedEpic) {
    res.status(404).send({
      message: "Epic not found",
    });
    return;
  }

  res.send(updatedEpic);
});

router.delete("/:id",authenticateUser, isLoggedIn,isOwnerOfEpic, async (req, res) => {
  const deletedEpic = await epicsService.deleteEpic(Number(req.params.id));

  if (!deletedEpic) {
    res.status(404).send({
      message: "Epic not found",
    });
    return;
  }

  // res.status(204).send();
  res.send(deletedEpic);
});

module.exports = router;
