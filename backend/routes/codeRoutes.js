const express = require('express');
const axios = require('axios');
const CodeProblem = require('../models/CodeProblem');
const router = express.Router();
const authenticateToken = require('../middleware/authVerify'); 
const interviewQuestionSchema = require('../models/interviewQuestionSchema');

router.post('/compile', async (req, res) => {
  try {
    const { sourceCode, languageId, stdin } = req.body; // Get data from request body

    // Check if sourceCode is present
    if (!sourceCode) {
      return res.status(400).json({ error: 'Source code is required' });
    }

    // Encode source code in Base64
    const encodedSourceCode = Buffer.from(sourceCode).toString('base64');

    // Check if stdin is provided, if not set it to null
    const encodedStdin = stdin ? Buffer.from(stdin).toString('base64') : null;

    // Prepare the data to send to Judge0 API
    const data = {
      language_id: languageId, // Dynamic language ID
      source_code: encodedSourceCode, // Base64 encoded source code
      stdin: encodedStdin, // Base64 encoded stdin input
    };

    // Send POST request to Judge0 API using Axios
    const response = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true&fields=*',
      data,
      {
        headers: {
          'x-rapidapi-key': '2ab0587d8bmsh79a66a0f983ddb5p1975cfjsn7fe00dffb1a8', // Replace with your API key
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
      }
    );

    // Send the Judge0 API response back to the client
    res.json(response.data); // Return the response from Judge0

  } catch (error) {
    console.error('Error compiling code:', error);
    res.status(500).json({ error: 'Error compiling code, please try again later' });
  }
});



router.post('/front-code', async (req, res) => {
  try {
    const {stdin, language ,script} = req.body; // Expect sourceCode and other data in the request body
    

    const dynamicStdin = stdin || script || ''; // If stdin is not provided, fall back to script content

    const encodedSourceCode = btoa(script); 
    const encodedStdin = btoa(dynamicStdin);  // Base64 encode the dynamic stdin (from script)
    
    const data = {
      language_id: language, 
      source_code: encodedSourceCode, 
      stdin: encodedStdin, 
    };


    console.log(data); 

  } catch (error) {
    console.error('Error compiling code:', error);
    res.status(500).json({ error: 'Error compiling code, please try again later' });
  }
});



router.get('/code-problem-data', async (req, res) => {
  try {
    const problemData = await CodeProblem.find({});  // Await the database query

    res.json(problemData);  // Send the data as a response

  } catch (error) {
    console.error('Error getting data:', error);
    res.status(500).json({ error: 'Error, please try again later' });
  }
});



router.post('/code-problem-by-id', async (req, res) => {
  try {

    const {id} = req.body;

    const problemData = await CodeProblem.findById({_id : id}); 
     
    res.json(problemData);  // Send the data as a response

  } catch (error) {
    console.error('Error getting data:', error);
    res.status(500).json({ error: 'Error, please try again later' });
  }
});



router.get('/interview-questions/:selectedRole', async (req, res) => {
  try {
    const { selectedRole } = req.params;

    const problemData = await interviewQuestionSchema.find({ jobRole: selectedRole });

    if (problemData.length === 0) {
      return res.status(404).json({ message: `No interview questions found for ${selectedRole}` });
    }

    res.json(problemData[0]);

  } catch (error) {
    console.error('Error getting data:', error);
    res.status(500).json({ error: 'Error, please try again later' });
  }
});








const interviewQuestion ='';

router.get('/upload', async (req, res) => {
  try {
    // Insert only the Web Developer data using insertMany
    const result = await interviewQuestionSchema.insertMany(interviewQuestion);
    res.status(200).json({ message: 'Web Developer questions uploaded successfully', result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading Web Developer questions', error: err });
  }
});



module.exports = router;











