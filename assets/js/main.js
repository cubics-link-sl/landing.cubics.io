// Aquí pots afegir interaccions si vols (obrir finestres, animacions, etc.)

console.log("Cubics Landing carregada!");

document.addEventListener("DOMContentLoaded", () => {
  const blocks = document.querySelectorAll(".feature-block");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Si no vols que torni a amagar-se al pujar, unobserve:
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2, // 20% del bloc visible
    }
  );

  blocks.forEach((block) => observer.observe(block));
});
