let quizData = [];
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// JSON Load karna (Premium Fetch Logic)
async function loadData() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) throw new Error("JSON file nahi mili!");
        const data = await response.json();
        quizData = data.quizzes;
        
        // Subject Dropdown bharna
        const subSelect = document.getElementById('subject-select');
        const subjects = [...new Set(quizData.map(item => item.subject))];
        subSelect.innerHTML = subjects.map(s => `<option value="${s}">${s}</option>`).join('');
        
        updateChapters(); // Initial Chapters Load
    } catch (err) {
        alert("Error: " + err.message);
    }
}

// Chapter Dropdown update karna (Jab Subject badle)
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
    
    if (currentQuestions.length === 0) return alert("Sawal nahi mile!");

    document.getElementById('setup-container').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    const q = currentQuestions[currentQuestionIndex];
    document.getElementById('question-text').innerText = q.question;
    const optionsBox = document.getElementById('options-container');
    optionsBox.innerHTML = '';
    
    // UI Updates
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

// Initialize App
loadData();
