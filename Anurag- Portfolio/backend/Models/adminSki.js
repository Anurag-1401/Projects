const mongoose = require('mongoose')


const SkillsSchema = mongoose.Schema({
    category : {type: String , require : true},
    skills : [{type : String}]
},
    {timestamps:true}
);

module.exports = mongoose.model("Skill" , SkillsSchema)