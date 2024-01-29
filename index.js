const express = require('express')
const OpenAI = require('openai');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const http = require("http");
const server = http.createServer(app);
const PORT = process.env.PORT;


const openai = new OpenAI({
  apiKey: process.env.Apikey
});




app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res)=>{
    res.send('Speaking')
})


app.post('/report', async (req, res)=>{
  const {transcript} = req.body

   const completion = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    prompt: `You know everything about scoring IELTS speaking. Please, provide a detailed analysis of the candidate's performance in the following  speaking transcript: ${transcript}. Assess it in terms of fluency, coherence, pronunciation, lexical resource, grammatical range and accuracy and give score out of 75. Additionally, provide CEFR level and Identify areas for improvement, and suggest ways the candidate can enhance their overall speaking proficiency. Your output must be a JSON following this structure: 
      {
        "overall_score": "float(score)/75",
        "feedback": "feedback",
        "lexical_resources": "lexical resources",
        "grammar": "grammar",
        "fluency": "fluency",
        "pronunciation": "pronunciation",
        "suggestion": "suggestion",
        "cefr_level":"cefr level"
      }
    `,
    max_tokens: 800,
    temperature: 0,
  });
  
   res.json(completion.choices[0].text)
})





server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});