options.dependencies = options.dependencies || [];

options.dependencies.push(
  // https://github.com/naamor/reveal.js-tableofcontents
  {
    src: window.location.href.includes("vvscode")
      ? "../_assets/plugins/tableofcontents.js"
      : "_assets/plugins/tableofcontents.js",
  }
);

// Полностью отключаем навигацию колесиком мыши
document.addEventListener("DOMContentLoaded", function () {
  // Перехватываем все события колесика мыши
  document.addEventListener(
    "wheel",
    function (e) {
      // Всегда останавливаем распространение события к reveal.js
      e.stopPropagation();
      e.stopImmediatePropagation();

      // Находим текущий активный слайд
      const currentSlide = document.querySelector(
        ".reveal .slides section.present"
      );
      if (currentSlide) {
        // Прокручиваем содержимое слайда
        currentSlide.scrollTop += e.deltaY;
      }
    },
    { capture: true, passive: false }
  );

  // Добавляем плавную прокрутку для всех слайдов
  const observer = new MutationObserver(function (mutations) {
    const slides = document.querySelectorAll(".reveal .slides section");
    slides.forEach((slide) => {
      slide.style.scrollBehavior = "smooth";
    });
  });

  // Наблюдаем за изменениями в DOM
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Применяем стили сразу
  setTimeout(() => {
    const slides = document.querySelectorAll(".reveal .slides section");
    slides.forEach((slide) => {
      slide.style.scrollBehavior = "smooth";
    });
  }, 1000);
});
