// server.js

const express = require("express");
const cors = require("cors");
const cookie_parser = require('cookie-parser');
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // no .js needed in CommonJS
const chatRoutes = require("./routes/chat.routes"); // no .js needed
const userRoutes = require('./routes/user.routes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookie_parser())

app.use("/api", chatRoutes);
app.use("/user", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
