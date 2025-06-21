import express from 'express';
import { Configuration, OpenAIApi } from 'openai';

const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.post('/question', async (req, res) => {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates one sports trivia question.'
        },
      ],
      max_tokens: 100,
    });

    const question = response.data.choices[0].message?.content.trim();

    if (!question) {
      throw new Error('No question returned from OpenAI');
    }

    res.json({ question });
  } catch (error) {
    console.error('OpenAI API error:', error);

    res.status(500).json({ error: 'AI failed to generate question' });
  }
});

export default router;
