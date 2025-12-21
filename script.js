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

// Subject change → Chapter load dynamically
subjectSelect.addEventListener("change", () => {
  chapterSelect.innerHTML = `<option value="">-- अध्याय चुनें --</option>`;

  const subject = subjectSelect.value;
  if (!subject) return;

  const subjectData = data[subject];

  // For each part (प्राचीन भारत / मध्यकालीन भारत etc.)
  for (let part in subjectData) {
    const chapters = subjectData[part];
    for (let ch in chapters) {
      let opt = document.createElement("option");
      opt.value = part + "||" + ch; // unique value
      opt.textContent = part + " - " + ch;
      chapterSelect.appendChild(opt);
    }
  }
});

// Start Quiz
function startQuiz() {
  correctCount = 0;
  wrongCount = 0;
  currentIndex = 0;

  const subject = subjectSelect.value;
  const chapterVal = chapterSelect.value;

  if (!subject || !chapterVal) {
    alert("पहले Subject और Chapter चुनें");
    return;
  }

  // Split the value to get part and chapter
  const parts = chapterVal.split("||");
  const part = parts[0];
  const chapter = parts[1];

  currentQuestions = [...data[subject][part][chapter]];

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
