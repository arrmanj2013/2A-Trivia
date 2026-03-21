const topicSelect = document.querySelector('#topic-select');
const generateButton = document.querySelector('#generate-btn');
const nextButton = document.querySelector('#next-btn');
const statusText = document.querySelector('#status-text');
const questionWrap = document.querySelector('#question-wrap');
const emptyState = document.querySelector('#empty-state');
const topicPill = document.querySelector('#topic-pill');
const questionText = document.querySelector('#question-text');
const answersContainer = document.querySelector('#answers');
const feedbackBox = document.querySelector('#feedback');

let currentQuestion = null;
let answered = false;
let aiEnabled = false;

async function init() {
  setStatus('Loading topics...');

  try {
    const response = await fetch('/api/topics');
    const data = await response.json();
    aiEnabled = data.aiEnabled;

    topicSelect.innerHTML = data.topics
      .map((topic) => `<option value="${topic}">${topic}</option>`)
      .join('');

    setStatus(
      aiEnabled
        ? 'AI is connected — generate a question whenever you are ready.'
        : 'No OPENAI_API_KEY detected, so local backup trivia will be used.'
    );
  } catch (error) {
    console.error(error);
    setStatus('Unable to load topics. Refresh the page and try again.');
  }
}

async function generateTrivia() {
  const topic = topicSelect.value;
  answered = false;
  generateButton.disabled = true;
  nextButton.classList.add('hidden');
  feedbackBox.className = 'feedback hidden';
  setStatus(`Generating a ${topic} question...`);

  try {
    const response = await fetch('/api/trivia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Unable to generate trivia right now.');
    }

    currentQuestion = data;
    renderQuestion(topic, data);

    const sourceLabel = data.source === 'ai' ? 'AI-generated' : 'Backup question';
    const noticeSuffix = data.notice ? ` ${data.notice}` : '';
    setStatus(`${sourceLabel} question ready.${noticeSuffix}`);
  } catch (error) {
    console.error(error);
    setStatus(error.message);
  } finally {
    generateButton.disabled = false;
  }
}

function renderQuestion(topic, data) {
  emptyState.classList.add('hidden');
  questionWrap.classList.remove('hidden');
  topicPill.textContent = `${topic} trivia`;
  questionText.textContent = data.question;
  answersContainer.innerHTML = '';

  data.options.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer-btn';
    button.textContent = option.text;
    button.dataset.correct = option.isCorrect;
    button.addEventListener('click', () => handleAnswer(button, option));
    answersContainer.appendChild(button);
  });
}

function handleAnswer(selectedButton, selectedOption) {
  if (answered || !currentQuestion) {
    return;
  }

  answered = true;
  const answerButtons = [...document.querySelectorAll('.answer-btn')];

  answerButtons.forEach((button) => {
    const isCorrect = button.dataset.correct === 'true';
    button.disabled = true;
    button.classList.add(isCorrect ? 'correct' : 'incorrect');
  });

  feedbackBox.classList.remove('hidden');
  nextButton.classList.remove('hidden');

  if (selectedOption.isCorrect) {
    feedbackBox.classList.add('correct');
    feedbackBox.innerHTML = `<strong>✔ Correct!</strong><br>${currentQuestion.explanation}`;
  } else {
    selectedButton.classList.add('incorrect');
    feedbackBox.classList.add('incorrect');
    feedbackBox.innerHTML = `<strong>❌ Incorrect.</strong><br>✅ Correct answer: ${currentQuestion.correctAnswer}<br>${currentQuestion.explanation}`;
  }
}

function setStatus(message) {
  statusText.textContent = message;
}

generateButton.addEventListener('click', generateTrivia);
nextButton.addEventListener('click', generateTrivia);

init();
