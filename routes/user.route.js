const route = require("express").Router();
const userModel = require("../models/user.model");
const {verifyOldPassword} =require("../utils/password.verification")

const {
  verifyToken,
  verifyRefreshToken,
} = require("../utils/token.verification");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });



route.get("/authUser", verifyRefreshToken, verifyToken, (req, res) => {
  const userId = req.tokenData.userId;
  userModel
    .getUserById(userId)
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      console.log(err);
    });
});
route.post("/update", upload.single("image"), (req, res) => {
  const id = req.body.id;
  const image = req.file ? req.file.filename : "";
  console.log(image);
  userModel
    .updateUser(id, req.body, image)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
route.post("/update/password", verifyOldPassword, (req, res) => {
  const id = req.body.id;
  console.log(req.body)
  console.log("route")
  userModel
    .updatePasswordUser(id, req.body.ActualPassword,req.body.password)
    .then((result) => {
      console.log("succeess2")
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log("errzeur fil route")
      res.status(500).json(err);
    });
});

route.post("/update/email",(req,res)=>{
  const id = req.body.id;
  const email = req.body.email;
  userModel
  .updateEmail(id,email)
  .then((result)=>{
    res.status(200).json(result);
  })
  .catch((err)=>{
    res.status(500).json(err);
  })
})

route.get("/mylist/:id", (req, res) => {

  userModel
    .getMyListUser(req.params.id)
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((err) => {
      console.log(err);
    });
});

route.post("/mylist/delete/:id", (req, res) => {
userModel.deleteFromMyListUser(req.params.id)
.then((results) => {
  res.status(200).json(results);
})
.catch((err) => {
    console.log(err);
});
});

route.post("/mylist/add", (req, res) => {
  const {userId, mediaType, mediaId} = req.body;
userModel.addToMyListUser(userId, mediaType, mediaId)
.then((results) => {
  res.status(200).json(results);
})
.catch((err) => {
    console.log(err);
});
});

module.exports = route;
