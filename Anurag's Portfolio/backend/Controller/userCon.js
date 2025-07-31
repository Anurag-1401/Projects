const User = require('../Models/userModel')

const newUser = async (req,res) => {

    const {name , email ,uid,photo} = req.body;

    try{
        const newUser = new User({name , email ,uid,photo});
        await newUser.save();

        res.status(201).json({message:'user created successfully' , User:newUser})

    } catch (err) {
        console.log(err,req.body);
        res.status(500).json({ message: 'Server error', error: err.message });
      }
};

const getUser = async (req,res) => {

    try {
        let visitors = await User.find();
        if (visitors && visitors.length > 0) {
            return res.status(200).json({
              message: "Here are the visitors",
              Visitors: visitors
            })
        } else {
                return res.status(404).json({message:"No visitors found",Visitors:visitors})
            }
    } catch (error) {
        console.log(error,req.body);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {newUser,getUser}