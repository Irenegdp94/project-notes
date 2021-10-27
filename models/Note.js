const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const noteSchema = new Schema({
    titlenote: {type: String},
    usernote: {type: String}
},
{
    timestamps: true,
})

const Point = mongoose.model("Note", noteSchema);
module.exports = Point;