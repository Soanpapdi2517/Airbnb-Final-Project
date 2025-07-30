const Home = require("../models/home");
const user = require("../models/user");
const path = require('path');
const rootDir = require('../utils/pathUtil')
exports.getIndex = (req, res, next) => {
  console.log("Request Session & isLoggedIn value : ", req.session.isLoggedIn);
  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "airbnb Home",
      currentPage: "index",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getHomes = (req, res, next) => {
  Home.find() //-->
    .then((registeredHomes) => {
      res.render("store/home-list", {
        registeredHomes: registeredHomes,
        pageTitle: "Homes List",
        currentPage: "Home",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
      });
    })
    .catch((error) => {
      console.log("Error found in getting homes from the database", error);
    });
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId)
    .then((home) => {
      // --> single home we are getting here
      if (!home) {
        return res.redirect("/homes");
      } else {
        return res.render("store/home-detail", {
          home: home,
          pageTitle: "Home Detail",
          currentPage: "homes",
          isLoggedIn: req.session.isLoggedIn,
          user: req.session.user,
        });
      }
    })
    .catch((error) => {
      console.log("Error found in getting the details", error);
    });
};
// Favourites functionality
// Add to Favourtites
exports.postFavourite = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const userData = await user.findById(userId);
  try{
  if(!userData.favourite.includes(homeId)){
  userData.favourite.push(homeId);
  await userData.save();
  }
  }catch{
    console.log('Error found in saving the favourite in MongoDb');
  }

  res.redirect('/favourites')
};
// get Favourite list
exports.getFavouriteList = async (req, res, next) => {
  const userId = req.session.user._id;
  const userData = await user.findById(userId).populate('favourite');
    res.render("store/favourite-list", {
    favouriteHomeList: userData.favourite,
    pageTitle: "My Favourites",
    currentPage: "favourites",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
  
};
//  remove from get Favourite list
exports.postRemoved = async (req, res, next) => {
  const removeId = req.body.id;
  const userId = req.session.user._id;
  const userFavData = await user.findById(userId);


userFavData.favourite = userFavData.favourite.filter(userFavHouseId =>
    userFavHouseId.toString() !== removeId.toString() );
    try{
  await  userFavData.save();
  res.redirect("/favourites");
    }catch{
      console.log('Error in deleting favourite home', Error)
    }
};

exports.getHouseRules = [(req, res, next)=> {
  if(!req.session.isLoggedIn){
    return res.redirect('/login');
  }
  next();
}, (req,res,next)=> {
  const fileFullName = `homeRules.pdf`
  const filePath = path.join(rootDir, 'rules', fileFullName);
  res.download(filePath, 'rules.pdf');
}]