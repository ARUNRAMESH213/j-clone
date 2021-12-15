const express = require("express");
const router = express.Router();
const usersService = require("../services/users-service");

router.post("/register", async (req, res) => {
  try {
    const user = await usersService.createUser(req.body);
    res.send(user); 
  } catch (err) {
    if (err.errno === 19) {
      res.status(400).send({
        message: "Username already exists",
      });
    } else {
      console.error(err);
      res.status(500).send({
        message: "Internal server error",
      });
    }
  }
});


router.post("/login",async(req,res)=>{
  const user=await usersService.logInuser(
    req.body.username,
    req.body.password
  );

  if(user){
    req.session.user=user;
    res.send({message:"logged in successfully"});
  }else{
    res.status(401).send({message:"invalid username or password"})
  }
})

module.exports = router;
