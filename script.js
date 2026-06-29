
let questions = [];
let currentQuestionIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let wrongQuestions = [];

async function loadQuestions() {
    const response = await fetch("mcqs.json");
    const data = await response.json();
    questions = data.flatMap(chapter => chapter.questions);
    questions = shuffleArray(questions);
    showQuestion();
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function showQuestion() {
    const q = questions[currentQuestionIndex];
    document.getElementById("question").innerText = q.question;
    const options = document.getElementById("options");
    options.innerHTML = "";
    q.options.forEach(option => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerText = option;
        btn.onclick = () => checkAnswer(option, q.answer, btn);
        options.appendChild(btn);
    });
    updateProgress();
}

function checkAnswer(selected, correct, btn) {
    const buttons = document.querySelectorAll(".option-btn");
    buttons.forEach(b => {
        b.disabled = true;
        if (b.innerText === correct) {
            b.classList.add("correct");
        }
        if (b.innerText === selected && selected !== correct) {
            b.classList.add("wrong");
        }
    });

    if (selected === correct) {
        correctCount++;
    } else {
        wrongCount++;
        wrongQuestions.push(questions[currentQuestionIndex]);
    }

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    }, 1000);
}

function showResult() {
    document.getElementById("quiz-box").innerHTML = `
        <h2>Quiz Complete</h2>
        <p>✅ सही जवाब: ${correctCount}</p>
        <p>❌ गलत जवाब: ${wrongCount}</p>
        <button onclick="retryWrong()">🔁 गलत सवालों को फिर से हल करें</button>
        <button onclick="location.reload()">🔄 Restart Quiz</button>
    `;
}

function retryWrong() {
    if (wrongQuestions.length === 0) return;
    questions = [...wrongQuestions];
    wrongQuestions = [];
    currentQuestionIndex = 0;
    correctCount = 0;
    wrongCount = 0;
    document.getElementById("quiz-box").innerHTML = `
        <div id="question" class="question"></div>
        <div id="options" class="options"></div>
        <div id="progress" class="progress"></div>
    `;
    showQuestion();
}

function updateProgress() {
    document.getElementById("progress").innerText = 
        \`Question \${currentQuestionIndex + 1} of \${questions.length}  |  ✅ \${correctCount} | ❌ \${wrongCount}\`;
}

window.onload = loadQuestions;
