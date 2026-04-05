/* =====================================================
   SnackMaster RICE — Main JS
   Dr. Heemslice 5000
   ===================================================== */

(function () {
  "use strict";

  /* ---- DOM References ---- */
  const nav       = document.getElementById("nav");
  const burger    = document.getElementById("burger");
  const navLinks  = document.getElementById("navLinks");
  const reveals   = document.querySelectorAll(".reveal");
  const statNums  = document.querySelectorAll(".stat__num[data-count]");
  const navLinkEls = document.querySelectorAll(".nav__link:not(.nav__link--cta)");

  /* ==================================================
     1. NAV — scroll state
     ================================================== */
  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
    updateActiveNavLink();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run once on load

  /* ==================================================
     2. MOBILE NAV — burger toggle
     ================================================== */
  if (burger && navLinks) {
    burger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      burger.classList.toggle("open", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close nav when a link is clicked
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        burger.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });

    // Close nav on outside click
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
        burger.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  /* ==================================================
     3. ACTIVE NAV LINK — highlights current section
     ================================================== */
  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 120;
    const sections  = ["hero", "about", "work", "media", "contact"];

    let current = "hero";
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollPos) current = id;
    });

    navLinkEls.forEach(link => {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === `#${current}`);
    });
  }

  /* ==================================================
     4. SCROLL REVEAL — Intersection Observer
     ================================================== */
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // Stagger siblings that reveal together
            const siblings = Array.from(
              entry.target.parentElement.querySelectorAll(".reveal:not(.visible)")
            );
            const idx = siblings.indexOf(entry.target);
            const delay = Math.min(idx * 80, 400);

            setTimeout(() => {
              entry.target.classList.add("visible");
            }, delay);

            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show everything immediately
    reveals.forEach(el => el.classList.add("visible"));
  }

  /* ==================================================
     5. COUNTER ANIMATION — stat numbers
     ================================================== */
  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease out quad
      const eased    = 1 - (1 - progress) * (1 - progress);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window && statNums.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNums.forEach(el => counterObserver.observe(el));
  }

  /* ==================================================
     6. SMOOTH SCROLL — anchor links with offset
     ================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();

      const navHeight = nav ? nav.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ==================================================
     7. WORK CARDS — keyboard accessibility
     ================================================== */
  document.querySelectorAll(".work__card[tabindex]").forEach(card => {
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  });

  /* ==================================================
     8. MARQUEE — pause on hover/focus (accessibility)
     ================================================== */
  const marqueeTrack = document.querySelector(".marquee__track");
  if (marqueeTrack) {
    const marqueeEl = marqueeTrack.closest(".marquee");
    marqueeEl.addEventListener("mouseenter", () => {
      marqueeTrack.style.animationPlayState = "paused";
    });
    marqueeEl.addEventListener("mouseleave", () => {
      marqueeTrack.style.animationPlayState = "running";
    });
  }

})();
