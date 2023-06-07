const { Schema, model } = require("mongoose");
const { taskSchema } = require("./Task");

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    tasks: [taskSchema]
});

const User = model("User", userSchema);
module.exports = {User};