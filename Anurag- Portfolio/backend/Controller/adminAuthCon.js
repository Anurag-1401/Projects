const AdAuth = require('../Models/adminAuth')

const addAdmin = async (req,res) => {
    const {email,password} = req.body;

    try {
        let admin = await AdAuth.findOne();
        if(admin) {
            return res.status(400).json({message:"Admin already present",Admin:admin});
        } else {
            admin = new AdAuth({email,password});
            await admin.save();

            res.status(201).json({message:"Admin added Successfully",Admin:admin});
        }
    } catch (error) {
        res.status(500).json({message:"server error",error})
    }
};

const getAdmin = async (req,res) => {
    const {email,password} = req.query;
    const {id} = req.params || {};

    try {
        if(email && password){
            let admin = await AdAuth.findOne({email})
                if(admin){
                    if(admin.password === password && admin.email=== email) {
                        return res.status(200).json({message:"Authenticated Admin",Admin:admin});
                    } else {
                        return res.status(400).json({message:"Password or Email do not match",Admin:admin});
                    }
                } else {
                    return res.status(404).json({ message: "Admin not found, please register!" });
                }

            } else if(id === '1'){
            let admin = await AdAuth.findOne();
                if(admin) {
                    return res.status(200).json({message:"Admin is registered,Please login",Admin:admin});
                } else {
                    return res.status(404).json({message:"Admin not found, Please register"})
                }
        }

    } catch (error) {
        res.status(500).json({message:"server error",error});
    }
};


const resetPass= async (req,res) => {
    const {email,Password,rePassword} = req.body;

    try {
        if(email && Password){
            let admin = await AdAuth.findOne({email})
                if(admin){
                    admin.password = rePassword;
                    await admin.save();
                    return res.status(200).json({message:"Password Updated",Admin:admin});
                } else {
                    return res.status(404).json({message:"Admin not found, Please register"})
                }
        }
    } catch (error) {
        res.status(500).json({message:"server error",error});
    }
};




module.exports = {addAdmin,getAdmin,resetPass}