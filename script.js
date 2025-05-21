// Показ/скрытие секций
const menuItems = document.querySelectorAll(".menu li");
const sections = document.querySelectorAll("main section");

menuItems.forEach(item => {
  item.addEventListener("click", () => {
    const target = item.getAttribute("data-target");
    sections.forEach(sec => {
      sec.style.display = (sec.id === target) ? "block" : "none";
    });

    // Скрываем меню на мобильных
    document.querySelector(".menu").classList.remove("show");
  });
});

// Меню для мобильного
document.querySelector(".menu-toggle").addEventListener("click", () => {
  document.querySelector(".menu").classList.toggle("show");
});
