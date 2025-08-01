const mongoose = require('mongoose');
const { link } = require('../Routes/routes');

const adminSchema = mongoose.Schema({
    name : {type : String , require:true},
    email : {type : String , require:true},
    contact : {type : Number , require:true},
    location : {type : String , require:true},
    profession : {type : String, require:true},
    description : {type : String , require:true},
    journey:{type : String , require:true},
    about : {type : String , require:true},
    facts:[{type:String,require:true}],
    features:[{title:String,value:String,icon:String}],
    github : {type:String , require:true},
    linkedin : {type:String , require:true},
    insta : {type:String , require:true}
},
    {timestamps : true} 
);


module.exports = mongoose.model("Admin" , adminSchema)