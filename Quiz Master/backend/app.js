const path = require("path");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const routes = require("./Routes/routes");

connectDB();

const app = express();
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.use(cors({
    origin: ["http://localhost:8080","https://quiz-master-ochre-theta.vercel.app"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to Quiz Master');
});

app.use('/api', routes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});



module.exports = app;
