fetch("../../components/header-with-profile-for-admin.html")
.then(res => res.text())
.then(data => {

document.getElementById("header-placeholder").innerHTML = data;

initHeader();

});
