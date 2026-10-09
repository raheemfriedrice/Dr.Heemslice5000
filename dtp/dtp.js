/* =====================================================
   #DrownthatPuppy™ — Quiz Logic
   ===================================================== */

(function () {
  "use strict";

  const TOTAL_Q    = 6;
  const STATS_KEY  = "dtp_stats";
  const ADVANCE_MS = 2000;

  /* Seed data — realistic initial pool so stats feel live from day one.
     Q1 includes value 4 = "two nostrils" option. */
  const SEED = {
    1: { 0: 48, 1: 31, 2: 14, 3: 52, 4: 73 },
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
  const modeNice    = document.getElementById("modeNice");
  const modeMean    = document.getElementById("modeMean");
  const meanBanner  = document.getElementById("meanBanner");

  let scores  = [];
  let isMean  = false;

  /* ============================================================
     MODE TOGGLE
     ============================================================ */
  function setMode(mean) {
    isMean = mean;
    document.body.classList.toggle("mean-mode", mean);

    modeNice.classList.toggle("dtp-mode-btn--active", !mean);
    modeMean.classList.toggle("dtp-mode-btn--active",  mean);

    if (meanBanner) meanBanner.hidden = !mean;
  }

  modeNice?.addEventListener("click", () => setMode(false));
  modeMean?.addEventListener("click", () => setMode(true));

  /* ============================================================
     STATS — localStorage
     ============================================================ */
  function loadStats() {
    try {
      const raw = localStorage.getItem(STATS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return JSON.parse(JSON.stringify(SEED));
  }

  function saveStats(stats) {
    try { localStorage.setItem(STATS_KEY, JSON.stringify(stats)); } catch (_) {}
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
        q.style.animation = "none";
        void q.offsetWidth;
        q.style.animation = "";
      }
    });
    setProgress(num);
  }

  /* ============================================================
     STAT BARS
     ============================================================ */
  function renderStats(qNum) {
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

      const bar   = document.createElement("span");
      bar.className = "dtp-option__bar";
      bar.style.width = "0%";

      const pctEl = document.createElement("span");
      pctEl.className = "dtp-option__pct";
      pctEl.textContent = pct + "%";

      const cntEl = document.createElement("span");
      cntEl.className = "dtp-option__count";
      cntEl.textContent = cnt.toLocaleString();

      btn.appendChild(bar);
      btn.appendChild(pctEl);
      btn.appendChild(cntEl);

      requestAnimationFrame(() => requestAnimationFrame(() => {
        bar.style.width = pct + "%";
      }));
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
     OPTION CLICK
     ============================================================ */
  document.querySelectorAll(".dtp-option").forEach(btn => {
    btn.addEventListener("click", () => {
      const qNum  = parseInt(btn.dataset.q, 10);
      const val   = parseInt(btn.dataset.value, 10);
      const qEl   = btn.closest(".dtp-question");
      const scored = qEl.dataset.scored === "true";

      btn.classList.add("selected");
      recordVote(qNum, val);
      renderStats(qNum);

      /* Q2→scores[0], Q3→scores[1], ... Q6→scores[4]; Q1 skipped */
      if (scored) scores[qNum - 2] = val;

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
     RESULT
     ============================================================ */
  function showResult() {
    const total = scores.reduce((s, v) => s + (v || 0), 0);
    const ratio = total / (5 * 3);

    quiz.hidden   = true;
    result.hidden = false;
    progressBar.style.width = "100%";

    let id;
    if      (ratio >= 0.55) id = "result-cold";
    else if (ratio <= 0.30) id = "result-hot";
    else                    id = "result-lukewarm";

    document.getElementById(id).hidden = false;

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
    result.hidden = true;
    quiz.hidden   = false;
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
     HERO BUTTON
     ============================================================ */
  document.getElementById("startBtn")?.addEventListener("click", e => {
    e.preventDefault();
    const toolEl = document.getElementById("dtp-tool");
    if (!toolEl) return;
    const navH = document.getElementById("nav")?.offsetHeight || 72;
    window.scrollTo({ top: toolEl.getBoundingClientRect().top + window.scrollY - navH, behavior: "smooth" });
  });

  /* ---- init ---- */
  showQuestion(1);

})();
