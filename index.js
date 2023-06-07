const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// set up express

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));

// set up mongoose

mongoose.connect(
    process.env.MONGODB_CONNECTION_STRING,
    
).then(() => {
    console.log("DB is connected")
}).catch(err => {
    console.error(err);
});

// set up routes

app.use("/users", require("./routes/users"));
app.use("/tasks", require("./routes/tasks"));