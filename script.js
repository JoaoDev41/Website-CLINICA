document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  const setMenu = (isOpen) => {
    document.body.classList.toggle("menu-open", isOpen);
    mobileMenu.classList.toggle("is-open", isOpen);
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  };

  menuToggle.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

  window.addEventListener("scroll", () => header.classList.toggle("is-scrolled", window.scrollY > 60), { passive: true });

  if (!window.gsap || !window.ScrollTrigger) {
    document.querySelector(".page-loader")?.remove();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  let lenis;
  if (window.Lenis && !prefersReducedMotion) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 0.9 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const id = anchor.getAttribute("href");
      if (id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -90, duration: 1.25 });
      else target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  });

  if (prefersReducedMotion) {
    document.querySelector(".page-loader")?.remove();
    return;
  }

  const loadTl = gsap.timeline({ defaults: { ease: "power3.out" } });
  loadTl
    .to(".loader-mark", { scale: 1.15, duration: .5 })
    .to(".page-loader", { yPercent: -100, duration: .9, ease: "power4.inOut" })
    .from(".hero-title .line > span", { yPercent: 110, duration: 1.1, stagger: .1 }, "-=.35")
    .from(".hero-kicker, .hero-bottom", { opacity: 0, y: 24, duration: .8, stagger: .12 }, "-=.75")
    .set(".page-loader", { display: "none" });

  gsap.to(".hero-media img", {
    yPercent: 10,
    scale: 1.08,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
  });

  gsap.utils.toArray(".reveal-up").forEach((element) => {
    if (element.closest(".hero")) return;
    gsap.from(element, {
      y: 42,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: element, start: "top 88%", once: true }
    });
  });

  gsap.from(".reveal-card", {
    y: 70,
    opacity: 0,
    duration: 1,
    stagger: .13,
    ease: "power3.out",
    scrollTrigger: { trigger: ".values-grid", start: "top 82%", once: true }
  });

  const ribbonTrack = document.querySelector(".ribbon-track");
  if (ribbonTrack) {
    gsap.fromTo(ribbonTrack, { x: 0 }, {
      x: () => -Math.min(
        Math.max(0, ribbonTrack.scrollWidth - window.innerWidth),
        window.innerWidth * 1.15
      ),
      ease: "none",
      scrollTrigger: {
        trigger: ".about",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        invalidateOnRefresh: true
      }
    });
  }

  gsap.from(".service-card, .service-stat", {
    y: 90,
    opacity: 0,
    duration: 1.15,
    stagger: .1,
    ease: "power3.out",
    scrollTrigger: { trigger: ".services-grid", start: "top 82%", once: true }
  });

  const gallery = document.querySelector(".team-gallery");
  if (gallery) {
    gsap.fromTo(gallery, { x: 0 }, {
      x: () => Math.min(0, window.innerWidth - gallery.scrollWidth - 24),
      ease: "none",
      scrollTrigger: { trigger: ".team", start: "top 40%", end: "bottom top", scrub: 1, invalidateOnRefresh: true }
    });
  }

  gsap.from(".team-card", {
    y: 70,
    opacity: 0,
    duration: 1.1,
    stagger: .1,
    ease: "power3.out",
    scrollTrigger: { trigger: ".team-gallery", start: "top 88%", once: true }
  });

  gsap.to(".product-shell > img", {
    scale: 1.1,
    yPercent: 6,
    ease: "none",
    scrollTrigger: { trigger: ".product", start: "top bottom", end: "bottom top", scrub: true }
  });

  gsap.from(".contact-title .line > span", {
    yPercent: 110,
    duration: 1.15,
    stagger: .1,
    ease: "power4.out",
    scrollTrigger: { trigger: ".contact-title", start: "top 88%", once: true }
  });

  document.querySelectorAll(".service-card, .team-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      gsap.to(card, { rotateY: x * 2.2, rotateX: -y * 2.2, transformPerspective: 900, duration: .5 });
    });
    card.addEventListener("mouseleave", () => gsap.to(card, { rotateY: 0, rotateX: 0, duration: .7, ease: "power3.out" }));
  });
});
