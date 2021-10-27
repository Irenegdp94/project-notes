const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    //la plantilla
    username: {type: String, required: true},
    password: {type: String, required: true},
    notes: [{type: Schema.Types.ObjectId, ref: "Note"}]
},
{
    timestamps: true,
})

const User = mongoose.model("User", userSchema);
module.exports = User;