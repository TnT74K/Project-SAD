fetch("/components/header-with-profile.html")
    .then(res => res.text())
    .then(data => {

        document.getElementById("header-placeholder").innerHTML = data;

        initHeader();

    });
