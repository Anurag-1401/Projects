const express = require('express');
const { registerUser, loginUser, updateOneUser, getUserProfile, deleteUser , addPayment } = require('../controllers/newControllers');
const { addWorker, getWorker, deleteWorker, rateWorker } = require('../controllers/workerController');
const {sendOtp , verifyOtp} = require('../controllers/otpController');
const {createOrder} = require('../controllers/paymentController')

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/:id', getUserProfile);
router.put('/update/:id', updateOneUser);
router.delete('/delete/:id', deleteUser);
router.post('/add-payment', addPayment);

const workerCategories = ['plumber', 'painter', 'carpenter', 'cleaner', 'electrician', 'mason'];

workerCategories.forEach(category => {
  router.post(`/add${category}`, addWorker);
  router.get(`/get${category}/:adminId`, getWorker);
  router.delete(`/delete${category}/:id`, deleteWorker);
  router.post(`/rate${category}/:workerId`, rateWorker);
});

router.post('/send-otp' , sendOtp);
router.post('/verify-otp' , verifyOtp);

router.post('/create-order' , createOrder);

module.exports = router;
