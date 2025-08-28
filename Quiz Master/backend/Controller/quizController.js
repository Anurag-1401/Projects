const Quiz = require('../Models/quizQuestionsModel')

const createQuiz = async (req, res) => {
  const { title, description, timeLimit, questions ,createdBy,code} = req.body;

  try {
    const quiz = new Quiz({title,description,timeLimit,questions,createdBy,code});

    await quiz.save();
    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getQuizzes = async (req, res) => {
  const {createdBy} = req.query;
  let quizzes;
  try {
    if(createdBy) {
      quizzes = await Quiz.find({createdBy})
    } else{
      quizzes = await Quiz.find()
    }
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getQuiz = async (req, res) => {
  const { id } = req.params;
  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.status(200).json(quiz);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteQuiz = async (req, res) => {
  const { id } = req.params;
  try {
    const quiz = await Quiz.findByIdAndDelete(id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


module.exports = {createQuiz,getQuiz,getQuizzes,deleteQuiz}
