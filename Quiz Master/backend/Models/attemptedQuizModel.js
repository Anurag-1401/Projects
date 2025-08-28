const mongoose =  require('mongoose')

const quizAttemptedSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  quizId: { type: String,required: true }, 
  title: { type: String,required: true }, 
  answers: [{ type: Number, required: true }], 
  score: { type: Number, required: true },
  timeSpent: { type: Number, required: true }, 
}, { timestamps: true });

module.exports =  mongoose.model('QuizAttempted', quizAttemptedSchema);
