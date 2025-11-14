document.addEventListener('DOMContentLoaded', () => {
  const carouselContainer = document.querySelector('.carousel-container');
  const carouselItems = document.querySelectorAll('.carousel-item');
  const prevButton = document.querySelector('.carousel-btn.prev');
  const nextButton = document.querySelector('.carousel-btn.next');


  if (!carouselContainer || carouselItems.length === 0 || !prevButton || !nextButton) {
    return;
  }

  let currentIndex = 0;
  const totalItems = carouselItems.length;

  function updateCarousel() {

    if (!carouselItems[0]) return;
    const itemWidth = carouselItems[0].offsetWidth;
    carouselContainer.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
  }

  function moveCarousel(direction) {
    currentIndex += direction;
    if (currentIndex < 0) {
      currentIndex = totalItems - 1;
    } else if (currentIndex >= totalItems) {
      currentIndex = 0;
    }
    updateCarousel();
  }

  prevButton.addEventListener('click', () => moveCarousel(-1));
  nextButton.addEventListener('click', () => moveCarousel(1));

  window.addEventListener('resize', updateCarousel);


  window.addEventListener('load', () => {
    updateCarousel();

  });
});
function crearHuella() {
  const huella = document.createElement("div");
  huella.textContent = "🐾";
  huella.style.position = "fixed";
  huella.style.left = Math.random() * 100 + "vw"; 
  huella.style.bottom = "40px"; 
  huella.style.fontSize = Math.random() * 15 + 20 + "px"; 
  huella.style.opacity = "0.6";
  huella.style.pointerEvents = "none"; 
  huella.style.animation = "subir 10s linear forwards"; 
  document.body.appendChild(huella);

 console.log("gd")
  setTimeout(() => huella.remove(), 10000);
}


setInterval(crearHuella, 1000);
function mostrarFormulario(nombreFundacion, logoFundacion) {
  document.getElementById('fundacionNombre').value = nombreFundacion;
  document.getElementById('fundacion-nombre').textContent = nombreFundacion;
  document.getElementById('fundacion-logo').src = logoFundacion;

  document.getElementById('formulario-donacion').style.display = 'block';
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}
