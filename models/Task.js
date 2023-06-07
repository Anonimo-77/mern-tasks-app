const { Schema, model } = require("mongoose");

const taskSchema = new Schema({
    title: String,
    body: String,
    status: {
        type: String
    },
});

const Task = model("Task", taskSchema);

module.exports = {taskSchema,Task};