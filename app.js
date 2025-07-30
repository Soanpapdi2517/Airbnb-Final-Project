// Core Module
const path = require("path");

// External Module
const express = require("express");
const DB_PATH =
  "mongodb+srv://Soanpapdi1725:9315073106@soanpapdi1725.w93nxq9.mongodb.net/airbnb?retryWrites=true&w=majority&appName=Soanpapdi1725";
//Local Module
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");
const mongoose = require("mongoose");
const multer = require("multer");
const authRouter = require("./routes/authRouter");
const session = require("express-session");
const mongoStore = require("connect-mongodb-session")(session);
const store = new mongoStore({
  uri: DB_PATH,
  collection: "session store",
});
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

const randomName = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for(let i = 0; i < length; i++){
     result += characters.charAt(Math.floor(Math.random()*characters.length))
  }
  return result;
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'upload/')
  },
  filename: (req, file, callback) => {
    callback(null, randomName(12) + '-' + file.originalname)
  }
})

const fileFilter = (req, file, callback) => {
  if(['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype)){
    callback(null, true);
  }else{
    callback(null, false);
  }
}

const multerObject = {
  storage,
  fileFilter
}
//getting photo where i will receieve image
app.use(multer(multerObject).single('photo'));
app.use(express.static(path.join(rootDir, "public")));
app.use("/upload" , express.static(path.join(rootDir, "upload")));
app.use("/host/upload" , express.static(path.join(rootDir, "upload")));
app.use(express.urlencoded());






app.use(
  session({
    secret: "soanpapdi2517",
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);

app.use(authRouter);
app.use(storeRouter);
app.use("/host", (req, res, next) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect("/Login");
  }
});
app.use("/host", hostRouter);


app.use(errorsController.pageNotFound);

const PORT = 4000;

mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("mongoDB is connected");
    app.listen(PORT, () => {
      console.log(`Server running on address http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error in Connecting mongoDb: ", error);
  });
