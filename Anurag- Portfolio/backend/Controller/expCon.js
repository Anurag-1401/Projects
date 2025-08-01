const Experience = require('../Models/adminex');


const addExperience = async (req,res) => {
    const {post,company,period,location,description,achievements,technologies} = req.body;

    try {
    
            const experience = await Experience.findOne({post,company});
            
            if (experience) {
                return res.status(400).json({message:"Experience already exists"});
           }

            const newExperience = new Experience({post,company,period,location,description,achievements,technologies});
    
            await newExperience.save();
            return res.status(201).json({message : "Experience Added" , data:newExperience})
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Server error" ,err:error});
        }
};



const getExperience = async (req,res) => {
    const {id} = req.query;

    let experience

    try {

        if (id) {
            experience = await Experience.findById(id);
            if (!experience) {
                return res.status(404).json({ error: "Experience not found" });
            }
        } else {
            experience = await Experience.find();
            if (!experience || experience.length === 0) {
                res.status(404).json({ error: "No experience found" });
            }
        }
        
        res.status(200).json({ data: experience });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
        }
};



const editExperience = async (req,res) => {
    const {id} = req.params;
    const {post,company,period,location,description,achievements,technologies} = req.body;

    let experience;
    try {
        experience = await Experience.findById(id)

        if(!experience){
            res.status(404).json({Message : "Experience not found"})
        } else {
            const updates = {post,company,period,location,description,achievements,technologies}
            experience = await Experience.findByIdAndUpdate(id,updates,{new:true});

            res.status(200).json({message:"Experience updated",data:experience})
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }

};


const delExperience = async (req,res) => {
    const {id} = req.params;

    try {
        let experience = await Experience.findById(id)

        if(!experience){
            res.status(404).json({Message : "Experience not found"})
        } else {
            await Experience.findByIdAndDelete(id);
            res.status(200).json({ message: "Experience deleted successfully", experience});
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = {addExperience,getExperience,editExperience,delExperience}