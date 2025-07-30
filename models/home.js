/**
 * this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photo = photo;
    this.description = description;
    this._id = _id;
 * 
    functions of object
    Save()
    Static FetchAll()
    Static findById(homeId)
    Static deleteById(deleteId)

 */
const mongoose = require("mongoose");

const homeSchema = mongoose.Schema({
  houseName: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  rating: { type: String, required: true },
  photo: { type: String, required: true },
  description: String,
});
// homeSchema.pre('findOneAndDelete', async function(next) {
//    const homeId = this.getQuery()._id;
//    await Favourite.deleteMany({houseId: homeId});
//    next();
// })
module.exports = mongoose.model("Home", homeSchema);
// Home is model and homeSchema means the data type of each key on which it will built
