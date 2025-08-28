const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true },
  explanation: { type: String }
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  timeLimit: { type: Number },
  questions: { type: [questionSchema], required: true },
  createdBy: { type: String, required: true },
  code: { type: String, required: true, unique: true }, 
},
{ timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
