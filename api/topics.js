import { getTopicsResponse } from '../lib/trivia.js';

export default function handler(_req, res) {
  res.status(200).json(getTopicsResponse());
}
