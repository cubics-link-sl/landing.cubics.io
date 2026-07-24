console.log("Cubics Landing carregada!");

document.addEventListener("DOMContentLoaded", () => {

  // -------------------------------
  // EMAILJS INIT (la llibreria es carrega amb defer abans d'aquest fitxer)
  // -------------------------------
  if (window.emailjs) {
    emailjs.init("ll7i7SW43K4dNWyWh");
  }

  // -------------------------------
  // HEADER RESPONSIVE
  // -------------------------------
  const menuBtn = document.getElementById('mobile-menu-button');
  const navMenu = document.getElementById('nav-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('hidden');
      navMenu.classList.toggle('flex');
      menuIcon.classList.toggle('hidden');
      closeIcon.classList.toggle('hidden');
    });
  }

  // -------------------------------
  // SELECTOR DE PERFIL (Proveïdors / Clients)
  // -------------------------------
  const roleTabs = document.querySelectorAll("[data-role-tab]");
  const rolePanels = document.querySelectorAll("[data-role-panel]");

  roleTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const role = tab.dataset.roleTab;

      roleTabs.forEach((t) => {
        t.classList.toggle("active", t === tab);
        t.setAttribute("aria-selected", t === tab ? "true" : "false");
      });

      rolePanels.forEach((panel) => {
        const show = panel.dataset.rolePanel === role;
        panel.classList.toggle("hidden", !show);
        if (show) {
          // reinicia l'animació d'entrada de les cartes
          panel.classList.remove("animate");
          void panel.offsetWidth;
          panel.classList.add("animate");
        }
      });
    });
  });

  // -------------------------------
  // BARALLA DE CARTES (deck): mostra les funcionalitats d'una en una
  // -------------------------------
  document.querySelectorAll("[data-deck]").forEach((deck) => {
    const cards = Array.from(deck.querySelectorAll(".deck-card"));
    if (cards.length < 2) return;

    let index = 0;
    let timer = null;

    // Controls (fletxes + puntets), generats aquí per no duplicar HTML
    const controls = document.createElement("div");
    controls.className = "deck-controls";

    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "deck-arrow";
    prevBtn.setAttribute("aria-label", "Anterior");
    prevBtn.innerHTML =
      '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>';

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "deck-arrow";
    nextBtn.setAttribute("aria-label", "Següent");
    nextBtn.innerHTML =
      '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>';

    const dotsBox = document.createElement("div");
    dotsBox.className = "deck-dots";
    const dots = cards.map((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "deck-dot";
      dot.setAttribute("aria-label", "Carta " + (i + 1));
      dot.addEventListener("click", () => {
        goTo(i);
        restartAutoplay();
      });
      dotsBox.appendChild(dot);
      return dot;
    });

    controls.append(prevBtn, dotsBox, nextBtn);
    deck.after(controls);

    function render() {
      cards.forEach((card, i) => {
        const pos = (i - index + cards.length) % cards.length;
        card.classList.toggle("is-active", pos === 0);
        card.classList.toggle("is-behind-1", pos === 1);
        card.classList.toggle("is-behind-2", pos >= 2);
      });
      dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    }

    function goTo(i) {
      index = (i + cards.length) % cards.length;
      render();
    }

    function restartAutoplay() {
      clearInterval(timer);
      timer = setInterval(() => goTo(index + 1), 5000);
    }

    prevBtn.addEventListener("click", () => {
      goTo(index - 1);
      restartAutoplay();
    });
    nextBtn.addEventListener("click", () => {
      goTo(index + 1);
      restartAutoplay();
    });

    // Pausa l'autoplay mentre el cursor és sobre la carta
    deck.addEventListener("mouseenter", () => clearInterval(timer));
    deck.addEventListener("mouseleave", restartAutoplay);

    render();
    restartAutoplay();
  });

  // -------------------------------
  // LIGHTBOX: clic a una captura per veure-la gran
  // -------------------------------
  document.querySelectorAll(".deck-card-media img").forEach((img) => {
    img.addEventListener("click", () => {
      const overlay = document.createElement("div");
      overlay.className = "lightbox";

      const big = document.createElement("img");
      big.src = img.src;
      big.alt = img.alt;
      overlay.appendChild(big);

      function close() {
        overlay.remove();
        document.removeEventListener("keydown", onKey);
      }
      function onKey(e) {
        if (e.key === "Escape") close();
      }

      overlay.addEventListener("click", close);
      document.addEventListener("keydown", onKey);
      document.body.appendChild(overlay);
    });
  });

  // -------------------------------
  // Animacions feature-block
  // -------------------------------
  const blocks = document.querySelectorAll(".feature-block");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  blocks.forEach((block) => observer.observe(block));

  // -------------------------------
  // VIDEO MODAL FUNCTIONALITY
  // -------------------------------
  const videoModal = document.getElementById("video-modal");
  const videoIframe = document.getElementById("video-iframe");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const modalTitle = document.getElementById("modal-title");
  const demoButtons = document.querySelectorAll(".demo-btn");

  const videoSources = {
    "demo-providers": "https://www.youtube.com/embed/dQw4w9WgXcQ", 
    "demo-clients": "https://www.youtube.com/embed/dQw4w9WgXcQ"
  };

  const videoTitles = {
    "demo-providers": "Demo - Com a proveïdors del sector",
    "demo-clients": "Demo - Com a clients del sector"
  };

  demoButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const videoId = btn.getAttribute("data-video-id");
      const videoUrl = videoSources[videoId];
      const title = videoTitles[videoId];

      if (videoUrl) {
        videoIframe.src = videoUrl;
        modalTitle.textContent = title;
        videoModal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
      }
    });
  });

  function closeModal() {
    if (videoModal) {
      videoModal.classList.add("hidden");
      videoIframe.src = "";
      document.body.style.overflow = "auto";
    }
  }

  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
  if (videoModal) {
    videoModal.addEventListener("click", (e) => {
      if (e.target === videoModal) closeModal();
    });
  }

  // -------------------------------
  // MODAL PROXIMITAT (PRÒXIMAMENT)
  // -------------------------------
  const proximamentModal = document.getElementById("proximament-modal");
  const closeProximamentBtn = document.getElementById("proximament-close-modal-btn");

  // DEFINICIÓ DE LA VARIABLE QUE DONAVA ERROR:
  // const provarBtns = Array.from(document.querySelectorAll("a")).filter(a => 
  //   a.textContent.includes("Provar Cubics") || a.textContent.includes("Probar Cubics")
  // );

  // provarBtns.forEach(btn => {
  //   btn.addEventListener("click", (e) => {
  //     e.preventDefault(); 
  //     if (proximamentModal) proximamentModal.classList.remove("hidden");
  //   });
  // });

  if (closeProximamentBtn) {
    closeProximamentBtn.addEventListener("click", () => {
      proximamentModal.classList.add("hidden");
    });
  }

  if (proximamentModal) {
    proximamentModal.addEventListener("click", (e) => {
      if (e.target === proximamentModal) proximamentModal.classList.add("hidden");
    });
  }

  // -------------------------------
  // EMAILJS + VALIDACIÓ FORMULARI
  // -------------------------------
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");

  if (form) {
    const nameInput = document.getElementById("name");
    const companyInput = document.getElementById("company");
    const emailInput = document.getElementById("email");

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      
      let valid = true;
      if (!nameInput.value.trim()) { valid = false; nameInput.classList.add("border-red-500"); }
      if (!companyInput.value.trim()) { valid = false; companyInput.classList.add("border-red-500"); }
      if (!isValidEmail(emailInput.value.trim())) { valid = false; emailInput.classList.add("border-red-500"); }

      if (!valid) {
        statusEl.textContent = "Si us plau, omple els camps correctament.";
        statusEl.className = "text-sm text-center mt-2 text-red-500";
        return;
      }

      statusEl.textContent = "Enviant sol·licitud...";
      
      emailjs.sendForm("service_fc5qwrn", "template_jwxwlgy", this)
        .then(() => {
          statusEl.textContent = "Sol·licitud enviada correctament ✔️";
          statusEl.className = "text-sm text-center mt-2 text-green-600";
          form.reset();
        })
        .catch((error) => {
          statusEl.textContent = "Error en enviar ❌";
          statusEl.className = "text-sm text-center mt-2 text-red-500";
        });
    });
  }
});