function initHeader(){

const header = document.getElementById("header");
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileMenu = document.getElementById("mobileMenu");

window.addEventListener("scroll", () => {

if(!header) return;

if (window.scrollY > 30) {
header.classList.add("scrolled");
}else{
header.classList.remove("scrolled");
}

});

if(hamburgerBtn && mobileMenu){

hamburgerBtn.addEventListener("click", () => {
mobileMenu.classList.toggle("open");
});

document.addEventListener("click", (e) => {

if(!header.contains(e.target)){
mobileMenu.classList.remove("open");
}

});

}

}



