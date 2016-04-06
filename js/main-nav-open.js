var link = document.querySelector(".main-nav-btn");
var popup = document.querySelector(".main-nav");


popup.classList.add("main-nav--hide");

link.addEventListener("click", function(event) {
  event.preventDefault();
  popup.classList.toggle("main-nav--hide");
  link.classList.toggle("main-nav-btn--close");
});
