const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const Worker = require('../models/workerModel');
const Payment = require('../models/paymentsModel');

const registerUser = async (req, res) => {
  const { name, mobileNumber, email, role, category, password ,location } = req.body;

  try {
    const userExists = await User.findOne({ email });
    const adminExists = await Admin.findOne({ email });

    if (role === "user" && userExists ) {
      return res.status(400).json({ message: 'User already exists' });
    }else if (role === "admin" && adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    let newUser;

    if (role === "admin") {
      if (!category || category.length === 0) {
        return res.status(400).json({ message: "Admin must have at least one category" });
      }

      newUser = new Admin({ name, mobileNumber, email, role, category, password,location });
    } else {
      newUser = new User({ name, mobileNumber, email, role, password,location });
    }

    await newUser.save();

    res.status(201).json({ message: `${role} registered successfully`, user: newUser });
  } catch (err) {
    console.log(err,req.body);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { name, password ,location} = req.body;

  try {
    let user = await Admin.findOne({ name });

    let role = "admin"; 

    if (!user) {
      user = await User.findOne({ name });
      role = "user"; 
    }
    if (!user ) {
      return res.status(400).json({ message: "User Not Found" });
    }else if (user.password !== password) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    if (location && location.latitude && location.longitude) {
      user.location = location;
      await user.save();
    }
     
    res.status(200).json({ 
    message: role === "admin" ? 'Admin logged in successfully' : 'User logged in successfully',
    user: { id: user._id, name: user.name, email: user.email, role: user.role, categories: user.category ,mobileNumber:user.mobileNumber,
      password:user.password, location:user.location , payments:user.payments
    }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateOneUser = async (req, res) => {
  const { id } = req.params;
  const { name, mobileNumber, email, role, category, password } = req.body;

  try {
    let user = await User.findById(id);
    let admin = await Admin.findById(id);

    if (!user && !admin) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updates = { name, mobileNumber, email, role, category, password };
    if(password){
      updates.password=password;
    }

    if (user) {
      user = await User.findByIdAndUpdate(id, updates, { new: true });
      return res.status(200).json({ message: 'User updated successfully', user });
     
    }

    if (admin) {
      admin = await Admin.findByIdAndUpdate(id, updates, { new: true });
      return res.status(200).json({ message: 'Admin updated successfully', admin });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
};

const getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    let user = await User.findById(id);
    let admin = await Admin.findById(id);

    if (!user && !admin) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user: user || admin });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    let user = await User.findById(id);
    let admin = await Admin.findById(id);

    if (!user && !admin) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user) await User.findByIdAndDelete(id);
    if (admin) await Admin.findByIdAndDelete(id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};

const addPayment = async (req, res) => {
  try {
      const {  adminId ,username, userContact, payment_id, order_id, signature, amount, workerId, method } = req.body;

      const admin = await Admin.findById(adminId);
      if (!admin) return res.status(404).json({ message: "Admin not found" });

      const worker = await Worker.findById(workerId);
      if (!worker) return res.status(404).json({ message: "Worker not found" });

      admin.payments.push({
        workername: worker.workername,
        client : username,
        contact : userContact,
        amount,
        method,
        paymentId: payment_id,
        orderId: order_id,
        signature,
        date: new Date(),
        workerId : workerId,
      });

      let newPayment;

      newPayment = new Payment({
        adminId,
        admin_name : admin.name,
        workerId,
        worker_name : worker.workername,
        client : username,
        contact : userContact,
        amount,
        method,
        paymentId: payment_id,
        orderId: order_id,
        signature,
        date: new Date(),
      })

      await admin.save();
      await newPayment.save();

      res.status(200).json({ message: "Payment added successfully", 
        payment: admin.payments[admin.payments.length -1] , nPayment:newPayment
      });
      
  } catch (error) {
      res.status(500).json({ message: "Server error", error:error.message });
  }
};

module.exports = { registerUser, loginUser, updateOneUser, getUserProfile, deleteUser , addPayment};
