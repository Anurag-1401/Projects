const Skills = require('../Models/adminSki')

const addSkills = async (req,res) => {
    const {category,skills} = req.body;

     try {
    
        const isCategory = await Skills.findOne({category});
        
        if (isCategory) {
            return res.status(400).json({message:"Skill Category already exists"});
       }
       
        const newSkills = new Skills({category,skills});

        await newSkills.save();
        return res.status(201).json({message : "Details Updated" , data:newSkills})

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" ,err:error});
    }
    
};

const getSkills = async (req,res) => {

    try {
    let skills = await Skills.find();

        if (!skills || skills.length === 0) {
            res.status(404).json({ error: "No skills found" });
        }

    res.status(200).json({ Skills: skills });
    
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const editSkills = async (req,res) => {
    const {category,skills} = req.body;

    try {
        const updates = {skills}
        let skill = await Skills.findOneAndUpdate({category},updates,{new:true});
        if(!skill){
            res.status(404).json({Message : "Skills not found"})
        } else {
            res.status(200).json({message:"skills updated",Skills:skill})
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }

};


const deleteSkills = async (req,res) => {
    const {category} = req.body;

    try {
        let cat = await Skills.findOneAndDelete({category});
        if(!cat) {
            return res.status(404).json({message:"Skill not found"});
        } else {
            res.status(200).json({message:"Skill Deleted!",Ski:cat})
        }
    } catch (error) {
        res.status(500).json({message:"Server Error",error})
    }
};


module.exports = {addSkills,getSkills,editSkills, deleteSkills}