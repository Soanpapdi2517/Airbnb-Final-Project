const Home = require("../models/home");
const fs = require('fs');
exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    editingQuery: false,
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};
exports.getEditHome = (req, res, next) => {
  const editId = req.params.edithomeId;
  const editingQuery = req.query.editing === "true";
  Home.findById(editId)
    .then((home) => {
      //--> single home object we are getting here
      if (!home) {
        console.log("Home is not found for edit");
        return res.redirect("/host/host-home-list");
      } else {
        return res.render("host/edit-home", {
          home: home,
          pageTitle: "Edit Your Home",
          currentPage: "host-homes",
          editingQuery: editingQuery,
          isLoggedIn: req.session.isLoggedIn,
          user: req.session.user,
        });
      }
    })
    .catch((error) => {
      console.log("Error found while getting the edit Home", error);
    });
};

exports.getHostHomes = (req, res, next) => {
  Home.find()
    .then((registeredHomes) => {
      res.render("host/host-home-list", {
        registeredHomes: registeredHomes,
        pageTitle: "Host Homes List",
        currentPage: "host-homes",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
      });
    })
    .catch((error) => {
      console.log("Error found while fetching data");
    });
};

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, description } = req.body; // destructured values of
  // houseName, price, location, rating, photo, description
  console.log(req.file);
  const photo = req.file.path;
  const home = new Home({
    // when variables of key and values are same then,
    // we only need to provide key
    houseName,
    price,
    location,
    rating,
    photo,
    description,
  });
  home
    .save()
    .then(() => {
      res.render("host/home-added", {
        pageTitle: "Home Added Successfully",
        currentPage: "homeAdded",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
      });
    })
    .catch((error) => {
      console.log("found error in saving the data", error);
    });
};

exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, description } =
    req.body;
  Home.findById(id)
    .then((home) => {
      if (!home) {
        console.log("unable to get the home as it is not defined");
        res.redirect("/host/host-home-list");
      }
      home.houseName = houseName;
      home.price = price;
      home.location = location;
      home.rating = rating;
      home.description = description;
      if(req.file){ //in edit case file won't come until it is edited
        fs.unlink(home.photo, err => {
          console.log('error found in removing previous image', err)
        })
        home.photo = req.file.path; 
      }
      home.save();
    })
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch((error) => {
      console.log("found error updating the data", error);
    });
};

exports.postDeleteHome = (req, res, next) => {
  const deleteId = req.params.deleteHomeId;
  Home.findByIdAndDelete(deleteId)
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch((error) => {
      console.log("Error found in deleting the file", error);
    });
};
