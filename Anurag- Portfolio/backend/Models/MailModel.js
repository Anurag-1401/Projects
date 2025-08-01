const mongoose = require('mongoose')

const formSchema = mongoose.Schema({
    name : {type: String , require:true},
    email : {type : String , require:true},
    subject : {type : String , require:true},
    message : {type: String , require : true},
    location: {type:String,require:true},
},

{timestamps : true}

);

module.exports = mongoose.model("Mails" , formSchema);