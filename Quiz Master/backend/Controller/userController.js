const argon2 = require('argon2'); 
const UserCreate = require("../Models/userCreateModel");
const UserLogin = require("../Models/userLoginModel");

const registerUser = async (req, res) => {
  const { name,email,password} = req.body;

  try {
    const userExists = await UserCreate.findOne({ email });

    if (userExists ) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let newUser;

    newUser = new UserCreate({ name,email,password:await argon2.hash(password)});
    

    await newUser.save();

    res.status(201).json({ message: `registered successfully`, user: newUser });
  } catch (err) {
    console.log(err,req.body);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



const loginUser = async (req, res) => {
  const {email, password} = req.body;

  try {
    let user = await UserCreate.findOne({ email });

    if (!user ) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    
    await new UserLogin({name:user.name,email:user.email}).save();
     
    res.status(200).json({ 
    message:'User logged in successfully',user:user});
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const updateOneUser = async (req, res) => {
  const { id } = req.params;
  const { name,email,password } = req.body;

  try {
    let user = await UserCreate.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password=await argon2.hash(password);
    updates.name=name;
    updates.email=email;

    await user.save()
    
    return res.status(200).json({ message: 'User updated successfully', user });
     

  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
};


const getUserProfile = async (req, res) => {
  const { email} = req.query;

  try {
    let user = await UserCreate.findOne({email});

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user: user});
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    let user = await UserCreate.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await UserCreate.findByIdAndDelete(id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};

module.exports = { registerUser, loginUser, updateOneUser, getUserProfile, deleteUser};