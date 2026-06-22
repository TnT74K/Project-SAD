fetch("/components/temp/header-with-profile-for-support.html")
.then(res => res.text())
.then(data => {

document.getElementById("header-placeholder").innerHTML = data;

initHeader();

});
