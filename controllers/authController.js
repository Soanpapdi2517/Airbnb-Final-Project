const { check, validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const user = require("../models/user");

//Login & logout Related 👇🏼
exports.getLogin = (req, res, next) => {
  console.log("Request Session: ", req.session);
  // res.session.isLoggedIn = false;
  console.log(req.session);
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "Login",
    errorsMessage: [],
    isLoggedIn: req.session.isLoggedIn,
    oldValues: { email: "" },
    user: {} // '' and undefined both are falsy values
  });
};

/**
 * 
 * exports.postLogin = async (req, res, next) => {
  console.log(req.body);
  const {email, password} = req.body;
  const userOne = await user.findOne({email});
  if (!userOne){
     return res.status(402).render("auth/login", {
    pageTitle: "Login",
    currentPage: "Login",
    errorsMessage: ['User Does not Exist'],
    isLoggedIn: req.session.isLoggedIn,
    oldValues: {email}
  });
  }

  req.session.isLoggedIn = true;
  // res.cookie("isLoggedIn", true);
  // req.session.isLoggedIn = true;
  res.redirect("/");
};
}
 */
exports.postLogin = async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;
 const userOne = await user.findOne({ email })
    if (!userOne) {
      return res.status(402).render("auth/login", {
        pageTitle: "Login",
        currentPage: "Login",
        errorsMessage: ["User Does not Exist"],
        isLoggedIn: req.session.isLoggedIn,
        oldValues: { email },
        user: {},
      });
    }
   const isMatch = await bcryptjs.compare(password, userOne.password);
      if (!isMatch) {
        return res.status(402).render("auth/login", {
        pageTitle: "Login",
        currentPage: "Login",
        errorsMessage: ["password is invalid"],
        isLoggedIn: req.session.isLoggedIn,
        oldValues: { email },
        user: {},
      });
      }else {
        req.session.isLoggedIn = true;
        req.session.user = userOne;
        await req.session.save();
            res.redirect("/");
      }
    // req.session.isLoggedIn = true;
};

exports.postLogout = (req, res, next) => {
  //res.clearCookie("isLoggedIn") --> clears cookie
  req.session.destroy((error) => {
    res.redirect("/login");
    if (error) {
      console.log("error in destroying isLoggedIn session in mongoDB: ", error);
    }
  });
};

// Sign up related 👇🏼

exports.getSignUp = (req, res, next) => {
  res.render("auth/signUp", {
    pageTitle: "SignUp",
    currentPage: "Sign-Up",
    isLoggedIn: req.session.isLoggedIn,
    oldValues: {
      firstName: '',
      lastName: '',
      email: '',
      userType: '',
      user: {},
    },
    errorsMessage: "", // falsy value
  });
};

exports.postSignUp = [
  check("firstName")
    .notEmpty()
    .withMessage("Please fill your firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Your name Contain atleast Two Letters")
    .matches(/^[a-zA-z/s]+$/)
    .withMessage("Your name only Should contain alphabets"),

  check("lastName")
    .trim()
    .matches(/^[a-zA-z/s]*$/)
    .withMessage("Your name only Should contain alphabets"),

  check("email")
    .isEmail()
    .withMessage("Enter a Valid Email Address")
    .normalizeEmail(),

  check("password")
    .trim()
    .notEmpty()
    .withMessage("Please Enter the Password")
    .isLength({ min: 8 })
    .withMessage("Password should be minimum of 8 Characters")
    .matches(/[a-z]/)
    .withMessage("Password Should Contain Atleast One Small Alphabet(a-z)")
    .matches(/[A-Z]/)
    .withMessage("Password Should Contain Atleast One Capital Alphabet(A-Z)")
    .matches(/[0-9]/)
    .withMessage("Password Should Contain Atleast One Number(0-9)")
    .matches(/[!@#$&<>-_~]/)
    .withMessage(
      "Password Should Contain Atleast One Special Character(!@#$&<>-_~)"
    ),
  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password are not matching");
      } else {
        return true;
      }
    }),
  check("userType")
    .notEmpty()
    .withMessage(`Choose UserType 'Guest' or 'Host'`)
    .isIn(["guest", "host"])
    .withMessage("Invalid User Type"),
  check("t&c")
    .notEmpty()
    .withMessage("You must accept our Terms and Conditions")
    .custom((value) => {
      if (value !== "on") {
        throw new Error(
          "Only after Accepting Terms and Conditions you can sign in"
        );
      } else {
        return true;
      }
    }),
  (req, res, next) => {
    console.log(req.body);
    const { firstName, lastName, email, userType, password } = req.body;
    const errorsInFillingForm = validationResult(req);
    if (!errorsInFillingForm.isEmpty()) {
      console.log(errorsInFillingForm.array().map((errors) => errors.msg));
      res.status(402).render("auth/signup", {
        pageTitle: "SignUp",
        currentPage: "Sign-Up",
        isLoggedIn: req.session.isLoggedIn,
        errorsMessage: errorsInFillingForm.array().map((errors) => errors.msg),
        user: {},
        oldValues: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          userType: userType,
        },
      });
    } else {
      bcryptjs
        .hash(password, 12)
        .then((hashPassword) => {
          const userData = new user({
            firstName,
            lastName,
            email,
            password: hashPassword,
            userType,
          });
          return userData.save();
        })
        .then(() => {
          res.redirect("/login");
        })
        .catch((error) => {
          console.log("Error in saving user data in mongoDb", error);
          res.status(402).render("auth/signup", {
            pageTitle: "SignUp",
            currentPage: "Sign-Up",
            isLoggedIn: req.session.isLoggedIn,
            errorsMessage: [error.message],
            user: {},
            oldValues: {
              firstName: firstName,
              lastName: lastName,
              email: email,
              userType: userType,
            },
          });
        });
    }
  },
];
