(() => {
  "use strict";

  // Mobile menu
  const menuToggle = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const open = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!open));
      mobileNav.hidden = open;
      if (!open) {
        // force reflow then open for transition
        mobileNav.offsetHeight;
        mobileNav.dataset.open = "true";
      } else {
        delete mobileNav.dataset.open;
      }
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        delete mobileNav.dataset.open;
        mobileNav.hidden = true;
      });
    });
  }

  // Stagger on scroll — IntersectionObserver, 40ms cascade
  const prefersReduced =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReduced) {
    const staggerEls = document.querySelectorAll("[data-stagger]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const siblings = Array.from(
              el.parentElement?.querySelectorAll("[data-stagger]") || []
            );
            const index = siblings.indexOf(el);
            const delay = Math.min(index * 40, 200);
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add("is-visible");
            observer.unobserve(el);
          }
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.08 }
    );
    staggerEls.forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll("[data-stagger]").forEach((el) => {
      el.classList.add("is-visible");
    });
  }

  // Apply modal
  const applyBtn = document.getElementById("apply-btn");
  const modal = document.getElementById("apply-modal");
  const modalClose = document.getElementById("modal-close");
  const modalCancel = document.getElementById("modal-cancel");
  const modalDone = document.getElementById("modal-done");
  const applyForm = document.getElementById("apply-form");
  const modalSuccess = document.getElementById("modal-success");

  function openModal() {
    if (!modal) return;
    modal.hidden = false;
    modal.offsetHeight;
    modal.dataset.open = "true";
    document.body.style.overflow = "hidden";
    const firstInput = modal.querySelector("input");
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    if (!modal) return;
    delete modal.dataset.open;
    document.body.style.overflow = "";
    setTimeout(() => {
      modal.hidden = true;
      if (applyForm) applyForm.hidden = false;
      if (modalSuccess) modalSuccess.hidden = true;
      if (applyForm) applyForm.reset();
    }, 220);
  }

  if (applyBtn) applyBtn.addEventListener("click", openModal);
  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalCancel) modalCancel.addEventListener("click", closeModal);
  if (modalDone) modalDone.addEventListener("click", closeModal);

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.dataset.open === "true") {
      closeModal();
    }
  });

  if (applyForm) {
    applyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      applyForm.hidden = true;
      if (modalSuccess) modalSuccess.hidden = false;
    });
  }

  // Language toggle (visual only)
  const langToggle = document.getElementById("lang-toggle");
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      langToggle.textContent =
        langToggle.textContent === "EN" ? "中文" : "EN";
    });
  }
})();
