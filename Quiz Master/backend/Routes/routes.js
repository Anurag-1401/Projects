const express = require('express');

const { registerUser, loginUser, updateOneUser, getUserProfile, deleteUser} = require('../Controller/userController');

const {createQuiz,getQuiz,getQuizzes,deleteQuiz} = require('../Controller/quizController')

const {addQuizAttempted,getAttemptedQuizzes} = require('../Controller/quizAttemptCon')

const router = express.Router()

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getUserProfile);
router.put('/update/:id', updateOneUser);
router.delete('/delete/:id', deleteUser);

router.post('/create-quiz',createQuiz);
router.get('/get-quiz/:id',getQuiz);
router.get('/get-quizzes',getQuizzes);
router.delete('/del-quiz/:id',deleteQuiz)

router.post('/add-quiz',addQuizAttempted)
router.get('/get-attempted-quizzes',getAttemptedQuizzes)


module.exports = router;