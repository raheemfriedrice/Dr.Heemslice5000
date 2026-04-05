/* =====================================================
   SnackMaster RICE — Main JS
   Dr. Heemslice 5000
   v2.0 — Full Send Edition
   ===================================================== */

(function () {
  "use strict";

  /* ---- DOM References ---- */
  const nav        = document.getElementById("nav");
  const burger     = document.getElementById("burger");
  const navLinks   = document.getElementById("navLinks");
  const reveals    = document.querySelectorAll(".reveal");
  const statNums   = document.querySelectorAll(".stat__num[data-count]");
  const navLinkEls = document.querySelectorAll(".nav__link:not(.nav__link--cta)");
  const loader     = document.getElementById("loader");
  const heroEl     = document.getElementById("hero");
  const heroGlow   = document.getElementById("heroGlow");

  /* ==================================================
     0. PAGE LOADER
     ================================================== */
  function dismissLoader() {
    if (!loader) return;
    loader.classList.add("done");
    document.body.style.overflow = "";
  }

  if (loader) {
    document.body.style.overflow = "hidden";
    // Dismiss after animation completes (1.4s) or on load, whichever is later
    window.addEventListener("load", () => {
      setTimeout(dismissLoader, 1200);
    });
    // Safety net: dismiss after 3s no matter what
    setTimeout(dismissLoader, 3000);
  }

  /* ==================================================
     1. NAV — scroll state
     ================================================== */
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 40) {
          nav.classList.add("scrolled");
        } else {
          nav.classList.remove("scrolled");
        }
        updateActiveNavLink();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ==================================================
     2. MOBILE NAV — burger toggle
     ================================================== */
  if (burger && navLinks) {
    burger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      burger.classList.toggle("open", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
      // Don't override loader overflow
      if (!loader || loader.classList.contains("done")) {
        document.body.style.overflow = isOpen ? "hidden" : "";
      }
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        burger.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        if (!loader || loader.classList.contains("done")) {
          document.body.style.overflow = "";
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
        burger.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        if (!loader || loader.classList.contains("done")) {
          document.body.style.overflow = "";
        }
      }
    });
  }

  /* ==================================================
     3. ACTIVE NAV LINK — highlights current section
     ================================================== */
  function updateActiveNavLink() {
    if (!navLinkEls.length) return;
    const scrollPos = window.scrollY + 120;
    const sections  = ["hero", "about", "work", "media", "contact"];

    let current = "hero";
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollPos) current = id;
    });

    navLinkEls.forEach(link => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        link.classList.toggle("active", href === `#${current}`);
      }
    });
  }

  /* ==================================================
     4. SCROLL REVEAL — Intersection Observer
     ================================================== */
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
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

  /* ==================================================
     9. CURSOR GLOW — follows mouse in hero section
     ================================================== */
  if (heroEl && heroGlow && window.matchMedia("(pointer: fine)").matches) {
    heroEl.addEventListener("mousemove", (e) => {
      const rect = heroEl.getBoundingClientRect();
      heroGlow.style.left = (e.clientX - rect.left) + "px";
      heroGlow.style.top  = (e.clientY - rect.top)  + "px";
      if (!heroGlow.classList.contains("active")) {
        heroGlow.classList.add("active");
      }
    });

    heroEl.addEventListener("mouseleave", () => {
      heroGlow.classList.remove("active");
    });
  }

  /* ==================================================
     10. HERO TITLE PARALLAX — subtle mouse tracking
     ================================================== */
  if (heroEl && window.matchMedia("(pointer: fine)").matches) {
    const titleLines = heroEl.querySelectorAll(".hero__title-line");
    if (titleLines.length) {
      heroEl.addEventListener("mousemove", (e) => {
        const rect = heroEl.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 to 0.5
        const cy = (e.clientY - rect.top)  / rect.height - 0.5;

        titleLines.forEach(line => {
          const factor = parseFloat(getComputedStyle(line).getPropertyValue("--parallax")) || 0;
          const x = cx * factor * 100;
          const y = cy * factor * 60;
          line.style.transform = `translate(${x}px, ${y}px)`;
        });
      });

      heroEl.addEventListener("mouseleave", () => {
        titleLines.forEach(line => {
          line.style.transform = "translate(0, 0)";
        });
      });
    }
  }

})();
