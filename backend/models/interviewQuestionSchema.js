const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema({
  jobRole: {
    type: String,
    required: true,
    unique: true, 
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'], 
        required: true,
      },
    },
  ],
});

const InterviewQuestion = mongoose.model('InterviewQuestion', interviewQuestionSchema);

module.exports = InterviewQuestion;
