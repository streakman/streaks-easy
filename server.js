const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/api/question', async (req, res) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You generate short daily sports prediction questions.' },
          { role: 'user', content: 'Give me a prediction question.' },
        ],
      }),
    });

    const data = await response.json();
    const question = data.choices?.[0]?.message?.content || 'No question generated.';
    res.json({ question });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate question' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
