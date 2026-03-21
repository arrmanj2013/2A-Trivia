export const topics = ['Space', 'Animals', 'Technology', 'Music', 'Movies', 'History'];

const fallbackQuestions = {
  Space: [
    { question: 'Which planet is known as the Red Planet?', correctAnswer: 'Mars', incorrectAnswers: ['Earth', 'Jupiter', 'Venus'], explanation: 'Mars appears red because its surface contains iron oxide, often called rust.' },
    { question: 'What is the name of the galaxy that contains our Solar System?', correctAnswer: 'The Milky Way', incorrectAnswers: ['Andromeda', 'Whirlpool Galaxy', 'Sombrero Galaxy'], explanation: 'Earth and the rest of our Solar System are part of the Milky Way galaxy.' }
  ],
  Animals: [
    { question: 'What is the largest mammal on Earth?', correctAnswer: 'Blue whale', incorrectAnswers: ['African elephant', 'Giraffe', 'Hippopotamus'], explanation: 'The blue whale is the largest known animal to have ever lived.' },
    { question: 'Which animal is known for changing color to blend into its surroundings?', correctAnswer: 'Chameleon', incorrectAnswers: ['Dolphin', 'Kangaroo', 'Penguin'], explanation: 'Chameleons can change color for camouflage, signaling, and temperature regulation.' }
  ],
  Technology: [
    { question: 'What does CPU stand for?', correctAnswer: 'Central Processing Unit', incorrectAnswers: ['Computer Power Utility', 'Central Program Upload', 'Control Processing User'], explanation: 'The CPU is the primary component that executes instructions in a computer.' },
    { question: 'Which company created the JavaScript programming language?', correctAnswer: 'Netscape', incorrectAnswers: ['Microsoft', 'Apple', 'IBM'], explanation: 'JavaScript was created at Netscape by Brendan Eich in 1995.' }
  ],
  Music: [
    { question: 'How many lines are there in a standard musical staff?', correctAnswer: 'Five', incorrectAnswers: ['Three', 'Four', 'Six'], explanation: 'A standard music staff is made up of five horizontal lines.' },
    { question: 'Which instrument has 88 keys on a standard version?', correctAnswer: 'Piano', incorrectAnswers: ['Violin', 'Trumpet', 'Flute'], explanation: 'A standard piano keyboard has 88 keys.' }
  ],
  Movies: [
    { question: 'Who directed the movie Jurassic Park?', correctAnswer: 'Steven Spielberg', incorrectAnswers: ['James Cameron', 'Christopher Nolan', 'Tim Burton'], explanation: 'Steven Spielberg directed Jurassic Park, which was released in 1993.' },
    { question: 'Which movie features the quote, “May the Force be with you”?', correctAnswer: 'Star Wars', incorrectAnswers: ['The Matrix', 'Avatar', 'Back to the Future'], explanation: 'The famous line comes from the Star Wars franchise.' }
  ],
  History: [
    { question: 'Which ancient civilization built the pyramids of Giza?', correctAnswer: 'Ancient Egyptians', incorrectAnswers: ['Ancient Greeks', 'Romans', 'Mayans'], explanation: 'The pyramids of Giza were built by the ancient Egyptians.' },
    { question: 'Who was the first President of the United States?', correctAnswer: 'George Washington', incorrectAnswers: ['Thomas Jefferson', 'John Adams', 'Abraham Lincoln'], explanation: 'George Washington served as the first U.S. president from 1789 to 1797.' }
  ]
};

export async function getTriviaQuestion(topic) {
  if (!topics.includes(topic)) {
    throw new Error('Please select a valid trivia topic.');
  }

  try {
    const trivia = process.env.OPENAI_API_KEY ? await generateTriviaWithAI(topic) : generateFallbackTrivia(topic);
    return { ...trivia, source: process.env.OPENAI_API_KEY ? 'ai' : 'fallback' };
  } catch (error) {
    console.error('Trivia generation failed:', error);
    return {
      ...generateFallbackTrivia(topic),
      source: 'fallback',
      notice: 'OpenAI generation failed, so a local backup question was used.'
    };
  }
}

export function getTopicsResponse() {
  return { topics, aiEnabled: Boolean(process.env.OPENAI_API_KEY) };
}

async function generateTriviaWithAI(topic) {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content: [
            {
              type: 'input_text',
              text: 'You create engaging trivia for a browser game. Return exactly one beginner-friendly multiple choice question. Keep facts broadly accepted, avoid trick questions, and make the distractors plausible but clearly wrong.'
            }
          ]
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: `Generate one trivia question about ${topic}. Return JSON with: question, correctAnswer, incorrectAnswers (exactly 3), explanation. Keep each answer short.`
            }
          ]
        }
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'trivia_question',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            required: ['question', 'correctAnswer', 'incorrectAnswers', 'explanation'],
            properties: {
              question: { type: 'string' },
              correctAnswer: { type: 'string' },
              incorrectAnswers: {
                type: 'array',
                items: { type: 'string' },
                minItems: 3,
                maxItems: 3
              },
              explanation: { type: 'string' }
            }
          }
        }
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  if (!data.output_text) {
    throw new Error('No structured trivia content was returned from OpenAI.');
  }

  return normalizeTrivia(JSON.parse(data.output_text));
}

function generateFallbackTrivia(topic) {
  const entries = fallbackQuestions[topic];
  return normalizeTrivia(entries[Math.floor(Math.random() * entries.length)]);
}

function normalizeTrivia(trivia) {
  return {
    question: trivia.question,
    explanation: trivia.explanation,
    correctAnswer: trivia.correctAnswer,
    options: shuffle([
      { text: trivia.correctAnswer, isCorrect: true },
      ...trivia.incorrectAnswers.map((answer) => ({ text: answer, isCorrect: false }))
    ])
  };
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}
