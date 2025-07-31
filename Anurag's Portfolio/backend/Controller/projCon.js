const Project = require('../Models/adminProj')

const addProject = async (req,res) => {
    const {title, description , technologies, demo, github, thumbnail,featured} = req.body;

    try {

        const project = await Project.findOne({title});
        
        if (project) {
            return res.status(400).json({message:"Project already exists"});
       }
       if (typeof technologies === 'string') {
        technologies = technologies
          .split(',')
          .map(tech => tech.replace(/["'\n\r]/g, '').trim());
      }
        const newProject = new Project({title, description , technologies, demo, github, thumbnail,featured});

        await newProject.save();
        return res.status(201).json({message : "Details Updated" , data:newProject})

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" ,err:error});
    }
};


const getProjects = async (req,res) => {
    const {id} = req.query;
    let projects

    try {

        if (id) {
            projects = await Project.findById(id);
            if (!projects) {
                return res.status(404).json({ error: "Project not found" });
            }
        } else {
            projects = await Project.find();
            if (!projects || projects.length === 0) {
                res.status(404).json({ error: "No projects found" });
            }
        }
        
        res.status(200).json({ project: projects });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
        }
};

const editProject = async (req,res) => {
    const {id} = req.params;
    const {title, description , technologies, demo, github, thumbnail,featured} = req.body;

    let project;
    try {
        project = await Project.findById(id)

        if(!project){
            res.status(404).json({Message : "Projects not found"})
        } else {
            const updates = {title, description , technologies, demo, github, thumbnail,featured}
            project = await Project.findByIdAndUpdate(id,updates,{new:true});

            res.status(200).json({message:"project updated",project:project})
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }

};


const delProject = async (req,res) => {
    const {id} = req.params;

    try {
        let project = await Project.findById(id)

        if(!project){
            res.status(404).json({Message : "Projects not found"})
        } else {
            await Project.findByIdAndDelete(id);
            res.status(200).json({ message: "Project deleted successfully", project});
        }

    } catch (error) {
        
    }
}


module.exports = {addProject,getProjects, editProject , delProject}