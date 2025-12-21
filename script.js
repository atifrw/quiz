let data = {};
let currentQuestions = [];
let currentIndex = 0;
let correctCount = 0;
let wrongCount = 0;

// JSON लोड करना
fetch("mcqs.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    const subSelect = document.getElementById("subjectSelect");
    Object.keys(data).forEach(sub => {
      const opt = document.createElement("option");
      opt.value = sub;
      opt.textContent = sub;
      subSelect.appendChild(opt);
    });
  });

// Subject के आधार पर Chapters अपडेट करना
function updateChapters() {
  const subject = document.getElementById("subjectSelect").value;
  const chapSelect = document.getElementById("chapterSelect");
  chapSelect.innerHTML = "<option value=''>-- अध्याय चुनें --</option>";

  if (subject && data[subject]) {
    Object.keys(data[subject]).forEach(ch => {
      const opt = document.createElement("option");
      opt.value = ch;
      opt.textContent = ch;
      chapSelect.appendChild(opt);
    });
  }
}

function startQuiz() {
  const sub = document.getElementById("subjectSelect").value;
  const ch = document.getElementById("chapterSelect").value;

  if (!sub || !ch) {
    alert("कृपया Subject और Chapter दोनों चुनें!");
    return;
  }

  correctCount = 0;
  wrongCount = 0;
  currentQuestions = [...data[sub][ch]];
  
  shuffle(currentQuestions);
  currentIndex = 0;
  document.getElementById("quizArea").style.display = "block";
  showQuestion();
}

function showQuestion() {
  const q = currentQuestions[currentIndex];
  document.getElementById("questionBox").innerHTML = `<b>Q${currentIndex+1}:</b> ${q.question}`;
  const box = document.getElementById("optionsBox");
  box.innerHTML = "";
  document.getElementById("resultBox").innerText = "";
  document.getElementById("nextBtn").style.display = "none";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.onclick = () => {
      // एक बार उत्तर देने के बाद बटन डिसेबल करना (Optional)
      const allBtns = document.querySelectorAll(".option-btn");
      allBtns.forEach(b => b.style.pointerEvents = "none");

      if (opt === q.answer) {
        correctCount++;
        document.getElementById("resultBox").innerHTML = "<span style='color:green;'>✅ सही उत्तर!</span>";
      } else {
        wrongCount++;
        document.getElementById("resultBox").innerHTML = `<span style='color:red;'>❌ गलत! सही उत्तर: ${q.answer}</span>`;
      }
      document.getElementById("nextBtn").style.display = "block";
    };
    box.appendChild(btn);
  });
}

function showNext() {
  currentIndex++;
  if (currentIndex < currentQuestions.length) {
    showQuestion();
  } else {
    document.getElementById("questionBox").innerHTML = "🎉 आपने सभी प्रश्न हल कर लिए!";
    document.getElementById("optionsBox").innerHTML = "";
    document.getElementById("resultBox").innerHTML = `
      <div style="background:#e9ecef; padding:20px; border-radius:10px;">
        ✅ सही जवाब: ${correctCount}<br>
        ❌ गलत जवाब: ${wrongCount}<br>
        📊 कुल प्रश्न: ${currentQuestions.length}
      </div>
    `;
    document.getElementById("nextBtn").style.display = "none";
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

