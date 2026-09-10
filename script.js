document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const setFallbackImage = (img) => {
    const brand = img.closest(".brand") || img.closest(".footer-brand");
    const targetText = img.getAttribute("data-fallback-text");

    if (!brand) {
      return;
    }

    const fallbackText = brand.querySelector(".brand-text, .footer-title");
    if (fallbackText) {
      fallbackText.textContent = targetText || fallbackText.textContent;
    }
  };

  document.querySelectorAll("img[data-fallback-text]").forEach((img) => {
    img.addEventListener("error", () => {
      img.style.display = "none";
      setFallbackImage(img);
    });
  });

  document.querySelectorAll(".pcb-image").forEach((img) => {
    img.addEventListener("error", () => {
      img.style.display = "none";
      const fallback = img.parentElement.querySelector(".image-fallback");
      if (fallback) {
        fallback.classList.add("is-visible");
      }
    });
  });

  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.getElementById("site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if (reducedMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const videos = document.querySelectorAll(".media-video");
  videos.forEach((video) => {
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "true");
    video.setAttribute("playsinline", "true");

    const toggle = video.closest(".media-frame")?.querySelector(".video-toggle");
    if (toggle) {
      toggle.addEventListener("click", () => {
        if (video.paused) {
          video.play().catch(() => {});
          toggle.textContent = "Pause";
        } else {
          video.pause();
          toggle.textContent = "Play";
        }
      });
    }
  });

  if ("IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          const toggle = video.closest(".media-frame")?.querySelector(".video-toggle");

          if (entry.isIntersecting) {
            if (reducedMotion) {
              video.pause();
              if (toggle) {
                toggle.classList.add("is-visible");
                toggle.textContent = "Play";
              }
              return;
            }

            video.play().catch(() => {});
            if (toggle) {
              toggle.classList.add("is-visible");
              toggle.textContent = "Pause";
            }
          } else {
            video.pause();
            if (toggle) {
              toggle.classList.add("is-visible");
              toggle.textContent = "Play";
            }
          }
        });
      },
      { threshold: 0.35 }
    );

    videos.forEach((video) => videoObserver.observe(video));
  }

  const copyButtons = document.querySelectorAll(".copy-button");
  const copyToast = document.getElementById("copy-toast");

  const showToast = () => {
    if (!copyToast) {
      return;
    }

    copyToast.classList.add("visible");
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => {
      copyToast.classList.remove("visible");
    }, 2200);
  };

  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.getAttribute("data-copy") || "heavy_rainingrain";

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
        } else {
          const helper = document.createElement("textarea");
          helper.value = value;
          helper.setAttribute("readonly", "");
          helper.style.position = "fixed";
          helper.style.top = "-9999px";
          document.body.appendChild(helper);
          helper.select();
          document.execCommand("copy");
          document.body.removeChild(helper);
        }

        showToast();
      } catch (error) {
        const fallbackText = document.createElement("p");
        fallbackText.textContent = "Discord username: heavy_rainingrain";
        fallbackText.setAttribute("role", "status");
        fallbackText.style.marginTop = "0.8rem";
        fallbackText.style.color = "var(--color-lavender-soft)";
        const target = button.parentElement;
        if (target && !target.querySelector(".copy-fallback")) {
          const wrapper = document.createElement("div");
          wrapper.className = "copy-fallback";
          wrapper.appendChild(fallbackText);
          target.appendChild(wrapper);
        }
      }
    });
  });
});
