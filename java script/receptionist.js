/* =========================
   GET DATA
========================= */

function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}


/* =========================
   LOAD PAGES
========================= */

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


            /* Active sidebar button */

            document.querySelectorAll(".nav-btn")
                .forEach(btn =>
                    btn.classList.remove("active")
                );

            if (button) {
                button.classList.add("active");
            }


            /* Search Visitor */

            if (page === "search.html") {
                setupSearch();
            }


            /* Registration */

            if (page === "Registration.html") {
                setupRegistration();
            }


            /* Appointment Booking */

            if (page === "appointment booking.html") {
                setupAppointment();
            }


            /* Manage Appointments */

            if (page === "manage appointment.html") {
                setupManageAppointments();
            }


            /* Update dashboard */

            loadStats();
            loadActivities();

        })

        .catch(error => {
            console.log("Page loading error:", error);
        });
}


/* =========================
   DASHBOARD CARDS
========================= */

function loadStats() {

    const visitors = getData("vmsVisitors");
    const appointments = getData("vmsAppointments");
    const visits = getData("vmsVisits");


    const total =
        document.getElementById("totalVisitors");

    const pending =
        document.getElementById("pendingAppointments");

    const checkedIn =
        document.getElementById("checkedIn");

    const checkedOut =
        document.getElementById("checkedOut");


    if (total) {
        total.textContent = visitors.length;
    }


    if (pending) {
        pending.textContent =
            appointments.filter(
                a => a.status === "Pending"
            ).length;
    }


    if (checkedIn) {
        checkedIn.textContent =
            visits.filter(
                v => v.status === "Checked In"
            ).length;
    }


    if (checkedOut) {
        checkedOut.textContent =
            visits.filter(
                v => v.status === "Checked Out"
            ).length;
    }
}


/* =========================
   DASHBOARD ACTIVITIES
========================= */

function loadActivities() {

    const table =
        document.getElementById("activityTable");

    if (!table) return;


    const appointments =
        getData("vmsAppointments");


    table.innerHTML = "";


    if (!appointments.length) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    No appointments available
                </td>
            </tr>
        `;

        return;
    }


    /* Show ALL appointments */

    appointments.forEach(appointment => {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>
                ${appointment.visitorName}
            </td>

            <td>
                ${appointment.host}
            </td>

            <td>
                ${appointment.status}
            </td>

            <td>
                ${appointment.date}
            </td>

            <td>
                ${appointment.time}
            </td>
        `;


        table.appendChild(row);

    });
}
        

        


/* =========================
   LOGOUT
========================= */

function logout() {

    window.location.href =
        "../index.html";
}


/* =========================
   START DASHBOARD
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadStats();
        loadActivities();

    }
);