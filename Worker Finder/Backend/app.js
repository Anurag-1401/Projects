require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const routes = require("./routes/routes");

connectDB();

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "https://workerfinder.vercel.app"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to Worker Finder API');
});

app.use('/api', routes);



module.exports = app;
