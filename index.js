const express = require("express");
const morgan = require("morgan");
const session = require("express-session");

const epicsRouter = require("./controllers/epics-controller");
const categoriesRouter = require("./controllers/categories-controller");
const itemsRouter = require("./controllers/items-controller");
const usersRouter = require("./controllers/users-controller");
// const { reset } = require("nodemon");

const app = express();
app.use(morgan("combined"));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 600000 },
  })
);

app.use(async function (req, res, next) {
  try {
    await next();
  } catch (err) {
    console.log("something went wrong", err);
    res.status(500).send({ message: "internal server error" });
  }
});

app.use(express.json());

app.use("/api/v1/epics", epicsRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/items", itemsRouter);
app.use("/api/v1/auth", usersRouter);

app.get("/hello", (req, res) => {
  if (req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send({ message: "world", count: req.session.count });





});

app.listen(3000);
