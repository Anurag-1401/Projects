const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name : {type : String , require:true},
    email : {type : String , require:true},
    uid: String,
    photo: String,  
    location: {
        latitude: Number,
        longitude: Number,
        address: String, 
    },
},
    {timestamps : true}
);

module.exports = mongoose.model("User", userSchema)