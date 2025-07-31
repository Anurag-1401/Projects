const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()


const connectDB = async () => {

    try{

      const con = await mongoose.connect(process.env.MONGODB_URL)
      console.log('MongoDB Connected')

    } catch(e) {
        console.error(e.message)
    }
}

module.exports = connectDB