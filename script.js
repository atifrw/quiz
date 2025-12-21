// Database: Aap yahan jitne chahe Subject aur Chapter add karein
const quizData = [
    {
        "subject": "General Knowledge",
        "chapter": "Bharat",
        "question": "Bharat ki Rajdhani kya hai?",
        "options": ["Mumbai", "Delhi", "Kolkata", "Chennai"],
        "correct": 1
    },
    {
        "subject": "General Knowledge",
        "chapter": "Bharat",
        "question": "Bharat ka Rashtriya Pakshi kaun hai?",
        "options": ["Tota", "Kabutar", "Mor", "Baaz"],
        "correct": 2
    },
    {
        "subject": "Science",
        "chapter": "Physics",
        "question": "Bulb ka aavishkar kisne kiya tha?",
        "options": ["Newton", "Einstein", "Edison", "Tesla"],
        "correct": 2
    },
    {
        "subject": "Computer",
        "chapter": "Basics",
        "question": "Full form of RAM?",
        "options": ["Read Access Memory", "Random Access Memory", "Run Any Memory", "None"],
        "correct": 1
    }
];

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// Page load hote hi dropdowns bharo
window.onload = function() {
    populateSubjects();
};

function populateSubjects() {
    const subSelect = document.getElementById('subject-select');
    const subjects = [...new Set(quizData.map(item => item.subject))];
    
    subSelect.innerHTML = subjects.map(s => `<option value="${s}">${s}</option>`).join('');
    updateChapters(); // Pehla subject select hote hi chapter load karein
}

function updateChapters() {
    const sub = document.getElementById('subject-select').value;
    const chapSelect = document.getElementById('chapter-select');
    const chapters = [...new Set(quizData.filter(q => q.subject === sub).map(q => q.chapter))];
    
    chapSelect.innerHTML = chapters.map(c => `<option value="${c}">${c}</option>`).join('');
}

function startQuiz() {
    const selectedSub = document.getElementById('subject-select').value;
    const selectedChap = document.getElementById('chapter-select').value;

    currentQuestions = quizData.filter(q => q.subject === selectedSub && q.chapter === selectedChap);
    
    if (currentQuestions.length === 0) {
        alert("Sawal nahi mile!");
        return;
    }

    document.getElementById('setup-container').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('score-live').innerText = `Score: 0`;
    showQuestion();
}

function showQuestion() {
    const q = currentQuestions[currentQuestionIndex];
    document.getElementById('question-text').innerText = q.question;
    const optionsBox = document.getElementById('options-container');
    optionsBox.innerHTML = '';
    
    document.getElementById('question-number').innerText = `Sawal ${currentQuestionIndex + 1}/${currentQuestions.length}`;
    document.getElementById('progress-bar').style.width = `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`;
    document.getElementById('next-btn').classList.add('hidden');

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'btn option-btn';
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

function loadNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        showQuestion();
    } else {
        document.getElementById('quiz-container').classList.add('hidden');
        document.getElementById('result-container').classList.remove('hidden');
        document.getElementById('final-score').innerText = `Aapka Kul Score: ${score} / ${currentQuestions.length}`;
    }
}
