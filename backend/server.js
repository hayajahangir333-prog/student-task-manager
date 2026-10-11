const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("Cartify Backend is Running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});