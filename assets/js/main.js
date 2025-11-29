console.log("Cubics Landing carregada!");

document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------
  // Animacions feature-block
  // -------------------------------
  const blocks = document.querySelectorAll(".feature-block");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  blocks.forEach((block) => observer.observe(block));

  // -------------------------------
  // VIDEO MODAL FUNCTIONALITY
  // -------------------------------
  const videoModal = document.getElementById("video-modal");
  const videoIframe = document.getElementById("video-iframe");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const modalTitle = document.getElementById("modal-title");
  const demoButtons = document.querySelectorAll(".demo-btn");

  // URLs dels vídeos (canviar per les URLs reals dels vídeos)
  const videoSources = {
    "demo-providers": "https://www.youtube.com/embed/dQw4w9WgXcQ", // Canviar per URL real
    "demo-clients": "https://www.youtube.com/embed/dQw4w9WgXcQ"    // Canviar per URL real
  };

  const videoTitles = {
    "demo-providers": "Demo - Com a proveïdors del sector",
    "demo-clients": "Demo - Com a clients del sector"
  };

  // Obrir modal
  demoButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const videoId = btn.getAttribute("data-video-id");
      const videoUrl = videoSources[videoId];
      const title = videoTitles[videoId];

      if (videoUrl) {
        videoIframe.src = videoUrl;
        modalTitle.textContent = title;
        videoModal.classList.remove("hidden");
        document.body.style.overflow = "hidden"; // Evitar scroll
      }
    });
  });

  // Tancar modal
  function closeModal() {
    videoModal.classList.add("hidden");
    videoIframe.src = ""; // Parar el vídeo
    document.body.style.overflow = "auto"; // Restaurar scroll
  }

  closeModalBtn.addEventListener("click", closeModal);

  // Tancar modal al fer clic fora (en el fons negre)
  videoModal.addEventListener("click", (e) => {
    if (e.target === videoModal) {
      closeModal();
    }
  });

  // Tancar modal amb tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !videoModal.classList.contains("hidden")) {
      closeModal();
    }
  });

  // -------------------------------
  // VIDEO MODAL PROXIMITAT
  // -------------------------------
  const proximamentModal = document.getElementById("proximament-modal");
  const closeProximamentBtn = document.getElementById("proximament-close-modal-btn");

  // Tots els botons amb text "Provar Cubics"
  const provarBtns = Array.from(document.querySelectorAll("a"))
    .filter(a => a.textContent.includes("Provar Cubics") || a.textContent.includes("Probar Cubics"));

  // Obrir modal
  provarBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault(); // evita anar al link real
      proximamentModal.classList.remove("hidden");
    });
  });

  // Tancar modal
  closeProximamentBtn.addEventListener("click", () => {
    proximamentModal.classList.add("hidden");
  });

  // Tancar clicant fora
  proximamentModal.addEventListener("click", (e) => {
    if (e.target === proximamentModal) {
      proximamentModal.classList.add("hidden");
    }
  });


  // -------------------------------
  // EMAILJS + VALIDACIÓ FORMULARI
  // -------------------------------
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");

  if (!form) return;

  const nameInput = document.getElementById("name");
  const companyInput = document.getElementById("company");
  const emailInput = document.getElementById("email");

  function clearErrors() {
    [nameInput, companyInput, emailInput].forEach((input) => {
      input.classList.remove("border-red-500");
    });
    statusEl.textContent = "";
    statusEl.classList.remove("text-red-500", "text-green-600");
  }

  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function validateForm() {
    clearErrors();

    let valid = true;
    const name = nameInput.value.trim();
    const company = companyInput.value.trim();
    const email = emailInput.value.trim();

    if (!name) {
      valid = false;
      nameInput.classList.add("border-red-500");
    }

    if (!company) {
      valid = false;
      companyInput.classList.add("border-red-500");
    }

    if (!email || !isValidEmail(email)) {
      valid = false;
      emailInput.classList.add("border-red-500");
    }

    if (!valid) {
      statusEl.textContent =
        "Si us plau, omple tots els camps obligatoris i revisa el correu electrònic.";
      statusEl.classList.add("text-red-500");
    }

    return valid;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    statusEl.textContent = "Enviant sol·licitud...";
    statusEl.classList.remove("text-red-500");
    statusEl.classList.remove("text-green-600");

    emailjs
      .sendForm("service_fc5qwrn", "template_jwxwlgy", this)
      .then(() => {
        statusEl.textContent = "Sol·licitud enviada correctament ✔️";
        statusEl.classList.add("text-green-600");
        form.reset();
      })
      .catch((error) => {
        console.error(error);
        statusEl.textContent = "Hi ha hagut un error en enviar ❌";
        statusEl.classList.add("text-red-500");
      });
  });
});
