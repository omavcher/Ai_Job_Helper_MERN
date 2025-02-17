const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
  input: String,
  output: String
});

const solutionSchema = new mongoose.Schema({
  code: String,
  explanation: String,
  timeComplexity: String,
  spaceComplexity: String
});

const problemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  input: {
    type: String,
    required: true
  },
  output: {
    type: String,
    required: true
  },
  example: exampleSchema,
  constraints: {
    type: String,
    required: true
  },
  solution: solutionSchema
});

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;
