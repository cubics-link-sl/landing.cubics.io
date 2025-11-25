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
