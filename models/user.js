const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: { type: String, required: [true, "First Name is required"] },
  lastName: String,
  fullName: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, required: [true, "Password is required"] },
  userType: {
    type: String,
    enum: ["guest", "host"],
    required: true,
    default: "guest",
  },
  favourite: [{type: mongoose.Schema.Types.ObjectId, 
    ref: 'Home' // yaha ki object ID Save krega ye array of user
  }]
});

userSchema.pre("save", async function (next) {
  this.fullName = `${this.firstName} ${this.lastName}`;
  next();
});

module.exports = mongoose.model("user", userSchema);
