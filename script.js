let data = {};
let currentQuestions = [];
let currentIndex = 0;
let correctCount = 0;
let wrongCount = 0;

// JSON फ़ाइल लोड करना
fetch("mcqs (1).json")
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
  })
  .catch(err => console.error("Data error:", err));

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
  if (!sub || !ch) { alert("कृपया विषय और अध्याय चुनें!"); return; }

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
  
  // 'अगला सवाल' बटन को छुपाना
  const nBtn = document.getElementById("nextBtn");
  nBtn.style.display = "none";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.onclick = () => {
      // सभी ऑप्शंस को लॉक करना
      const allBtns = document.querySelectorAll(".option-btn");
      allBtns.forEach(b => b.style.pointerEvents = "none");

      if (opt === q.answer) {
        correctCount++;
        document.getElementById("resultBox").innerHTML = "<p style='color:green;'>✅ सही उत्तर!</p>";
      } else {
        wrongCount++;
        document.getElementById("resultBox").innerHTML = `<p style='color:red;'>❌ गलत! सही उत्तर: ${q.answer}</p>`;
      }
      
      // 'अगला सवाल' बटन को दिखाना (Force block)
      nBtn.style.display = "block";
    };
    box.appendChild(btn);
  });
}

function showNext() {
  currentIndex++;
  if (currentIndex < currentQuestions.length) {
    showQuestion();
  } else {
    // फाइनल रिजल्ट दिखाना
    const quizArea = document.getElementById("quizArea");
    quizArea.innerHTML = `
      <div class="result">
        <h3 style="font-size:30px;">🎉 स्कोरकार्ड</h3>
        <p style="color:green;">✅ सही: ${correctCount}</p>
        <p style="color:red;">❌ गलत: ${wrongCount}</p>
        <p>📊 कुल सवाल: ${currentQuestions.length}</p>
        <button onclick="location.reload()" style="background:#4e54c8; color:white;">🔄 फिर से शुरू करें</button>
      </div>`;
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
