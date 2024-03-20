const { OpenAI } = require("openai");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();
const cors = require("cors");
app.use(express.json());
app.use(cors());
require("dotenv").config();
const port = process.env.PORT || 8000;
app.use("/", router);

const openai = new OpenAI({
  organization: "org-waI2WDF6l3fVqNOGkv1aYF4i",
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/getAnswer", async (req, res) => {
  try {
    const chatmessage = req.body.chatmessage;
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: `${chatmessage}`,
      max_tokens: 100,
      temperature: 0.5,
    });
    res.status(201).json({
      data: completion.choices[0].text,
    });
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error("Rate limit exceeded. Please try again later.");
    } else {
      console.error("An error occurred:", error);
    }
  }
});

app.listen(port, () => {
  console.log(`App is listening on ${port}`);
});
