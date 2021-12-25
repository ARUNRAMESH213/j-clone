
const db = require("../db");
const jwt=require("jsonwebtoken");




function authorizeRequest(req, res, next) {
  if (req.headers.authorization) {
    const userName = req.headers.authorization;
    if (userName === "admin") {
      next();
      return;
    }
  }

  res.status(401).send({ message: "Unauthoriz" });
}
async function basicAuthenticateUser(req, res, next) {
  const userInfo = req.headers.authorization;

  if (!userInfo || !userInfo.startsWith("Basic") ) {
    return next();
  }
  const credentials = userInfo.split(" ")[1];

  if (credentials) {
    const decoded = Buffer.from(credentials, "base64").toString();
    const [username, password] = decoded.split(":");

    if (username) {
      const user = await db("users")
        .select()
        .where("username", username)
        .first();
      if (user && user.password === password) {
        req.user = user;
      }
    }
  }
  next();
}

async function isLoggedIn(req, res, next) {
  req.user = req.user || req.session.user;
  if (req.user) {
    next();
     console.log("log in",req.user);
    return;
  }
  // res.setHead(er401,{"www.authenticate":"Basic"})
  res.status(401).send({ message: "Unauthorized" });
}

async function isOwnerOfEpic(req, res, next) {
  const epicId = Number(req.body.epic_id ? req.body.epic_id : req.params.id);

  console.log("epicid", epicId);

  const epic = await db("epics")
    .select("id", "owner_id")
    .where({ id: epicId, owner_id: req.user.id })
    .first();

  // console.log( "hkhkgkhhfgd",epic);
  if (epic) {
    next();
    return;
  }

  res.status(401).send({ message: "access denied" });
}

async function isOwnerOfCategory(req, res, next) {
  const categoryId = Number(req.body.category_id ? req.body.category_id : req.params.id);
  // const categoryId = Number(req.body.category_id ? req.body.category_id : req.params.id);
  console.log(")______________________))))))))___________", categoryId);
  const isOwner = await db("categories")
    .leftJoin("epics", "categories.epic_id", "=", "epics.id")
    .select("epics.owner_id")
    .where({ "categories.id": categoryId, "epics.owner_id": req.user.id })
    .first();
  console.log(">>>---->>>>", isOwner);
  if (isOwner) {
    next();
    return;
  }
  res.status(401).send({ message: "access denied" });
}

async function isOwnerOfItem(req,res,next) {
  const itemId=req.params.id
  const isOwner=await db("items")
  .leftJoin("categories","items.category_id","=","categories.id")
  .leftJoin("epics","categories.epic_id","=","epics.id")
  .where({"items.id":itemId,"epics.owner_id":req.user.id})
  .first();
  console.log("******************&&&&",isOwner)
  if (isOwner) {
    next();
    return;
  }
  res.status(401).send({ message: "access denied" });
}

  

//another one for owner category
// await getCategoryById(categoryId)
// console.log(category)
// req.body.epic_id=category.epic_id
// isOwnerOfEpic(req,res,next)

// const epicId = Number(req.body.epic_id);
// // const categoryId = Number(req.params.id);
// //  console.log("categoryid",categoryId)
// console.log(">---------->>", epicId);
// console.log(req.user);
// const category = await db("categories")
//   .leftJoin("epics", "categories.epic_id", "=", "epics.id")
//   .select("epic_id", "epics.owner_id")
//   .where({ "categories.epic_id": epicId, "epics.owner_id": req.user.id })
//   .first();

// /* const category = await db("categories")
//    .select("categories.*")
// .leftJoin("epics", "categories.epic_id", "=", "epics.id")
//   .where({
//     "categories.epic_id": epicId,
//   //  "categories.id":categoryId, "epics.owner_id": req.user.id,
//   })
//   .first();*/

// console.log("category", category);
// if (category) {
//   next();
//   return;
// }

//   // res.status(401).send({ message: "Unauthorized1" });
// }


async function jwtAuthentication(req,res,next)
{  
  const authHeader=req.headers.authorization;
  if(!authHeader){
    next()
    return;
  }
  if(authHeader && authHeader.startsWith("Bearer")){
    const token=authHeader.split(" ")[1]

    console.log("0000------ token",token)
  
  if(token){
    try{
    const decoded=jwt.verify(token,"secret")
    console.log("0000------ decoded",decoded) 
    const user=await db("users")
    .select()
    .where({id:decoded.userId})
    .first();
    console.log("user(((())))))))))))) user",user)
    if(user){
      req.user=user;
      next();
      console.log("user(((())))))))))))) req.user",req.user)
      return;
    }
  }
  catch(err){

    console.log("%%%%%%%%---------",err)
    res.status(401).send({message:"invalid token provided"});
    return;
  }
}
  }
next();

}
module.exports = {
  authorizeRequest,
  authenticateUser: basicAuthenticateUser,
  isLoggedIn,
  isOwnerOfEpic,
  isOwnerOfCategory,
  isOwnerOfItem,
  jwtAuthentication,
}
