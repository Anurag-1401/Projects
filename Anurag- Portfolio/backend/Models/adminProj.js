const mongoose = require('mongoose')

const ProjectsSchema = mongoose.Schema({
    title : {type : String , require:true},
    description : {type : String , require:true},
    technologies : [{type : String , require:true}],
    demo : {type : String , require:true},
    github : {type : String , require :true},
    thumbnail : {type : String , require :true},
    featured : {type : Boolean , default:false}
},
    {timestamps : true}
);

module.exports = mongoose.model("Project" , ProjectsSchema);