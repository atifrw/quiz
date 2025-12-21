// Mock Data (Isko aap API se bhi connect kar sakte hain)
const quizData = [
    {
        subject: "Science",
        chapter: "Physics",
        question: "Light ki speed vacuum mein kitni hoti hai?",
        options: ["3 x 10^8 m/s", "2 x 10^8 m/s", "3 x 10^10 m/s", "Infinite"],
        correct: 0
    },
    {
        subject: "Science",
        chapter: "Biology",
        question: "Insaan ke shareer ki sabse badi haddi kaunsi hai?",
        options: ["Stapes", "Femur", "Tibia", "Skull"],
        correct: 1
    }
];

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;

const setupContainer = document.getElementById('setup-container');
const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');

function startQuiz() {
    const selectedSub = document.getElementById('subject-select').value;
    const selectedChap = document.getElementById('chapter-select').value;

    // Filter questions based on selection
    currentQuestions = quizData.filter(q => q.subject === selectedSub || q.chapter === selectedChap);
    
    if (currentQuestions.length === 0) {
        alert("Is category mein abhi sawal nahi hain!");
        return;
    }

    setupContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    const q = currentQuestions[currentQuestionIndex];
    questionText.innerText = q.question;
    optionsContainer.innerHTML = '';
    nextBtn.classList.add('hidden');
    
    // Update Progress
    document.getElementById('question-number').innerText = `Q ${currentQuestionIndex + 1}/${currentQuestions.length}`;
    document.getElementById('progress-bar').style.width = `${((currentQuestionIndex) / currentQuestions.length) * 100}%`;

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.classList.add('btn', 'option-btn');
        btn.onclick = () => checkAnswer(btn, index);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selectedBtn, index) {
    const correctIdx = currentQuestions[currentQuestionIndex].correct;
    const allBtns = optionsContainer.querySelectorAll('button');

    if (index === correctIdx) {
        selectedBtn.classList.add('correct');
        score++;
    } else {
        selectedBtn.classList.add('wrong');
        allBtns[correctIdx].classList.add('correct'); // Sahi jawab dikhao
    }

    // Disable all buttons after click
    allBtns.forEach(btn => btn.disabled = true);
    nextBtn.classList.remove('hidden');
}

function loadNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    quizContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    document.getElementById('final-score').innerText = `Aapka Total Score: ${score} / ${currentQuestions.length}`;
}

