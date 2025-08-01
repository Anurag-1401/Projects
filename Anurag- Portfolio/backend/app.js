const express = require('express')
const connectDB = require('./db')
const dotenv = require('dotenv')
const cors = require('cors')
const Router = require('./Routes/routes')
const admin = require("firebase-admin");



const app = express()
app.use(express.json())

const serviceAccount = require("./andy-port-firebase-adminsdk-fbsvc-9ab63989c0.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });



connectDB()
dotenv.config()



app.get('/',(req , res) => {
    res.send("Welcome to Anurag's Portfolio!");
})




app.use(cors({
    origin : ["http://localhost:8080", "http://localhost:8081", "http://10.70.46.39:8080/"],
    methods : ["POST","GET","PUT","DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}))



app.use('/api', Router)

module.exports = app