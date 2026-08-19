// CHANGE PAGE
function showPage(pageId, button) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });

    document.getElementById(pageId)
        .classList.add("active-page");


    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");
}


// LOGOUT
function logout() {

    window.location.href = "../index.html";

}