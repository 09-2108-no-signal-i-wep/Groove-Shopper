const router = require("express").Router();
const { User } = require("../db/models");
const { requireToken } = require("../api/userMiddleware");

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    res.send({ token: await User.authenticate({ email, password }) });
  } catch (err) {
    next(err);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await User.create({ firstName, lastName, email, password });
    res.send({ token: await user.generateToken() });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(401).send("User already exists");
    } else {
      next(err);
    }
  }
});

router.get("/me", async (req, res, next) => {
  try {
    console.log(
      'BIG STUPID LABELSrouter.get("/me",',
      req.headers.authorization
    );
    const user = await User.findByToken(req.headers.authorization);
    console.log("user here:::: ", user);
    res.send(user);
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
