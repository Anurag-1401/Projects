const express = require('express')
const connectDB = require('./db')
const dotenv = require('dotenv')
const cors = require('cors')
const Router = require('./Routes/routes')



const app = express()
connectDB()
dotenv.config()

app.use(cors({
    origin : ["https://anurag-portfolio-psi.vercel.app","http://localhost:8080", "http://localhost:8081", "http://10.70.46.39:8080"],
    methods : ["POST","GET","PUT","DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}))

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));


app.get('/',(req , res) => {
    res.send("Welcome to Anurag's Portfolio!");
})

app.use('/api', Router)

module.exports = app
