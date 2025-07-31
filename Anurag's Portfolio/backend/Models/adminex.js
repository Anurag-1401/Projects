const mongoose = require('mongoose')


const ExperienceSchema = mongoose.Schema({
    post : {type : String, require:true},
    company : {type:String , require:true},
    period: [{type:String , require:true}],
    location : {type:String , require :true},
    description : {type:String ,require:true},
    achievements : [{type:String , require:true}],
    technologies : [{type : String , require:true}]
},
    {timestamps :  true}
);

module.exports = mongoose.model("Experience" , ExperienceSchema);