// Переключение между секциями
const menuItems = document.querySelectorAll(".menu li");
const sections = document.querySelectorAll("main section");

menuItems.forEach(item => {
  item.addEventListener("click", () => {
    const target = item.getAttribute("data-target");

    sections.forEach(sec => {
      sec.style.display = (sec.id === target) ? "block" : "none";
    });

    // Закрыть меню на мобилке
    document.querySelector(".menu").classList.remove("show");
  });
});

// Выпадающее меню
const toggleBtn = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

toggleBtn.addEventListener("click", () => {
  menu.classList.toggle("show");
});
