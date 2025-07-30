const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController')

//Login & logout Related Routes👇🏼
authRouter.get("/login", authController.getLogin);
authRouter.post("/login", authController.postLogin);
authRouter.post("/logout", authController.postLogout);

//Sign-up Related Routes👇🏼
authRouter.get("/signup", authController.getSignUp);
authRouter.post("/signup", authController.postSignUp);


module.exports = authRouter;