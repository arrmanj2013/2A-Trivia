import { getTriviaQuestion } from '../lib/trivia.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const topic = req.body?.topic;

  try {
    const trivia = await getTriviaQuestion(topic);
    return res.status(200).json(trivia);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
