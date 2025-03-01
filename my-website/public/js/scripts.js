document.addEventListener("DOMContentLoaded", function () {
  console.log("Script loaded!");
  const imageElement = document.querySelector(".photo img");
  const images = [
    "/images/huyandrew-3.png",
    "/images/huyandrew-4.png",
    "/images/huyandrew-5.png",
    "/images/huyandrew-6.png"
  ];
  let index = 0;

  function changeImage() {
    index = (index + 1) % images.length;
    const newImage = new Image(); // Tạo một đối tượng hình ảnh mới
    newImage.src = images[index];

    // Chờ ảnh tải xong rồi mới đổi ảnh hiển thị
    newImage.onload = () => {
      imageElement.style.transition = "opacity 0.8s ease-in-out";
      imageElement.style.opacity = "0"; 

      setTimeout(() => {
        imageElement.src = newImage.src;
        imageElement.style.opacity = "1";
      }, 600); // Giữ thời gian đồng bộ với transition
    };
  }

  setInterval(changeImage, 3000);

  
});




document.addEventListener("DOMContentLoaded", function () {
  let slides = document.querySelectorAll(".slide");
  let dotsContainer = document.querySelector(".dots");
  let nextBtn = document.querySelector(".next-btn");
  let currentSlide = 0;

  function showSlide(index) {
      slides.forEach((slide, i) => {
          slide.classList.toggle("active", i === index);
      });
      updateDots();
  }

  function updateDots() {
      let dots = document.querySelectorAll(".dot");
      dots.forEach((dot, i) => {
          dot.classList.toggle("active", i === currentSlide);
      });
  }

  function createDots() {
      slides.forEach((_, i) => {
          let dot = document.createElement("div");
          dot.classList.add("dot");
          dot.addEventListener("click", () => {
              currentSlide = i;
              showSlide(currentSlide);
          });
          dotsContainer.appendChild(dot);
      });
  }

  nextBtn.addEventListener("click", () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
  });

  createDots();
  showSlide(currentSlide);
});

document.addEventListener("DOMContentLoaded", function () {
  let slides = document.querySelectorAll(".slider");
  let currentIndex = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active");
      if (i === index) {
        slide.classList.add("active");
      }
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  setInterval(nextSlide, 2000);
});