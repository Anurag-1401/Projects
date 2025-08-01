const Admin = require('../Models/adminModel');


const admin = async (req , res)=> {
    const {name , email , contact , profession, description , location , github,
        linkedin ,  insta ,features,facts,about,journey
    } = req.body;

    try {
        const admin = await Admin.findOne();

        if (admin) {
            admin.name = name;
            admin.email = email;
            admin.contact = contact;
            admin.profession = profession;
            admin.description = description;
            admin.about = about;
            admin.features = features;
            admin.facts = facts;
            admin.journey = journey;
            admin.location = location;
            admin.github = github;
            admin.linkedin = linkedin;
            admin.insta = insta;

            await admin.save();
            return res.status(201).json({message : "Details Updated" , data:admin})
        }

        const newAdmin = new Admin({name , email , contact , profession, description , location,
            github , linkedin , insta, features, facts, about, journey
        })

        await newAdmin.save();
        res.status(201).json({message : "Details Updated" , data:newAdmin})

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" ,err:error});
    }
}

const getAdminDetails = async (req,res) => {
    try {
        let admin = await Admin.findOne()

        if(admin){
            res.status(200).json({Admin:admin})
        } else {
            res.status(404).json({Message : "Admin not found"})
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


module.exports = { admin, getAdminDetails } 