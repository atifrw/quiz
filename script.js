let data = {};
let currentQuestions = [];
let currentIndex = 0;
let correctCount = 0;
let wrongCount = 0;

const subjectSelect = document.getElementById("subjectSelect");
const chapterSelect = document.getElementById("chapterSelect");

// JSON load
fetch("mcqs.json")
  .then(res => res.json())
  .then(json => {
    data = json;

    // Subject load
    for (let subject in data) {
      let opt = document.createElement("option");
      opt.value = subject;
      opt.textContent = subject;
      subjectSelect.appendChild(opt);
    }
  });

// Subject change → Chapter load
subjectSelect.addEventListener("change", () => {
  chapterSelect.innerHTML = `<option value="">-- अध्याय चुनें --</option>`;

  const subject = subjectSelect.value;
  if (!subject) return;

  const chapters = data[subject]["प्राचीन भारत"];

  for (let ch in chapters) {
    let opt = document.createElement("option");
    opt.value = ch;
    opt.textContent = ch;
    chapterSelect.appendChild(opt);
  }
});

// Quiz start
function startQuiz() {
  correctCount = 0;
  wrongCount = 0;
  currentIndex = 0;

  const subject = subjectSelect.value;
  const chapter = chapterSelect.value;

  if (!subject || !chapter) {
    alert("पहले Subject और Chapter चुनें");
    return;
  }

  currentQuestions = [...data[subject]["प्राचीन भारत"][chapter]];
  shuffle(currentQuestions);

  document.getElementById("quizArea").style.display = "block";
  showQuestion();
}

// Show question
function showQuestion() {
  const q = currentQuestions[currentIndex];

  document.getElementById("questionBox").innerHTML =
    `<b>Q${currentIndex + 1}:</b> ${q.question}`;

  const box = document.getElementById("optionsBox");
  box.innerHTML = "";

  document.getElementById("resultBox").innerText = "";
  document.getElementById("nextBtn").style.display = "none";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;

    btn.onclick = () => {
      if (opt === q.answer) {
        correctCount++;
        document.getElementById("resultBox").innerText = "✅ सही उत्तर!";
      } else {
        wrongCount++;
        document.getElementById("resultBox").innerText =
          `❌ गलत! सही उत्तर: ${q.answer}`;
      }
      document.getElementById("nextBtn").style.display = "block";
    };

    box.appendChild(btn);
  });
}

// Next question
function showNext() {
  currentIndex++;

  if (currentIndex < currentQuestions.length) {
    showQuestion();
  } else {
    document.getElementById("questionBox").innerHTML =
      "🎉 आपने सभी प्रश्न हल कर लिए!";

    document.getElementById("optionsBox").innerHTML = "";

    document.getElementById("resultBox").innerHTML = `
✅ सही जवाब: ${correctCount}<br>
❌ गलत जवाब: ${wrongCount}<br>
📊 कुल प्रश्न: ${currentQuestions.length}
`;

    document.getElementById("nextBtn").style.display = "none";
  }
}

// Shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
