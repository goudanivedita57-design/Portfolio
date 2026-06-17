/* Shared portfolio JS (single-page):
   - Active navbar highlight
   - Mobile nav toggle
   - Section switching
   - Scroll reveal animations
   - Skills progress bar animation
   - Contact form toast + basic validation
*/

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const nav = document.getElementById("primary-nav");
  const toggleBtn = document.querySelector(".nav-toggle");

  // Mobile nav toggle
  if (toggleBtn && nav) {
    toggleBtn.addEventListener("click", () => {
      const expanded = toggleBtn.getAttribute("aria-expanded") === "true";
      toggleBtn.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("nav-open");
    });

    nav.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.matches("a.nav-link")) {
        toggleBtn.setAttribute("aria-expanded", "false");
        nav.classList.remove("nav-open");
      }
    });
  }

  // Section switching for single-page navigation
  const sections = document.querySelectorAll("main > section[id]");
  const navLinks = document.querySelectorAll("a[data-section]");

  function showSection(sectionId) {
    sections.forEach(section => {
      section.style.display = section.id === sectionId ? "block" : "none";
    });
    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("data-section") === sectionId);
    });
    // Scroll to top when switching sections
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Handle nav link clicks
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionId = link.getAttribute("data-section");
      if (sectionId) {
        showSection(sectionId);
      }
    });
  });

  // Handle button clicks with data-section
  document.addEventListener("click", (e) => {
    const target = e.target.closest("[data-section]");
    if (target && !target.matches("a[data-section]")) {
      e.preventDefault();
      const sectionId = target.getAttribute("data-section");
      if (sectionId) {
        showSection(sectionId);
      }
    }
  });

  // Show home section by default
  showSection("home");

  // Scroll reveal animations
  const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));
  if (typeof IntersectionObserver !== "undefined" && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -12% 0px" }
    );

    revealEls.forEach((el) => {
      el.classList.add("reveal");
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Progress bars (animate when visible)
  const progressEls = Array.from(document.querySelectorAll("[data-progress]"));
  if (typeof IntersectionObserver !== "undefined" && progressEls.length) {
    const progressObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          const percent = Number(el.getAttribute("data-progress") || "0");
          const fill = el.querySelector(".progress-fill");
          if (fill && Number.isFinite(percent)) {
            fill.style.width = `${Math.max(0, Math.min(100, percent))}%`;
          }
          observer.unobserve(el);
        });
      },
      { threshold: 0.35 }
    );

    progressEls.forEach((wrap) => progressObserver.observe(wrap));
  } else {
    progressEls.forEach((wrap) => {
      const percent = Number(wrap.getAttribute("data-progress") || "0");
      const fill = wrap.querySelector(".progress-fill");
      if (fill && Number.isFinite(percent)) fill.style.width = `${percent}%`;
    });
  }

  // Contact form toast + basic validation
  const form = document.getElementById("contactForm");
  const toast = document.getElementById("toast");

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 3000);
  }

  if (form && toast) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = (form.elements["name"] && form.elements["name"].value || "").trim();
      const email = (form.elements["email"] && form.elements["email"].value || "").trim();
      const message = (form.elements["message"] && form.elements["message"].value || "").trim();

      if (!name) return showToast("Please enter your name.");
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) return showToast("Please enter a valid email address.");
      if (message.length < 10) return showToast("Message should be at least 10 characters.");

      showToast("Thanks! Your message is ready to send (demo form).");
      form.reset();
    });
  }
});
