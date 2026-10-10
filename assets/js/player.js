/* =====================================================
   SnackMaster RICE — Audio Player
   Dr. Heemslice 5000 | v1.0
   Handles downloaded MP3s from assets/audio/
   ===================================================== */

(function () {
  "use strict";

  /* ---- DOM ---- */
  const playerEl     = document.getElementById("player");
  const playerPlay   = document.getElementById("playerPlay");
  const playerPrev   = document.getElementById("playerPrev");
  const playerNext   = document.getElementById("playerNext");
  const playerMute   = document.getElementById("playerMute");
  const playerTitle  = document.getElementById("playerTitle");
  const playerSub    = document.getElementById("playerSub");
  const playerArt    = document.getElementById("playerArtwork");
  const playerArtFb  = document.getElementById("playerArtworkFallback");
  const playerFill   = document.getElementById("playerFill");
  const playerThumb  = document.getElementById("playerThumb");
  const playerBar    = document.getElementById("playerBar");
  const playerCurr   = document.getElementById("playerCurrent");
  const playerTotal  = document.getElementById("playerTotal");
  const playerVolBar = document.getElementById("playerVolBar");
  const playerVolFill= document.getElementById("playerVolFill");
  const trackEls     = document.querySelectorAll(".track");

  if (!playerEl || !trackEls.length) return;

  /* ---- State ---- */
  const audio    = new Audio();
  let currentIdx = -1;
  let isPlaying  = false;
  let isDragging = false;
  let volDragging= false;
  let volume     = 1;

  /* ---- Helpers ---- */
  function fmt(sec) {
    if (isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function setPlayIcon(playing) {
    const iconPlay  = playerPlay.querySelector(".icon-play");
    const iconPause = playerPlay.querySelector(".icon-pause");
    iconPlay.style.display  = playing ? "none"  : "";
    iconPause.style.display = playing ? ""      : "none";
  }

  function setTrackActive(idx, playing) {
    trackEls.forEach((el, i) => {
      el.classList.toggle("active",  i === idx);
      el.classList.toggle("playing", i === idx && playing);

      // Swap play button icon inside card
      const btn = el.querySelector(".track__play svg");
      if (btn) {
        if (i === idx && playing) {
          btn.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
        } else {
          btn.innerHTML = '<path d="M8 5v14l11-7z"/>';
        }
      }
    });
  }

  /* ---- Load a track ---- */
  function loadTrack(idx, autoplay) {
    const track = trackEls[idx];
    if (!track) return;

    currentIdx = idx;

    const src     = track.dataset.src     || "";
    const title   = track.querySelector(".track__title")?.textContent  || "Track";
    const artSrc  = track.querySelector(".track__art img")?.src        || "";

    audio.src = src;
    audio.load();

    playerTitle.textContent = title;
    playerSub.textContent   = "Dr. Heemslice 5000";

    if (artSrc) {
      playerArt.src           = artSrc;
      playerArt.style.display = "";
      playerArtFb.style.display = "none";
    } else {
      playerArt.style.display   = "none";
      playerArtFb.style.display = "";
    }

    playerFill.style.width       = "0%";
    playerThumb.style.left       = "0%";
    playerBar.setAttribute("aria-valuenow", "0");
    playerCurr.textContent       = "0:00";
    playerTotal.textContent      = "0:00";

    playerEl.removeAttribute("hidden");
    playerEl.scrollIntoView({ behavior: "smooth", block: "nearest" });

    if (autoplay) {
      audio.play().then(() => {
        isPlaying = true;
        setPlayIcon(true);
        setTrackActive(idx, true);
        playerEl.classList.add("playing");
      }).catch(() => {
        // Autoplay blocked — show play state but don't crash
        isPlaying = false;
      });
    } else {
      isPlaying = false;
      setPlayIcon(false);
      setTrackActive(idx, false);
      playerEl.classList.remove("playing");
    }
  }

  /* ---- Play / Pause ---- */
  function togglePlay() {
    if (currentIdx === -1) {
      loadTrack(0, true);
      return;
    }
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      setPlayIcon(false);
      setTrackActive(currentIdx, false);
      playerEl.classList.remove("playing");
    } else {
      audio.play().then(() => {
        isPlaying = true;
        setPlayIcon(true);
        setTrackActive(currentIdx, true);
        playerEl.classList.add("playing");
      });
    }
  }

  /* ---- Prev / Next ---- */
  function prevTrack() {
    const idx = currentIdx <= 0 ? trackEls.length - 1 : currentIdx - 1;
    loadTrack(idx, isPlaying);
  }

  function nextTrack() {
    const idx = currentIdx >= trackEls.length - 1 ? 0 : currentIdx + 1;
    loadTrack(idx, isPlaying);
  }

  /* ---- Progress update ---- */
  audio.addEventListener("timeupdate", () => {
    if (isDragging || !audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    playerFill.style.width = pct + "%";
    playerThumb.style.left = pct + "%";
    playerBar.setAttribute("aria-valuenow", Math.round(pct));
    playerCurr.textContent = fmt(audio.currentTime);
  });

  audio.addEventListener("loadedmetadata", () => {
    playerTotal.textContent = fmt(audio.duration);
  });

  audio.addEventListener("ended", () => {
    nextTrack();
  });

  audio.addEventListener("error", () => {
    // Track file not yet available — just reset to stopped state visually
    isPlaying = false;
    setPlayIcon(false);
    setTrackActive(currentIdx, false);
    playerEl.classList.remove("playing");
  });

  /* ---- Seek — click + drag ---- */
  function seekTo(e) {
    const rect = playerBar.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (audio.duration) {
      audio.currentTime = pct * audio.duration;
    }
    playerFill.style.width = (pct * 100) + "%";
    playerThumb.style.left = (pct * 100) + "%";
    playerBar.setAttribute("aria-valuenow", Math.round(pct * 100));
  }

  playerBar.addEventListener("mousedown", (e) => {
    isDragging = true;
    seekTo(e);
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) seekTo(e);
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  playerBar.addEventListener("keydown", (e) => {
    if (!audio.duration) return;
    const step = 5;
    if (e.key === "ArrowRight") audio.currentTime = Math.min(audio.duration, audio.currentTime + step);
    if (e.key === "ArrowLeft")  audio.currentTime = Math.max(0, audio.currentTime - step);
  });

  /* ---- Volume ---- */
  function setVolume(e) {
    const rect = playerVolBar.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    volume = pct;
    audio.volume = pct;
    playerVolFill.style.width = (pct * 100) + "%";
    playerVolBar.setAttribute("aria-valuenow", Math.round(pct * 100));
    audio.muted = (pct === 0);
  }

  playerVolBar.addEventListener("mousedown", (e) => {
    volDragging = true;
    setVolume(e);
  });

  document.addEventListener("mousemove", (e) => {
    if (volDragging) setVolume(e);
  });

  document.addEventListener("mouseup", () => {
    volDragging = false;
  });

  playerMute.addEventListener("click", () => {
    audio.muted = !audio.muted;
    playerMute.style.opacity = audio.muted ? "0.3" : "1";
  });

  /* ---- Control buttons ---- */
  playerPlay.addEventListener("click", togglePlay);
  playerPrev.addEventListener("click", prevTrack);
  playerNext.addEventListener("click", nextTrack);

  /* ---- Track card clicks ---- */
  trackEls.forEach((track, idx) => {
    function handleActivate() {
      if (currentIdx === idx) {
        togglePlay();
      } else {
        loadTrack(idx, true);
      }
    }

    track.addEventListener("click", handleActivate);
    track.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleActivate();
      }
    });
  });

  /* ---- Global keyboard shortcuts (when not focused on input) ---- */
  document.addEventListener("keydown", (e) => {
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === "input" || tag === "textarea") return;
    if (currentIdx === -1) return;

    if (e.code === "Space") {
      e.preventDefault();
      togglePlay();
    }
    if (e.key === "ArrowRight" && e.altKey) nextTrack();
    if (e.key === "ArrowLeft"  && e.altKey) prevTrack();
  });

})();
