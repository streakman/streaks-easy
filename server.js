import express from 'express';
import { Configuration, OpenAIApi } from 'openai';

const app = express();
const port = process.env.PORT || 3000;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(express.json());

// Simple CORS headers if your frontend is separate
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/question', async (req, res) => {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Generate one sports trivia question.' }
      ],
      max_tokens: 100,
    });

    const question = response.data.choices[0].message?.content.trim();
    if (!question) throw new Error('No question returned');

    res.json({ question });
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ error: 'AI failed to generate question' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
