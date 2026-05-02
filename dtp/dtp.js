/* =====================================================
   #DrownthatPuppy™ — Quiz Logic
   ===================================================== */

(function () {
  "use strict";

  const intro       = document.getElementById("dtp-intro");
  const quiz        = document.getElementById("dtp-quiz");
  const result      = document.getElementById("dtp-result");
  const progressBar = document.getElementById("progressBar");
  const qNumEl      = document.getElementById("qNum");
  const startBtn    = document.getElementById("startBtn");
  const quizStartBtn = document.getElementById("quizStartBtn");

  const questions   = document.querySelectorAll(".dtp-question");
  const totalQ      = questions.length;

  let currentQ = 1;
  let scores   = [];

  /* ---- Scroll to tool section smoothly ---- */
  function scrollToTool() {
    const toolEl = document.getElementById("dtp-tool");
    if (!toolEl) return;
    const navH = document.getElementById("nav")?.offsetHeight || 72;
    const top  = toolEl.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: "smooth" });
  }

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      scrollToTool();
    });
  }

  if (quizStartBtn) {
    quizStartBtn.addEventListener("click", () => {
      intro.hidden = true;
      quiz.hidden  = false;
      showQuestion(1);
    });
  }

  /* ---- Show a question by number ---- */
  function showQuestion(num) {
    questions.forEach(q => {
      const isTarget = parseInt(q.dataset.q, 10) === num;
      q.hidden = !isTarget;
      if (isTarget) {
        q.style.animation = "none";
        void q.offsetWidth;
        q.style.animation = "";
      }
    });

    qNumEl.textContent = num;
    const pct = ((num - 1) / totalQ) * 100;
    progressBar.style.width = pct + "%";
  }

  /* ---- Handle option selection ---- */
  document.querySelectorAll(".dtp-option").forEach(btn => {
    btn.addEventListener("click", () => {
      const q   = parseInt(btn.dataset.q, 10);
      const val = parseInt(btn.dataset.value, 10);

      scores[q - 1] = val;

      const siblings = btn.closest(".dtp-options").querySelectorAll(".dtp-option");
      siblings.forEach(s => s.classList.remove("selected"));
      btn.classList.add("selected");

      setTimeout(() => {
        if (q < totalQ) {
          currentQ = q + 1;
          showQuestion(currentQ);
        } else {
          showResult();
        }
      }, 380);
    });
  });

  /* ---- Calculate and show result ---- */
  function showResult() {
    const total = scores.reduce((sum, v) => sum + v, 0);
    const max   = totalQ * 3;
    const ratio = total / max;

    quiz.hidden   = true;
    result.hidden = false;

    progressBar.style.width = "100%";

    let resultId;
    if (ratio >= 0.55) {
      resultId = "result-cold";
    } else if (ratio <= 0.3) {
      resultId = "result-hot";
    } else {
      resultId = "result-lukewarm";
    }

    document.getElementById(resultId).hidden = false;

    const navH = document.getElementById("nav")?.offsetHeight || 72;
    const top  = result.getBoundingClientRect().top + window.scrollY - navH - 32;
    window.scrollTo({ top, behavior: "smooth" });
  }

  /* ---- Restart ---- */
  function restart() {
    scores   = [];
    currentQ = 1;

    document.querySelectorAll(".dtp-result__card").forEach(c => (c.hidden = true));
    document.querySelectorAll(".dtp-option").forEach(o => o.classList.remove("selected"));

    result.hidden = true;
    quiz.hidden   = false;

    progressBar.style.width = "0%";
    showQuestion(1);

    const navH = document.getElementById("nav")?.offsetHeight || 72;
    const toolEl = document.getElementById("dtp-tool");
    if (toolEl) {
      const top = toolEl.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  ["restartBtnHot", "restartBtnCold", "restartBtnLukewarm"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", restart);
  });

})();
