console.log("Cubics Landing carregada!");

document.addEventListener("DOMContentLoaded", () => {
  
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
  const provarBtns = Array.from(document.querySelectorAll("a")).filter(a => 
    a.textContent.includes("Provar Cubics") || a.textContent.includes("Probar Cubics")
  );

  provarBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault(); 
      if (proximamentModal) proximamentModal.classList.remove("hidden");
    });
  });

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