fetch("../Html/Footer.html")
.then(res => res.text())
.then(data => {

document.getElementById("footer-placeholder").innerHTML = data;

});
