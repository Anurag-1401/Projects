const QuizAttempted = require('../Models/attemptedQuizModel')

const addQuizAttempted = async (req, res) => {
  try {
    const { userId, quizId,title, answers, score, timeSpent } = req.body;

    const attempted = new QuizAttempted({userId,quizId,title,answers,score,timeSpent});

    await attempted.save();

    res.status(201).json({ message: "Quiz attempted saved successfully", attempted });
  } catch (error) {
    res.status(500).json({ message: "Error saving attempt", error: error.message });
  }
};


const getAttemptedQuizzes = async (req, res) => {
  const {userId} = req.query;
  try {
    const quizzes = await QuizAttempted.find({userId})

    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attempts", error: error.message });
  }
};


module.exports = {addQuizAttempted,getAttemptedQuizzes}
