(function () {
  "use strict";

  const TOPICS = [
    {
      label: "Brand Strategy",
      desc: "Positioning, narrative architecture, and launches that make brands impossible to ignore.",
    },
    {
      label: "Financial Modeling",
      desc: "Driver-based models, scenario planning, and decks built for investors and boards.",
    },
    {
      label: "Market Entry",
      desc: "Competitive mapping, partner selection, and phased roadmaps for new regions.",
    },
    {
      label: "Growth Consulting",
      desc: "GTM design, pricing, and cross-functional programs that turn strategy into revenue.",
    },
    {
      label: "Executive Workshops",
      desc: "Facilitation for leadership teams, with alignment, decisions, and momentum in one room.",
    },
  ];

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.add("is-ready");
    });
  });

  initTicker();
  initNav();
  initScrollReveal();
  initAbout();
  initWork();
  initInterests();
  initContact();

  function initNav() {
    const nav = document.getElementById("site-nav");
    const landing = document.getElementById("landing");
    const sectionLinks = document.querySelectorAll('.site-nav__link[href^="#"]:not([href="#landing"])');
    const headerOffset = 72;

    function updateNav() {
      if (!nav || !landing) return;
      nav.classList.toggle("is-solid", window.scrollY > landing.offsetHeight * 0.12);

      const scrollPos = window.scrollY + headerOffset + 100;
      let currentId = "";

      document.querySelectorAll("section[id]").forEach((section) => {
        if (scrollPos >= section.offsetTop) {
          currentId = section.id;
        }
      });

      sectionLinks.forEach((link) => {
        const href = link.getAttribute("href");
        link.classList.toggle("is-active", href === `#${currentId}`);
      });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const id = anchor.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: "smooth" });
      });
    });

    window.addEventListener("scroll", updateNav, { passive: true });
    updateNav();
  }

  function initScrollReveal() {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = document.querySelectorAll(".in-view");

    if (prefersReduced) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }

  function initAbout() {
    initAboutTabs();
    initAboutTilt();
    initAboutHighlights();
    initAboutCopy();
  }

  function initAboutTabs() {
    const tabs = document.querySelectorAll(".about-tab");
    const panels = document.querySelectorAll(".about-panel");
    const nav = document.querySelector(".about__note-nav");
    if (!tabs.length || !panels.length) return;

    function activate(tab) {
      const id = tab.dataset.tab;

      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle("is-active", on);
        t.classList.remove("is-hovered");
        t.setAttribute("aria-selected", on ? "true" : "false");
      });

      panels.forEach((panel) => {
        const match = panel.id === `panel-${id}`;
        if (match) {
          panel.hidden = false;
          panel.classList.remove("is-exit");
          requestAnimationFrame(() => panel.classList.add("is-active"));
        } else if (panel.classList.contains("is-active")) {
          panel.classList.remove("is-active");
          panel.classList.add("is-exit");
          setTimeout(() => {
            panel.hidden = true;
            panel.classList.remove("is-exit");
          }, 320);
        }
      });
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => activate(tab));
      tab.addEventListener("mouseenter", () => {
        tabs.forEach((t) => t.classList.toggle("is-hovered", t === tab));
      });
    });

    if (nav) {
      nav.addEventListener("mouseleave", () => {
        tabs.forEach((t) => t.classList.remove("is-hovered"));
      });
    }
  }

  function initAboutTilt() {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 16}deg) scale(1.03)`;
        card.classList.add("is-tilted");
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
        card.classList.remove("is-tilted");
      });
    });
  }

  function initAboutHighlights() {
    const tip = document.getElementById("about-tip");
    const defaultTip = "Hover highlighted words or tilt the cards.";
    const buttons = document.querySelectorAll(".about__highlight");

    buttons.forEach((btn) => {
      btn.addEventListener("mouseenter", () => {
        btn.classList.add("is-flipped");
        if (tip && btn.dataset.tip) {
          tip.textContent = btn.dataset.tip;
          tip.classList.add("is-active");
        }
      });
      btn.addEventListener("mouseleave", () => {
        btn.classList.remove("is-flipped");
        if (tip) {
          tip.textContent = defaultTip;
          tip.classList.remove("is-active");
        }
      });
    });
  }

  function initAboutCopy() {
    const tip = document.getElementById("about-tip");

    document.querySelectorAll("[data-copy]").forEach((card) => {
      card.addEventListener("click", async () => {
        const value = card.dataset.copy;
        if (!value) return;
        try {
          await navigator.clipboard.writeText(value);
        } catch (_) {
          /* fallback ignored */
        }
        card.classList.add("is-copied");
        if (tip) {
          tip.textContent = "Email copied to clipboard.";
          tip.classList.add("is-active");
        }
        setTimeout(() => {
          card.classList.remove("is-copied");
          if (tip) {
            tip.textContent = "Hover highlighted words or tilt the cards.";
            tip.classList.remove("is-active");
          }
        }, 2200);
      });
    });
  }

  const WORK_HINTS = {
    marketing: "Ditto, Tennis Club, Irvine Consulting Group & Blufin Sushi. Scroll the gallery, click to expand.",
    consulting: "Del Taco and Ditto AI strategy work. Hover case cards or client logos.",
    finance: "Internship experience: key models, analyses, and outcomes.",
  };

  function initWork() {
    initWorkFilter();
    initWorkGallery();
    initWorkLightbox();
    initWorkClientBubbles();
  }

  function initWorkFilter() {
    const filters = document.querySelectorAll(".work-filter");
    const panels = document.querySelectorAll(".work-panel");
    const track = document.getElementById("work-filter-track");
    const hint = document.getElementById("work-filter-hint");
    if (!filters.length) return;

    function moveTrack(btn) {
      if (!track) return;
      const filter = btn.closest(".work__filter");
      if (!filter) return;
      const filterRect = filter.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      track.style.width = `${btnRect.width}px`;
      track.style.height = `${btnRect.height}px`;
      track.style.transform = `translate(${btnRect.left - filterRect.left}px, ${btnRect.top - filterRect.top}px)`;
    }

    function animatePanel(panel) {
      panel.querySelectorAll(".in-view, .work-post, .work-case, .work-internship, .work-panel__lead, .work-clients-bubble, .work-client").forEach((el) => {
        el.classList.remove("work-animate");
        void el.offsetWidth;
        el.classList.add("work-animate");
      });
    }

    function setHint(key) {
      if (!hint || !WORK_HINTS[key]) return;
      hint.classList.add("is-changing");
      setTimeout(() => {
        hint.textContent = WORK_HINTS[key];
        hint.classList.remove("is-changing");
      }, 200);
    }

    function setClientBubble(key) {
      const wrap = document.getElementById("work-clients-bubbles");
      if (!wrap) return;
      const show = key === "marketing" || key === "consulting";
      wrap.hidden = !show;
      wrap.querySelectorAll("[data-work-bubble]").forEach((bubble) => {
        const on = bubble.dataset.workBubble === key;
        bubble.hidden = !on;
        bubble.classList.toggle("is-visible", on);
      });
    }

    function activate(btn) {
      const key = btn.dataset.work;

      setClientBubble(key);

      filters.forEach((f) => {
        const on = f === btn;
        f.classList.toggle("is-active", on);
        f.setAttribute("aria-selected", on ? "true" : "false");
      });

      moveTrack(btn);
      setHint(key);

      panels.forEach((panel) => {
        const match = panel.id === `work-${key}`;
        panel.classList.toggle("is-active", match);
        panel.hidden = !match;
        if (match) animatePanel(panel);
      });
    }

    filters.forEach((btn) => btn.addEventListener("click", () => activate(btn)));

    const active = document.querySelector(".work-filter.is-active");
    if (active) {
      setClientBubble(active.dataset.work);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => moveTrack(active));
      });
      window.addEventListener("resize", () => {
        const current = document.querySelector(".work-filter.is-active");
        if (current) moveTrack(current);
      });
    }
  }

  function initWorkClientBubbles() {
    document.querySelectorAll(".work-clients-bubble").forEach((bubble) => {
      const label = bubble.querySelector(".work-clients-bubble__name");
      const clients = bubble.querySelectorAll(".work-client");
      const defaultLabel = "Hover a logo";

      function setLabel(text) {
        if (!label) return;
        label.classList.add("is-changing");
        window.setTimeout(() => {
          label.textContent = text;
          label.classList.remove("is-changing");
        }, 160);
      }

      clients.forEach((btn) => {
        btn.addEventListener("mouseenter", () => {
          clients.forEach((c) => c.classList.remove("is-active"));
          btn.classList.add("is-active");
          bubble.classList.add("is-live");
          setLabel(btn.dataset.name || defaultLabel);
        });

        btn.addEventListener("focus", () => {
          clients.forEach((c) => c.classList.remove("is-active"));
          btn.classList.add("is-active");
          bubble.classList.add("is-live");
          setLabel(btn.dataset.name || defaultLabel);
        });
      });

      bubble.addEventListener("mouseleave", () => {
        clients.forEach((c) => c.classList.remove("is-active"));
        bubble.classList.remove("is-live");
        setLabel(defaultLabel);
      });

      bubble.addEventListener("focusout", (e) => {
        if (bubble.contains(e.relatedTarget)) return;
        clients.forEach((c) => c.classList.remove("is-active"));
        bubble.classList.remove("is-live");
        setLabel(defaultLabel);
      });
    });
  }

  function initWorkGallery() {
    const gallery = document.getElementById("work-gallery");
    if (!gallery) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    gallery.addEventListener("mousedown", (e) => {
      if (e.target.closest(".work-post__open")) return;
      isDown = true;
      gallery.classList.add("is-dragging");
      startX = e.pageX - gallery.offsetLeft;
      scrollLeft = gallery.scrollLeft;
    });

    gallery.addEventListener("mouseleave", () => {
      isDown = false;
      gallery.classList.remove("is-dragging");
    });

    gallery.addEventListener("mouseup", () => {
      isDown = false;
      gallery.classList.remove("is-dragging");
    });

    gallery.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - gallery.offsetLeft;
      gallery.scrollLeft = scrollLeft - (x - startX) * 1.2;
    });

    gallery.querySelectorAll(".work-post").forEach((post) => {
      post.addEventListener("mouseenter", () => {
        gallery.querySelectorAll(".work-post").forEach((p) => p.classList.remove("is-spotlight"));
        post.classList.add("is-spotlight");
      });
      post.addEventListener("mouseleave", () => post.classList.remove("is-spotlight"));
    });
  }

  function initWorkLightbox() {
    const lightbox = document.getElementById("work-lightbox");
    const img = document.getElementById("work-lightbox-img");
    const caption = document.getElementById("work-lightbox-caption");
    if (!lightbox || !img) return;

    function open(src, text) {
      img.src = src;
      img.alt = text || "Expanded social post";
      if (caption) caption.textContent = text || "";
      lightbox.hidden = false;
      lightbox.setAttribute("aria-hidden", "false");
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
      const closeBtn = document.getElementById("work-lightbox-close");
      if (closeBtn) requestAnimationFrame(() => closeBtn.focus({ preventScroll: true }));
    }

    function close() {
      lightbox.classList.remove("is-open");
      lightbox.hidden = true;
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      img.src = "";
    }

    document.querySelectorAll(".work-post__open").forEach((btn) => {
      btn.addEventListener("click", () => {
        const figure = btn.closest(".work-post");
        const cap = figure?.dataset.caption || "";
        const src = btn.dataset.full || btn.querySelector("img")?.src || "";
        open(src, cap);
      });
    });

    lightbox.querySelectorAll("[data-close]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        close();
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) close();
    });
  }

  function initInterests() {
    const section = document.getElementById("interests");
    const arena = document.getElementById("interests-arena");
    const orbs = document.querySelectorAll(".interest-orb");
    const shuffleBtn = document.getElementById("interests-shuffle");
    const hint = document.getElementById("interests-hint");
    const spotlight = document.getElementById("interests-spotlight");
    const imgEl = document.getElementById("interests-spotlight-img");
    const labelEl = document.getElementById("interests-spotlight-label");
    const nameEl = document.getElementById("interests-spotlight-name");
    const descEl = document.getElementById("interests-spotlight-desc");
    const canvas = document.getElementById("interests-particles");

    if (!section || !orbs.length || !spotlight) return;

    let activeOrb = null;
    let particles = [];
    let particleFrame = null;

    function selectOrb(orb, burst = true) {
      if (!orb) return;

      orbs.forEach((o) => o.classList.remove("is-active"));
      orb.classList.add("is-active");
      activeOrb = orb;

      const title = orb.dataset.title || "";
      const desc = orb.dataset.desc || "";
      const img = orb.dataset.img || orb.querySelector("img")?.src || "";

      spotlight.classList.add("is-hot");
      arena?.classList.add("is-wiggle");

      imgEl.classList.add("is-swapping");
      nameEl.classList.add("is-swapping");
      descEl.classList.add("is-swapping");

      setTimeout(() => {
        imgEl.src = img;
        imgEl.alt = title;
        imgEl.classList.remove(
          "is-crop-skiing",
          "is-crop-catan",
          "is-crop-broadway",
          "is-crop-tennis",
          "is-crop-hiking"
        );
        if (orb.classList.contains("interest-orb--skiing")) {
          imgEl.classList.add("is-crop-skiing");
        } else if (orb.classList.contains("interest-orb--catan")) {
          imgEl.classList.add("is-crop-catan");
        } else if (orb.classList.contains("interest-orb--broadway")) {
          imgEl.classList.add("is-crop-broadway");
        } else if (orb.classList.contains("interest-orb--tennis")) {
          imgEl.classList.add("is-crop-tennis");
        } else if (orb.classList.contains("interest-orb--hiking")) {
          imgEl.classList.add("is-crop-hiking");
        }
        labelEl.textContent = "Currently obsessed with";
        nameEl.textContent = title;
        descEl.textContent = desc;
        imgEl.classList.remove("is-swapping");
        nameEl.classList.remove("is-swapping");
        descEl.classList.remove("is-swapping");
      }, 220);

      setTimeout(() => {
        spotlight.classList.remove("is-hot");
        arena?.classList.remove("is-wiggle");
      }, 700);

      if (burst) spawnBurst(orb);
      if (hint) hint.textContent = `${title}. Click another orb or shuffle`;
    }

    orbs.forEach((orb) => {
      orb.addEventListener("click", () => selectOrb(orb, true));
      orb.addEventListener("mouseenter", () => {
        if (!activeOrb) {
          labelEl.textContent = "Peek";
          nameEl.textContent = orb.dataset.title || "";
          descEl.textContent = "Click to lock in ✦";
        }
      });
    });

    if (shuffleBtn) {
      shuffleBtn.addEventListener("click", () => {
        shuffleBtn.classList.add("is-spinning");
        setTimeout(() => shuffleBtn.classList.remove("is-spinning"), 500);

        let pick = orbs[Math.floor(Math.random() * orbs.length)];
        while (pick === activeOrb && orbs.length > 1) {
          pick = orbs[Math.floor(Math.random() * orbs.length)];
        }
        selectOrb(pick, true);
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add("in-view-ready");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(section);

    if (arena && window.matchMedia("(hover: hover)").matches) {
      arena.addEventListener("mousemove", (e) => {
        const rect = arena.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        arena.classList.add("is-live");
        orbs.forEach((orb) => {
          const factor = 10;
          orb.style.translate = `${x * factor}px ${y * factor}px`;
        });
        spotlight.style.translate = `${x * -6}px ${y * -6}px`;
      });
      arena.addEventListener("mouseleave", () => {
        arena.classList.remove("is-live");
        orbs.forEach((orb) => {
          orb.style.translate = "";
        });
        spotlight.style.translate = "";
        if (!activeOrb) {
          labelEl.textContent = "Pick an interest";
          nameEl.textContent = "Your orbit awaits";
          descEl.textContent =
            "Every orb is something I actually do, not a filler hobby list. Tap one to see the story.";
        }
      });
    }

    function initParticles() {
      if (!canvas || !arena) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      function resize() {
        const rect = arena.getBoundingClientRect();
        canvas.width = rect.width * devicePixelRatio;
        canvas.height = rect.height * devicePixelRatio;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      }

      resize();
      window.addEventListener("resize", resize);

      function getSize() {
        return arena.getBoundingClientRect();
      }

      let size = getSize();

      for (let i = 0; i < 24; i++) {
        particles.push({
          x: Math.random() * size.width,
          y: Math.random() * size.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2 + 0.5,
          a: Math.random() * 0.25 + 0.05,
        });
      }

      function draw() {
        size = getSize();
        const w = size.width;
        const h = size.height;
        ctx.clearRect(0, 0, w, h);
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${p.a})`;
          ctx.fill();
        });
        particleFrame = requestAnimationFrame(draw);
      }

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!prefersReduced) draw();
    }

    function spawnBurst(orb) {
      if (!canvas) return;
      const rect = arena.getBoundingClientRect();
      const orbRect = orb.getBoundingClientRect();
      const cx = orbRect.left + orbRect.width / 2 - rect.left;
      const cy = orbRect.top + orbRect.height / 2 - rect.top;

      for (let i = 0; i < 14; i++) {
        const angle = (Math.PI * 2 * i) / 14;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * (2 + Math.random() * 2),
          vy: Math.sin(angle) * (2 + Math.random() * 2),
          r: Math.random() * 3 + 1,
          a: 0.7,
          life: 40,
        });
      }

      if (particles.length > 80) particles = particles.slice(-50);
    }

    initParticles();

    const particleLoop = () => {
      particles.forEach((p) => {
        if (p.life != null) {
          p.life -= 1;
          p.a *= 0.92;
          p.x += p.vx;
          p.y += p.vy;
        }
      });
      particles = particles.filter((p) => p.life == null || p.life > 0);
      requestAnimationFrame(particleLoop);
    };
    particleLoop();
  }

  function initContact() {
    const toast = document.getElementById("contact-toast");
    const emailCards = document.querySelectorAll("[data-copy]");
    if (!toast || !emailCards.length) return;

    function showToast(message) {
      toast.textContent = message;
      toast.hidden = false;
      toast.classList.remove("is-hidden");
      setTimeout(() => {
        toast.hidden = true;
      }, 1700);
    }

    emailCards.forEach((card) => {
      card.addEventListener("click", async () => {
        const value = card.getAttribute("data-copy") || "";
        if (!value) return;
        try {
          await navigator.clipboard.writeText(value);
          showToast("Email copied.");
        } catch (_) {
          // Fallback: best effort
          try {
            const range = document.createRange();
            range.selectNodeContents(card);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand("copy");
            showToast("Email copied.");
            selection.removeAllRanges();
          } catch (e) {
            showToast("Could not copy. Please copy manually.");
          }
        }
      });
    });

    const resumeLink = document.querySelector(".contact-card--resume");
    if (resumeLink) {
      resumeLink.addEventListener("click", async (e) => {
        const href = resumeLink.getAttribute("href") || "";
        if (!href) return;

        // Prevent a jarring 404 experience by checking existence first.
        e.preventDefault();
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 1800);

          const res = await fetch(href, { method: "HEAD", signal: controller.signal });
          clearTimeout(timeout);

          if (!res.ok) {
            showToast("Add your resume PDF at assets/resume.pdf.");
            return;
          }

          // File exists: allow the browser to handle the download.
          window.location.href = href;
        } catch (_) {
          showToast("Add your resume PDF at assets/resume.pdf.");
        }
      });
    }
  }

  function initTicker() {
    const track = document.getElementById("ticker-track");
    const bar = document.getElementById("ticker-bar");
    const previewText = document.getElementById("ticker-preview-text");

    if (!track || !bar || !previewText) return;

    [...TOPICS, ...TOPICS].forEach((topic, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ticker__item";
      btn.textContent = topic.label;
      btn.dataset.desc = topic.desc;
      btn.dataset.topicIndex = String(i % TOPICS.length);
      track.appendChild(btn);
    });

    let offset = 0;
    let velocity = -0.55;
    let isPaused = false;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartOffset = 0;
    let dragMoved = false;
    let loopWidth = 0;
    let lastTime = performance.now();
    let pointerId = null;

    function measureLoop() {
      const items = track.querySelectorAll(".ticker__item");
      if (items.length < TOPICS.length * 2) return;
      loopWidth = items[TOPICS.length].offsetLeft - items[0].offsetLeft;
    }

    function wrapOffset() {
      if (loopWidth <= 0) return;
      while (offset <= -loopWidth) offset += loopWidth;
      while (offset > 0) offset -= loopWidth;
    }

    function setPreview(text) {
      previewText.classList.add("is-changing");
      setTimeout(() => {
        previewText.textContent = text;
        previewText.classList.remove("is-changing");
      }, 180);
    }

    function setActive(index) {
      track.querySelectorAll(".ticker__item").forEach((btn) => {
        btn.classList.toggle("is-active", Number(btn.dataset.topicIndex) === index);
      });
      setPreview(TOPICS[index].desc);
      isPaused = true;
      bar.classList.add("is-paused");
    }

    function tick(now) {
      const dt = Math.min(now - lastTime, 32);
      lastTime = now;

      if (!isPaused && !isDragging && loopWidth > 0) {
        offset += velocity * (dt / 16);
        wrapOffset();
      }

      track.style.transform = `translate3d(${offset}px, 0, 0)`;
      requestAnimationFrame(tick);
    }

    measureLoop();
    window.addEventListener("resize", measureLoop);
    requestAnimationFrame(tick);

    const defaultPreview = "Drag, hover, or click a topic";

    bar.addEventListener("mouseenter", () => {
      if (!isDragging) {
        isPaused = true;
        bar.classList.add("is-paused");
      }
    });

    bar.addEventListener("mouseover", (e) => {
      const btn = e.target.closest(".ticker__item");
      if (!btn || isDragging) return;
      previewText.textContent = TOPICS[Number(btn.dataset.topicIndex)].desc;
    });

    bar.addEventListener("mouseleave", () => {
      if (!isDragging) {
        isPaused = false;
        bar.classList.remove("is-paused", "is-dragging");
        track.querySelectorAll(".ticker__item.is-active").forEach((b) => b.classList.remove("is-active"));
        previewText.textContent = defaultPreview;
      }
    });

    bar.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      isDragging = true;
      dragMoved = false;
      dragStartX = e.clientX;
      dragStartOffset = offset;
      pointerId = e.pointerId;
      isPaused = true;
      bar.classList.add("is-dragging", "is-paused");
      bar.setPointerCapture(pointerId);
    });

    bar.addEventListener("pointermove", (e) => {
      if (!isDragging || e.pointerId !== pointerId) return;
      const dx = e.clientX - dragStartX;
      if (Math.abs(dx) > 4) dragMoved = true;
      offset = dragStartOffset + dx;
      wrapOffset();
      velocity = Math.max(-2.5, Math.min(2.5, dx * 0.06));
    });

    function endPointer(e) {
      if (!isDragging || e.pointerId !== pointerId) return;
      isDragging = false;
      bar.classList.remove("is-dragging");
      bar.releasePointerCapture(pointerId);
      pointerId = null;

      if (!dragMoved) {
        const btn = e.target.closest(".ticker__item");
        if (btn) {
          setActive(Number(btn.dataset.topicIndex));
          return;
        }
      }

      velocity = Math.sign(velocity) * Math.max(0.55, Math.abs(velocity));
      if (!bar.matches(":hover")) {
        isPaused = false;
        bar.classList.remove("is-paused");
      }
    }

    bar.addEventListener("pointerup", endPointer);
    bar.addEventListener("pointercancel", endPointer);
  }
})();
