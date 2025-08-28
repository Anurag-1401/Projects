require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const routes = require("./Routes/routes");

connectDB();

const app = express();

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



module.exports = app;
