const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); 

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.get('/ask', async (req, res) => {
  try {
    const prompt = "give me the c langee dsa question with ans";

    // Generate AI response
    const result = await model.generateContent(prompt);

    // Extract the AI response safely
    const aiResponse = result.response?.candidates?.[0]?.content || "No response received.";

    // Send response to client
    res.json({ answer: aiResponse });

  } catch (error) {
    console.error("Error generating AI response:", error);
    res.status(500).json({ message: "Error generating AI response", error: error.message });
  }
});




router.post('/analyze-resume', async (req, res) => {
  try {
    const { resumeText } = req.body;
    const jobfield = "Web Developer"; // You can make this dynamic if needed

    const prompt = `Here I provide you with my resume data. Analyze this and give me the ATS score for the job field: ${jobfield}. Respond only with ATS_score= and recommendation=.
    | resume data-> ${resumeText}`;

    const result = await model.generateContent(prompt);

    if (result && result.response && result.response.candidates && result.response.candidates[0]) {
      const candidateContent = result.response.candidates[0].content;
      const aiResponseText = candidateContent?.parts?.[0]?.text || "No response received.";

      // Extract ATS score and recommendation from the AI response text
      const atsScore = aiResponseText.match(/ATS_score=([\d\.]+)/)?.[1] || "N/A"; // Extract ATS score
      const recommendation = aiResponseText.match(/recommendation=([\s\S]+)/)?.[1] || "No recommendation available."; // Extract recommendation


      res.json({
        atsScore,
        recommendation
      });
    } else {
      console.error("Error: Invalid response format or missing candidate content");
      res.status(500).json({ message: "Error: Missing candidate content in response" });
    }

  } catch (error) {
    console.error("Error generating AI response:", error);
    res.status(500).json({ message: "Error analyzing resume", error: error.message });
  }
});




router.post('/ask-ai', async (req, res) => {
  try {
    const { message } = req.body;

    const prompt = `Act as my career guide and provide concise, paragraph-style responses as if we are having a friendly chat. Keep the answers short, clear, and to the point. My message: ${message}`;

    const result = await model.generateContent(prompt);

    const aiResponse = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

    console.log(aiResponse);

    res.json({
      response: aiResponse
    });

  } catch (error) {
    console.error("Error generating AI response:", error);
    res.status(500).json({ message: "Error generating response", error: error.message });
  }
});



router.post('/get-roadmap', async (req, res) => {
  try {
    const { jobRole, date } = req.body;

    const prompt = `You are a career roadmap generator. Given the job role '${jobRole}' and the date '${date}', provide the following roadmap:
    
    1. A beginner, intermediate, and advanced phase for the job role.
    2. For each phase, list:
        - The skills required
        - Example projects to work on
        - Recommended resources (if available)
        - An estimated time to complete each phase (e.g., 1 month, 6 months, etc.)
    
    Ensure that each phase has clear, actionable steps. Format the roadmap in a JSON structure as follows:
    
    {
      "beginner": {
        "skills": ["skill1", "skill2"],
        "projects": ["project1", "project2"],
        "resources": ["resource1", "resource2"],
        "estimatedTime": "1 month"
      },
      "intermediate": {
        "skills": ["skill1", "skill2"],
        "projects": ["project1", "project2"],
        "resources": ["resource1", "resource2"],
        "estimatedTime": "3 months"
      },
      "advanced": {
        "skills": ["skill1", "skill2"],
        "projects": ["project1", "project2"],
        "resources": ["resource1", "resource2"],
        "estimatedTime": "6 months"
      }
    }
    
    Provide only the roadmap in the JSON format.`;

    const result = await model.generateContent(prompt);

    const aiResponse = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

    console.log(aiResponse);

    res.json({
      response: aiResponse
    });

  } catch (error) {
    console.error("Error generating AI response:", error);
    res.status(500).json({ message: "Error generating response", error: error.message });
  }
});





router.post('/compile', async (req, res) => {
  try {
    const { language, script } = req.body;

    const prompt = `You are a coding assistant. You need to analyze and run the following code written in ${language}. Here is the code:\n\n${script}\n\nPlease execute and provide the output of the code nothing other text just output only.`;

    const result = await model.generateContent(prompt);

    const aiResponse = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

    function getCodeOutput(aiResponse) {
      // Remove the triple backticks and return the content
      const output = aiResponse.replace(/```/g, '').trim();
      return output;
    }

    // Clean the response before sending it
    const cleanedOutput = getCodeOutput(aiResponse);

    res.json({
      output: cleanedOutput
    });

  } catch (error) {
    console.error('Error compiling code:', error);
    res.status(500).json({ error: 'Error compiling code, please try again later' });
  }
});



router.post('/submit-problem', async (req, res) => {
  try {
    const { language, script, description, input, output } = req.body;

    // Construct a dynamic prompt for the code execution system
    const prompt = `
    I have a coding challenge in ${language}. The problem is described as follows:
    Problem: ${description}

    Here is the input for the code:
    Input: ${input}

    Expected Output: ${output}

    Code:
    ${script}

    Please check if the provided code produces the correct output for the given input. If the code is correct, return the result as "successful", otherwise return "fail". Provide the output produced by the code and a brief conclusion (one line) summarizing whether the code passed or failed.
    `;

    const result = await model.generateContent(prompt);

    const aiResponse = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
    function getCodeOutput(aiResponse) {
      // Remove the triple backticks and return the content
      const output = aiResponse.replace(/```/g, '').trim();
      return output;
    }
    // Use getCodeOutput to clean the AI response
    const cleanedOutput = getCodeOutput(aiResponse);

    const resultData = {
      result: cleanedOutput.includes("successful") ? "successful" : "fail",
      output: cleanedOutput,
      conclusion: cleanedOutput.includes("successful") ? "The code works as expected." : "The code did not produce the expected output."
    };
console.log(resultData);

    res.json(resultData);

  } catch (error) {
    console.error('Error compiling code:', error);
    res.status(500).json({ error: 'Error compiling code, please try again later' });
  }
});




router.post('/interview-ai-res', async (req, res) => {
  try {
    const { question, answer, storedJobType } = req.body;

    const prompt = `
      This is an interview for a ${storedJobType} position. The interviewer asked me the following question: 
      "${question}"
      For practice, I wrote this answer: 
      "${answer}"
    
      Please provide feedback in the following format dont change just give variable == :
      
        result: "right" or "wrong", 
        area_to_improve: "Mention the areas where the answer could be improved", 
        advise: "Provide suggestions for improvement"
    `;

    const result = await model.generateContent(prompt);
  
    // Extract the response from the result
    const aiResponse = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
    
    console.log("Raw AI Response:", aiResponse); // Log raw response for debugging

    // Clean up the output to remove unwanted 'json' prefix
    const cleanedOutput = aiResponse.replace(/^json\s*/i, '').trim();
    console.log("Cleaned Output:", cleanedOutput);

    // Since the cleanedOutput is a plain string and looks like an object structure, we can directly return it
    // Split the cleanedOutput into different sections
    const resultObj = {
      result: cleanedOutput.includes("result:") ? cleanedOutput.split("result:")[1].split(",")[0].trim().replace(/"/g, '') : "unknown",
      area_to_improve: cleanedOutput.includes("area_to_improve:") ? cleanedOutput.split("area_to_improve:")[1].split(",")[0].trim().replace(/"/g, '') : "No details available",
      advise: cleanedOutput.includes("advise:") ? cleanedOutput.split("advise:")[1].trim().replace(/"/g, '') : "No advice provided"
    };
    
    console.log("Formatted Response:", resultObj);

    // Return formatted response as JSON
    res.status(200).json(resultObj);

  } catch (err) {
    console.error("Error processing AI response:", err);
    res.status(500).json({ message: 'Error generating response', error: err });
  }
});






router.post('/resume-data-get', async (req, res) => {
  try {
    const { position, company, city, state } = req.body;

    const prompt = `As a professional resume writer, create a detailed experience section for a ${position} position at ${company} in ${city}, ${state}. Provide the response in the following JSON format:

    {
      "experience": "Provide detailed technical experience and responsibilities relevant to ${position} role (2-3 sentences)",
      "bulletPoints": [
        "First achievement or responsibility with measurable impact",
        "Second technical implementation or project highlight",
        "Third team collaboration or process improvement point",
        "Fourth significant contribution or skill demonstration"
      ]
    }

    Ensure all bullet points:
    - Start with strong action verbs
    - Include specific technologies and metrics where applicable
    - Demonstrate impact and results
    - Are relevant to the ${position} role
    
    Return only the JSON object, no additional text.`;

    const result = await model.generateContent(prompt);
    const aiResponse = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
    
    // Clean the response by removing markdown formatting
    const cleanedResponse = aiResponse.replace(/```json\s*|\s*```/g, '').trim();
    
    // Parse the cleaned JSON response
    const resumeData = JSON.parse(cleanedResponse);

    res.status(200).json(resumeData);

  } catch (err) {
    console.error("Error processing AI response:", err);
    res.status(500).json({ message: 'Error generating response', error: err.message });
  }
});




module.exports = router;
