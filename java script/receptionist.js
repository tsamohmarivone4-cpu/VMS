function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}


function loadPage(page, button = null) {

    fetch(page)
        .then(response => {

            if (!response.ok) {
                throw new Error("Could not load " + page);
            }

            return response.text();
        })

        .then(data => {

            document.getElementById("pageContent").innerHTML = data;


            if (page === "search.html") {
                setupSearch();
            }


            if (page === "Registration.html") {
                setupRegistration();
            }


            if (page === "appointment booking.html") {
                setupAppointment();
            }

        })

        .catch(error => {
            console.log("Page loading error:", error);
        });


    document.querySelectorAll(".nav-btn")
        .forEach(btn => btn.classList.remove("active"));

    if (button) {
        button.classList.add("active");
    }
}


/* dashboard statistics */

function loadStats() {

    const visitors = getData("vmsVisitors");
    const appointments = getData("vmsAppointments");
    const visits = getData("vmsVisits");


    const totalVisitors =
        document.getElementById("totalVisitors");

    const pendingAppointments =
        document.getElementById("pendingAppointments");

    const checkedIn =
        document.getElementById("checkedIn");

    const checkedOut =
        document.getElementById("checkedOut");


    if (totalVisitors) {
        totalVisitors.textContent = visitors.length;
    }


    if (pendingAppointments) {

        pendingAppointments.textContent =
            appointments.filter(a =>
                a.status === "Pending"
            ).length;

    }


    if (checkedIn) {

        checkedIn.textContent =
            visits.filter(v =>
                v.status === "Checked In"
            ).length;

    }


    if (checkedOut) {

        checkedOut.textContent =
            visits.filter(v =>
                v.status === "Checked Out"
            ).length;

    }
}


/* s */

document.addEventListener("DOMContentLoaded", function () {

    loadStats();

});


/* logout function */

function logout() {

    window.location.href = "../index.html";

}