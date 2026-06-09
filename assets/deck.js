(function () {
  const slides = document.querySelector("[data-deck]") || document.querySelector("#slides");

  if (!slides) {
    return;
  }

  const slideItems = Array.from(slides.querySelectorAll(".slide"));
  const stepState = new Map(slideItems.map((slide) => [slide, 0]));
  const status = document.querySelector("[data-deck-status]");
  const nav = document.querySelector(".deck-nav");

  function ensureNavigationToggle() {
    if (!nav) {
      return null;
    }

    let shell = nav.closest(".deck-nav-shell");

    if (!shell) {
      shell = document.createElement("div");
      shell.className = "deck-nav-shell";
      nav.before(shell);
      shell.append(nav);
    }

    let toggle = shell.querySelector("[data-nav-toggle]");

    if (!toggle) {
      toggle = document.createElement("button");
      toggle.className = "deck-nav-toggle";
      toggle.type = "button";
      toggle.textContent = "...";
      toggle.setAttribute("aria-label", "Foliennavigation ein- oder ausklappen");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("data-nav-toggle", "");
      shell.prepend(toggle);
    }

    if (!nav.id) {
      nav.id = "deck-nav";
    }

    toggle.setAttribute("aria-controls", nav.id);
    return toggle;
  }

  const navToggle = ensureNavigationToggle();
  const navLinks = Array.from(document.querySelectorAll(".deck-nav a"));

  document.body.classList.add("deck-ready");
  document.body.classList.add("nav-collapsed");

  function isEditableTarget(target) {
    return target.closest("input, textarea, select, [contenteditable='true']");
  }

  function currentSlideIndex() {
    const slideWidth = slides.clientWidth || window.innerWidth;
    return Math.max(0, Math.min(slideItems.length - 1, Math.round(slides.scrollLeft / slideWidth)));
  }

  function currentSlide() {
    return slideItems[currentSlideIndex()];
  }

  function slideSteps(slide) {
    return Array.from(slide.querySelectorAll("[data-step]"));
  }

  function renderSteps(slide) {
    const visibleCount = stepState.get(slide) || 0;

    slideSteps(slide).forEach((step, index) => {
      step.classList.toggle("is-visible", index < visibleCount);
    });
  }

  function renderDeck() {
    const activeIndex = currentSlideIndex();

    slideItems.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === activeIndex);
      renderSteps(slide);
    });

    navLinks.forEach((link, index) => {
      link.classList.toggle("is-active", index === activeIndex);
      link.setAttribute("aria-current", index === activeIndex ? "step" : "false");
    });

    if (status) {
      const steps = slideSteps(slideItems[activeIndex]);
      const visible = stepState.get(slideItems[activeIndex]) || 0;
      const stepText = steps.length ? ` - Schritt ${visible}/${steps.length}` : "";
      status.textContent = `${activeIndex + 1}/${slideItems.length}${stepText}`;
    }
  }

  function goToSlide(index, options = {}) {
    const nextIndex = Math.max(0, Math.min(slideItems.length - 1, index));
    const nextSlide = slideItems[nextIndex];

    if (options.showAllSteps) {
      stepState.set(nextSlide, slideSteps(nextSlide).length);
    }

    nextSlide.scrollIntoView({ behavior: "smooth", inline: "start" });
    window.setTimeout(renderDeck, 120);
  }

  function next() {
    const slide = currentSlide();
    const steps = slideSteps(slide);
    const visible = stepState.get(slide) || 0;

    if (visible < steps.length) {
      stepState.set(slide, visible + 1);
      renderDeck();
      return;
    }

    goToSlide(currentSlideIndex() + 1);
  }

  function previous() {
    const slide = currentSlide();
    const visible = stepState.get(slide) || 0;

    if (visible > 0) {
      stepState.set(slide, visible - 1);
      renderDeck();
      return;
    }

    goToSlide(currentSlideIndex() - 1, { showAllSteps: true });
  }

  function toggleNotes() {
    document.body.classList.toggle("notes-visible");
  }

  function setNavigationCollapsed(collapsed) {
    document.body.classList.toggle("nav-collapsed", collapsed);

    if (navToggle) {
      navToggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
    }
  }

  function toggleNavigation() {
    setNavigationCollapsed(!document.body.classList.contains("nav-collapsed"));
  }

  document.addEventListener("keydown", (event) => {
    if (isEditableTarget(event.target)) {
      return;
    }

    if (event.shiftKey && event.key.toLowerCase() === "n") {
      event.preventDefault();
      toggleNotes();
      return;
    }

    if (event.shiftKey && event.key.toLowerCase() === "f") {
      event.preventDefault();
      toggleNavigation();
      return;
    }

    if (event.key === " " || event.key === "ArrowRight" || event.key === "PageDown") {
      event.preventDefault();
      next();
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      previous();
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      goToSlide(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      goToSlide(slideItems.length - 1);
    }
  });

  navLinks.forEach((link, index) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      goToSlide(index);
      setNavigationCollapsed(true);
    });
  });

  if (navToggle) {
    navToggle.addEventListener("click", toggleNavigation);
  }

  let scrollFrame = null;
  slides.addEventListener("scroll", () => {
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = window.requestAnimationFrame(renderDeck);
  });

  renderDeck();
})();
