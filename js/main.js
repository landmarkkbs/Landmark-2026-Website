/* =========================================================================
   Franklin Kitchen & Bath — site interactions
   - Header scroll state + mobile drawer
   - IntersectionObserver scroll reveals
   - Active nav link
   - Contact form submission
   - Footer year
   ========================================================================= */

(function () {
  "use strict";

  /* --------- Header scroll state --------- */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 12) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const menuBtn = header.querySelector(".menu-btn");
    if (menuBtn) {
      menuBtn.addEventListener("click", () => {
        const open = header.classList.toggle("menu-open");
        menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.style.overflow = open ? "hidden" : "";
      });

      // Close drawer when navigating
      header.querySelectorAll(".nav-mobile a, .mobile-cta a").forEach((a) => {
        a.addEventListener("click", () => {
          header.classList.remove("menu-open");
          menuBtn.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        });
      });
    }
  }

  /* --------- Active nav link --------- */
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const file = path.split("/").pop();
  document.querySelectorAll(".nav-desktop a, .nav-mobile a").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href) return;
    const isHome = (file === "" || file === "index.html") && (href === "index.html" || href === "/");
    const isActive = href === file || (href === "services.html" && file && file.startsWith("services"));
    if (isHome || isActive) a.classList.add("active");
  });

  /* --------- Reveal on scroll --------- */
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-zoom");

  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.dataset.delay;
            if (delay) el.style.transitionDelay = delay + "ms";
            el.classList.add("is-visible");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* --------- Contact form --------- */
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const card = form.closest(".form-card");
      if (!card) return;
      card.innerHTML =
        '<div class="form-success">' +
          '<div class="check">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
          '</div>' +
          '<h3>Thank you.</h3>' +
          '<p>We&rsquo;ve received your message and will be in touch within one business day.</p>' +
        '</div>';
    });
  }

  /* --------- Footer year --------- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();


document.querySelectorAll("[data-slider]").forEach((slider) => {
  const slides = slider.querySelectorAll(".service-slide");
  const dots = slider.querySelectorAll(".dot");
  const prevBtn = slider.querySelector(".prev");
  const nextBtn = slider.querySelector(".next");

  if (!slides.length) return;

  let current = 0;
  let interval;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    current = index;
  }

  function nextSlide() {
    const next = (current + 1) % slides.length;
    showSlide(next);
  }

  function prevSlide() {
    const prev = (current - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  function startAutoPlay() {
    interval = setInterval(nextSlide, 4500);
  }

  function stopAutoPlay() {
    clearInterval(interval);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      stopAutoPlay();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      stopAutoPlay();
      startAutoPlay();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      stopAutoPlay();
      startAutoPlay();
    });
  });

  slider.addEventListener("mouseenter", stopAutoPlay);
  slider.addEventListener("mouseleave", startAutoPlay);

  showSlide(0);
  startAutoPlay();
});

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const submitBtn = document.getElementById("contact-submit-btn");

if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    formStatus.className = "form-status";
    formStatus.textContent = "";

    if (!contactForm.checkValidity()) {
      formStatus.classList.add("is-error");
      formStatus.textContent = "Please complete the required fields before submitting the form.";
      contactForm.reportValidity();
      return;
    }

    submitBtn.classList.add("is-loading");
    submitBtn.textContent = "Sending...";

    try {
      const formData = new FormData(contactForm);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        formStatus.classList.add("is-success");
        formStatus.textContent = "Thank you. Your message has been sent successfully. We’ll be in touch soon.";
        contactForm.reset();
      } else {
        formStatus.classList.add("is-error");
        formStatus.textContent = result.message || "Something went wrong. Please try again.";
      }
    } catch (error) {
      formStatus.classList.add("is-error");
      formStatus.textContent = "There was a problem sending your message. Please try again in a moment.";
    } finally {
      submitBtn.classList.remove("is-loading");
      submitBtn.textContent = "Send Message";
    }
  });
}

const showroomAssembleScene = document.getElementById('showroomAssembleScene');

if (showroomAssembleScene) {
  const showroomObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          showroomAssembleScene.classList.add('is-assembled');
        } else if (entry.boundingClientRect.top > 0) {
          showroomAssembleScene.classList.remove('is-assembled');
        }
      });
    },
    {
      threshold: 0.30,
      rootMargin: '0px 0px -10% 0px'
    }
  );

  showroomObserver.observe(showroomAssembleScene);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
});