// 1. DATA: Aap bas yahan naye sawal, subject ya chapter add karte jayein
const quizDatabase = [
    {
        subject: "General Knowledge",
        chapter: "Bharat",
        question: "Bharat ki Rajdhani kya hai?",
        options: ["Mumbai", "Delhi", "Kolkata", "Lucknow"],
        correct: 1
    },
    {
        subject: "General Knowledge",
        chapter: "Bharat",
        question: "Bharat ka Rashtriya Phool kaunsa hai?",
        options: ["Gulab", "Kamal", "Surajmukhi", "Genda"],
        correct: 1
    },
    {
        subject: "Science",
        chapter: "Biology",
        question: "Insaan ke shareer mein kul kitni haddiya hoti hain?",
        options: ["201", "206", "210", "208"],
        correct: 1
    },
    {
        subject: "Computer",
        chapter: "Basics",
        question: "CPU ka full form kya hai?",
        options: ["Central Processing Unit", "Control Process Unit", "Common Print Unit", "None"],
        correct: 0
    }
];

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// Page khulte hi dropdowns set karein
window.onload = () => {
    const subSelect = document.getElementById('subject-select');
    const subjects = [...new Set(quizDatabase.map(q => q.subject))];
    subSelect.innerHTML = subjects.map(s => `<option value="${s}">${s}</option>`).join('');
    updateChapters();
};

// Jab subject badle toh chapter update karein
function updateChapters() {
    const sub = document.getElementById('subject-select').value;
    const chapSelect = document.getElementById('chapter-select');
    const chapters = [...new Set(quizDatabase.filter(q => q.subject === sub).map(q => q.chapter))];
    chapSelect.innerHTML = chapters.map(c => `<option value="${c}">${c}</option>`).join('');
}

// Quiz shuru karein
function startQuiz() {
    const selectedSub = document.getElementById('subject-select').value;
    const selectedChap = document.getElementById('chapter-select').value;

    currentQuestions = quizDatabase.filter(q => q.subject === selectedSub && q.chapter === selectedChap);
    
    document.getElementById('setup-container').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}

// Sawal dikhayein
function showQuestion() {
    const q = currentQuestions[currentQuestionIndex];
    document.getElementById('question-text').innerText = q.question;
    document.getElementById('question-number').innerText = `Q ${currentQuestionIndex + 1}/${currentQuestions.length}`;
    
    const optionsBox = document.getElementById('options-container');
    optionsBox.innerHTML = '';
    document.getElementById('next-btn').classList.add('hidden');

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'option-btn';
        btn.onclick = () => {
            const allBtns = optionsBox.querySelectorAll('button');
            if (idx === q.correct) {
                btn.classList.add('correct');
                score++;
                document.getElementById('score-live').innerText = `Score: ${score}`;
            } else {
                btn.classList.add('wrong');
                allBtns[q.correct].classList.add('correct');
            }
            allBtns.forEach(b => b.disabled = true);
            document.getElementById('next-btn').classList.remove('hidden');
        };
        optionsBox.appendChild(btn);
    });
}

// Agla sawal
function loadNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        showQuestion();
    } else {
        document.getElementById('quiz-container').classList.add('hidden');
        document.getElementById('result-container').classList.remove('hidden');
        document.getElementById('final-score').innerText = `Aapka Score: ${score} / ${currentQuestions.length}`;
    }
}
