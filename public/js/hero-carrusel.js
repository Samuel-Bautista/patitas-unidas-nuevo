// 🎞️ Hero Carrusel - Patitas Unidas (versión auto-generada)
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  // ✅ Si no existe el contenedor de imágenes, lo creamos
  let carrusel = hero.querySelector(".hero-carrusel");
  if (!carrusel) {
    carrusel = document.createElement("div");
    carrusel.className = "hero-carrusel";
    hero.prepend(carrusel);
  }

  // 📸 Aquí defines las imágenes del carrusel
  const imagenes = [
    "https://images.pexels.com/photos/34311008/pexels-photo-34311008.jpeg",
    "https://images.pexels.com/photos/198162/pexels-photo-198162.jpeg",
    "https://images.pexels.com/photos/15644497/pexels-photo-15644497.jpeg",
    "https://images.pexels.com/photos/53261/pexels-photo-53261.jpeg",
    "https://images.pexels.com/photos/7474346/pexels-photo-7474346.jpeg"
  ];

  // Si quieres diferentes imágenes por página, cambia este arreglo
  // por otro desde cada HTML con un script antes de cargar este JS.

  // 🧩 Insertar imágenes dinámicamente
  imagenes.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `Imagen carrusel ${i + 1}`;
    if (i === 0) img.classList.add("active");
    carrusel.appendChild(img);
  });

  // 🎬 Lógica de rotación
  const heroImgs = carrusel.querySelectorAll("img");
  let heroIndex = 0;

  function cambiarHero() {
    heroImgs[heroIndex].classList.remove("active");
    heroIndex = (heroIndex + 1) % heroImgs.length;
    heroImgs[heroIndex].classList.add("active");
  }

  setInterval(cambiarHero, 6000);
});
