// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { OpenAI } from "openai";

dotenv.config();
const app = express();
app.use(cors());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get("/question", async (req, res) => {
  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Give me one sports prediction question for today’s games. Format it as a yes/no or multiple-choice question.",
        },
      ],
    });

    res.json({ question: chat.choices[0].message.content.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).send("AI failed");
  }
});

app.use(express.static("public")); // serve frontend

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
