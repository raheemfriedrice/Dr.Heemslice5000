/* =====================================================
   #DrownthatPuppy™ — Quiz Logic
   ===================================================== */

(function () {
  "use strict";

  /* ---- Constants ---- */
  const TOTAL_Q    = 6;
  const STATS_KEY  = "dtp_stats";
  const ADVANCE_MS = 2000; // ms to show stats before moving on

  /* Seed data — plausible initial response pool so stats feel live from day one */
  const SEED = {
    1: { 0: 48, 1: 31, 2: 14, 3: 52 },
    2: { 0: 22, 1: 47, 2: 38, 3: 28 },
    3: { 0: 19, 1: 54, 2: 31, 3: 21 },
    4: { 0: 24, 1: 51, 2: 35, 3: 18 },
    5: { 0: 41, 1: 55, 2: 23, 3: 16 },
    6: { 0: 29, 1: 48, 2: 39, 3: 27 },
  };

  /* ---- DOM ---- */
  const quiz        = document.getElementById("dtp-quiz");
  const result      = document.getElementById("dtp-result");
  const progressBar = document.getElementById("progressBar");
  const qNumEl      = document.getElementById("qNum");
  const questions   = document.querySelectorAll(".dtp-question");

  let scores = [];

  /* ============================================================
     STATS — localStorage
     ============================================================ */

  function loadStats() {
    try {
      const raw = localStorage.getItem(STATS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return JSON.parse(JSON.stringify(SEED)); // deep clone seed
  }

  function saveStats(stats) {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (_) {}
  }

  function recordVote(qNum, value) {
    const stats = loadStats();
    if (!stats[qNum]) stats[qNum] = {};
    stats[qNum][value] = (stats[qNum][value] || 0) + 1;
    saveStats(stats);
    return stats[qNum];
  }

  /* ============================================================
     PROGRESS
     ============================================================ */

  function setProgress(qNum) {
    qNumEl.textContent = qNum;
    progressBar.style.width = ((qNum - 1) / TOTAL_Q * 100) + "%";
  }

  /* ============================================================
     SHOW QUESTION
     ============================================================ */

  function showQuestion(num) {
    questions.forEach(q => {
      const match = parseInt(q.dataset.q, 10) === num;
      q.hidden = !match;
      if (match) {
        // retrigger animation
        q.style.animation = "none";
        void q.offsetWidth;
        q.style.animation = "";
      }
    });
    setProgress(num);
  }

  /* ============================================================
     STAT BARS — inject & animate after selection
     ============================================================ */

  function renderStats(qNum, votedValue) {
    const qEl    = document.querySelector(`.dtp-question[data-q="${qNum}"]`);
    const opts   = qEl.querySelectorAll(".dtp-option");
    const counts = loadStats()[qNum] || {};
    const total  = Object.values(counts).reduce((s, v) => s + v, 0);

    opts.forEach(btn => {
      btn.disabled = true;
      btn.classList.add("answered");

      const val  = parseInt(btn.dataset.value, 10);
      const cnt  = counts[val] || 0;
      const pct  = total > 0 ? Math.round((cnt / total) * 100) : 0;

      /* bar fill */
      const bar = document.createElement("span");
      bar.className = "dtp-option__bar";
      bar.style.width = "0%";

      /* percentage label */
      const pctEl = document.createElement("span");
      pctEl.className = "dtp-option__pct";
      pctEl.textContent = pct + "%";

      /* vote count label */
      const cntEl = document.createElement("span");
      cntEl.className = "dtp-option__count";
      cntEl.textContent = cnt.toLocaleString();

      btn.appendChild(bar);
      btn.appendChild(pctEl);
      btn.appendChild(cntEl);

      /* animate bar width after paint */
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bar.style.width = pct + "%";
        });
      });
    });
  }

  function clearStatBars() {
    document.querySelectorAll(".dtp-option").forEach(btn => {
      btn.classList.remove("answered", "selected");
      btn.disabled = false;
      btn.querySelector(".dtp-option__bar")?.remove();
      btn.querySelector(".dtp-option__pct")?.remove();
      btn.querySelector(".dtp-option__count")?.remove();
    });
  }

  /* ============================================================
     OPTION CLICK HANDLER
     ============================================================ */

  document.querySelectorAll(".dtp-option").forEach(btn => {
    btn.addEventListener("click", () => {
      const qNum  = parseInt(btn.dataset.q, 10);
      const val   = parseInt(btn.dataset.value, 10);
      const qEl   = btn.closest(".dtp-question");
      const scored = qEl.dataset.scored === "true";

      /* mark selected before disabling siblings */
      btn.classList.add("selected");

      /* record vote then render stats */
      recordVote(qNum, val);
      renderStats(qNum, val);

      /* store score (Q1 is unscored — skip index 0 for scoring) */
      if (scored) {
        scores[qNum - 2] = val; // Q2→index0, Q3→index1, etc.
      }

      setTimeout(() => {
        if (qNum < TOTAL_Q) {
          showQuestion(qNum + 1);
        } else {
          showResult();
        }
      }, ADVANCE_MS);
    });
  });

  /* ============================================================
     SHOW RESULT
     ============================================================ */

  function showResult() {
    const total = scores.reduce((sum, v) => sum + (v || 0), 0);
    const max   = 5 * 3; // 5 scored questions, max value 3 each
    const ratio = total / max;

    quiz.hidden   = true;
    result.hidden = false;
    progressBar.style.width = "100%";

    let resultId;
    if      (ratio >= 0.55) resultId = "result-cold";
    else if (ratio <= 0.30) resultId = "result-hot";
    else                    resultId = "result-lukewarm";

    document.getElementById(resultId).hidden = false;

    const navH = document.getElementById("nav")?.offsetHeight || 72;
    const top  = result.getBoundingClientRect().top + window.scrollY - navH - 24;
    window.scrollTo({ top, behavior: "smooth" });
  }

  /* ============================================================
     RESTART
     ============================================================ */

  function restart() {
    scores = [];

    document.querySelectorAll(".dtp-result__card").forEach(c => (c.hidden = true));
    clearStatBars();

    result.hidden = false; // briefly keep visible until quiz shows
    quiz.hidden   = false;
    result.hidden = true;

    progressBar.style.width = "0%";
    showQuestion(1);

    const navH   = document.getElementById("nav")?.offsetHeight || 72;
    const toolEl = document.getElementById("dtp-tool");
    if (toolEl) {
      const top = toolEl.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  ["restartBtnHot", "restartBtnCold", "restartBtnLukewarm"].forEach(id => {
    document.getElementById(id)?.addEventListener("click", restart);
  });

  /* ============================================================
     HERO BUTTON — smooth scroll
     ============================================================ */

  document.getElementById("startBtn")?.addEventListener("click", e => {
    e.preventDefault();
    const toolEl = document.getElementById("dtp-tool");
    if (!toolEl) return;
    const navH = document.getElementById("nav")?.offsetHeight || 72;
    const top  = toolEl.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: "smooth" });
  });

  /* ---- init: show Q1 immediately ---- */
  showQuestion(1);

})();
