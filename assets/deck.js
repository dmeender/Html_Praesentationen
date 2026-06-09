(function () {
  const slides = document.querySelector("[data-deck]") || document.querySelector("#slides");

  if (!slides) {
    return;
  }

  const slideItems = Array.from(slides.querySelectorAll(".slide"));
  const stepState = new Map(slideItems.map((slide) => [slide, 0]));
  const status = document.querySelector("[data-deck-status]");
  const navLinks = Array.from(document.querySelectorAll(".deck-nav a"));

  document.body.classList.add("deck-ready");

  function isEditableTarget(target) {
    return target.closest("input, textarea, select, button, [contenteditable='true']");
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

  document.addEventListener("keydown", (event) => {
    if (isEditableTarget(event.target)) {
      return;
    }

    if (event.shiftKey && event.key.toLowerCase() === "n") {
      event.preventDefault();
      toggleNotes();
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
    });
  });

  let scrollFrame = null;
  slides.addEventListener("scroll", () => {
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = window.requestAnimationFrame(renderDeck);
  });

  renderDeck();
})();
