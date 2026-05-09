let quizzesData = [];
let currentGame = null;

document.addEventListener('DOMContentLoaded', async () => {
    await fetchQuizzes();
});

async function fetchQuizzes() {
    try {
        const resp = await fetch('../data/quizzes.json');
        quizzesData = await resp.json();
        renderQuizMenu();
    } catch (e) {
        console.error("Failed to load quizzes", e);
    }
}

function renderQuizMenu() {
    const list = document.getElementById('quiz-list');
    list.innerHTML = quizzesData.map(q => `
        <div class="card" style="text-align:center; padding: 32px; cursor:pointer;" onclick="startQuiz('${q.id}')">
            <span class="material-symbols-rounded" style="font-size: 3rem; color: var(--accent-color); margin-bottom: 16px;">library_books</span>
            <h3 class="serif-font">${q.title}</h3>
            <p class="text-muted" style="font-size: 0.9rem; margin-top: 8px;">${q.questions.length} Questions • Subject: ${q.subject}</p>
            <button class="btn btn-primary" style="margin-top: 20px; width: 100%;">Start Test</button>
        </div>
    `).join('');
}

function startQuiz(quizId) {
    const quiz = quizzesData.find(q => q.id === quizId);
    if (!quiz) return;

    currentGame = {
        quiz,
        currentIdx: 0,
        score: 0,
        answered: false
    };

    document.getElementById('quiz-menu').style.display = 'none';
    document.getElementById('quiz-play').style.display = 'block';

    renderQuestion();
}

window.startQuiz = startQuiz;

function renderQuestion() {
    const q = currentGame.quiz.questions[currentGame.currentIdx];
    currentGame.answered = false;

    document.getElementById('quiz-progress').innerText = `Question ${currentGame.currentIdx + 1} of ${currentGame.quiz.questions.length}`;
    document.getElementById('q-text').innerText = q.text;
    document.getElementById('q-explanation').style.display = 'none';

    const optionsBox = document.getElementById('options-box');
    optionsBox.innerHTML = q.options.map((opt, i) => `
        <button class="option-btn" onclick="checkAnswer(${i})">${opt}</button>
    `).join('');
}

function checkAnswer(idx) {
    if (currentGame.answered) return;
    currentGame.answered = true;

    const q = currentGame.quiz.questions[currentGame.currentIdx];
    const buttons = document.querySelectorAll('.option-btn');

    if (idx === q.answer) {
        buttons[idx].classList.add('correct');
        currentGame.score++;
    } else {
        buttons[idx].classList.add('wrong');
        buttons[q.answer].classList.add('correct');
    }

    // Show Explanation
    document.getElementById('exp-text').innerText = q.explanation;
    document.getElementById('q-explanation').style.display = 'block';

    // Handle Next Button
    const nextBtn = document.getElementById('next-btn');
    if (currentGame.currentIdx + 1 < currentGame.quiz.questions.length) {
        nextBtn.innerText = "Next Question";
        nextBtn.onclick = () => {
            currentGame.currentIdx++;
            renderQuestion();
        };
    } else {
        nextBtn.innerText = "Finish Quiz";
        nextBtn.onclick = showResults;
    }
}

window.checkAnswer = checkAnswer;

function showResults() {
    document.getElementById('quiz-play').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';
    document.getElementById('final-score').innerText = `${currentGame.score} / ${currentGame.quiz.questions.length}`;
}
