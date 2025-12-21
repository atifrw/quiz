let data = {};
let currentQuestions = [];
let currentIndex = 0;
let correctCount = 0;
let wrongCount = 0;

// 1. JSON लोड करना (Error Checking के साथ)
fetch("mcqs (1).json")
  .then(res => {
    if (!res.ok) throw new Error("File mcqs (1).json not found");
    return res.json();
  })
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
  .catch(err => console.error("Error loading JSON:", err));

// 2. Subject के आधार पर Chapters अपडेट करना
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

// 3. क्विज़ शुरू करना
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

// 4. सवाल दिखाना (यहाँ Next Button का Fix किया गया है)
function showQuestion() {
  const q = currentQuestions[currentIndex];
  const qBox = document.getElementById("questionBox");
  const oBox = document.getElementById("optionsBox");
  const rBox = document.getElementById("resultBox");
  const nBtn = document.getElementById("nextBtn");

  // UI साफ़ करना
  qBox.innerHTML = `<b>Q${currentIndex + 1}:</b> ${q.question}`;
  oBox.innerHTML = "";
  rBox.innerHTML = "";
  nBtn.style.display = "none"; // अगला बटन अभी छुपा रहेगा

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.onclick = () => {
      // एक बार उत्तर देने के बाद सभी बटन लॉक करना
      const allBtns = document.querySelectorAll(".option-btn");
      allBtns.forEach(b => b.style.pointerEvents = "none");

      if (opt === q.answer) {
        correctCount++;
        rBox.innerHTML = "<div style='color:green; margin-bottom:10px;'>✅ सही उत्तर!</div>";
      } else {
        wrongCount++;
        rBox.innerHTML = `<div style='color:red; margin-bottom:10px;'>❌ गलत! सही उत्तर: ${q.answer}</div>`;
      }
      
      // उत्तर देने के बाद 'अगला सवाल' बटन दिखाना
      nBtn.style.display = "block";
      nBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    oBox.appendChild(btn);
  });
}

// 5. अगला सवाल लोड करना
function showNext() {
  currentIndex++;
  if (currentIndex < currentQuestions.length) {
    showQuestion();
  } else {
    // रिजल्ट दिखाना
    document.getElementById("questionBox").innerHTML = "🎉 आपने सभी प्रश्न हल कर लिए!";
    document.getElementById("optionsBox").innerHTML = "";
    document.getElementById("resultBox").innerHTML = `
      <div style="background:#e9ecef; padding:20px; border-radius:10px; text-align:center;">
        <p style="color:green; font-size:22px;">✅ सही जवाब: ${correctCount}</p>
        <p style="color:red; font-size:22px;">❌ गलत जवाब: ${wrongCount}</p>
        <hr>
        <p>📊 कुल प्रश्न: ${currentQuestions.length}</p>
        <button onclick="location.reload()" style="background:#4e54c8; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer;">🔄 दोबारा शुरू करें</button>
      </div>
    `;
    document.getElementById("nextBtn").style.display = "none";
  }
}

// 6. सवालों को मिक्स करना
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

