function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}


/* load pages+
 */
function loadPage(page, button = null) {

    fetch(page)
        .then(response => response.text())
        .then(data => {

            document.getElementById("pageContent").innerHTML = data;

            document.querySelectorAll(".nav-btn")
                .forEach(btn => btn.classList.remove("active"));

            if (button) {
                button.classList.add("active");
            }

            /* start search page */
            if (page === "search.html") {
                setupSearch();
            }

            /* start appointment pade */
            if (page === "appointment booking.html") {
                setupAppointment();
            }

            loadStats();
        })
        .catch(error => console.log(error));
}


/* search */
function setupSearch() {

    const input = document.getElementById("visitorSearch");
    const button = document.getElementById("searchBtn");

    if (!input || !button) {
        console.log("Search elements not found");
        return;
    }

    button.onclick = searchVisitor;

    input.onkeydown = function(e) {
        if (e.key === "Enter") {
            searchVisitor();
        }
    };
}


function searchVisitor() {

    const input = document.getElementById("visitorSearch");
    const table = document.getElementById("visitorTable");
    const message = document.getElementById("noResult");

    const value = input.value.trim().toLowerCase();

    table.innerHTML = "";
    message.style.display = "none";

    if (!value) {
        message.textContent =
            "Please enter a name or phone number.";

        message.style.display = "block";
        return;
    }

    const visitors = getData("vmsVisitors").filter(visitor =>
        (visitor.fullName || "").toLowerCase().includes(value) ||
        (visitor.phone || "").includes(value)
    );

    if (visitors.length === 0) {

        message.textContent = "No visitor found.";
        message.style.display = "block";

        return;
    }

    visitors.forEach(visitor => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${visitor.fullName}</td>
            <td>${visitor.phone}</td>
            <td>${visitor.gender || "-"}</td>
            <td>${visitor.email || "-"}</td>

            <td>
                <button onclick="visitorAction(${visitor.id})">
                    ${getAction(visitor.id)}
                </button>
            </td>
        `;

        table.appendChild(row);
    });
}


/* ation button */
function getAction(id) {

    const visits = getData("vmsVisits");
    const appointments = getData("vmsAppointments");

    const visit = visits.find(v => v.visitorId == id);

    if (visit && visit.status === "Checked In") {
        return "Check Out";
    }

    if (visit && visit.status === "Checked Out") {
        return "Visit Completed";
    }

    const approved = appointments.some(a =>
        a.visitorId == id &&
        a.status === "Approved"
    );

    if (approved) {
        return "Check In";
    }

    return "Book Appointment";
}


/* action */
function visitorAction(id) {

    const action = getAction(id);

    const visitor = getData("vmsVisitors")
        .find(v => v.id == id);

    if (!visitor) return;


    /* book appointment */
    if (action === "Book Appointment") {

        localStorage.setItem(
            "appointmentVisitor",
            JSON.stringify(visitor)
        );

        loadPage("appointment booking.html");

        return;
    }


    /* check-in */
    if (action === "Check In") {

        checkIn(id);

        return;
    }


    /* check-out */
    if (action === "Check Out") {

        checkOut(id);

        return;
    }
}


/* appointment */

function setupAppointment() {

    const visitor = JSON.parse(
        localStorage.getItem("appointmentVisitor")
    );

    const visitorName =
        document.getElementById("visitorName");

    const hostSelect =
        document.getElementById("host");

    const form =
        document.getElementById("appointmentForm");


    if (!form) return;


    /* show visitor name */

    if (visitor) {

        visitorName.textContent =
            visitor.fullName;

    } else {

        visitorName.textContent =
            "No visitor selected";
    }


    /* load host */

    const users = getData("vmsUsers");

    users
        .filter(user =>
            user.role &&
            user.role.toLowerCase() === "host"
        )
        .forEach(user => {

            const option =
                document.createElement("option");

            option.value =
                user.fullName;

            option.textContent =
                user.fullName;

            hostSelect.appendChild(option);
        });


    /* submit appointment */

    form.onsubmit = function(e) {

        e.preventDefault();


        if (!visitor) {

            alert("No visitor selected.");

            return;
        }


        const appointments =
            getData("vmsAppointments");


        appointments.push({

            id: Date.now(),

            visitorId: visitor.id,

            visitorName: visitor.fullName,

            phone: visitor.phone,

            email: visitor.email,

            gender: visitor.gender,

            host: hostSelect.value,

            purpose:
                document.getElementById("purpose").value,

            date:
                document.getElementById("appointmentDate").value,

            time:
                document.getElementById("appointmentTime").value,

            status: "Pending"
        });


        localStorage.setItem(
            "vmsAppointments",
            JSON.stringify(appointments)
        );


        document.getElementById("message").textContent =
            "Appointment booked successfully!";


        localStorage.removeItem(
            "appointmentVisitor"
        );


        setTimeout(function() {

            loadPage("search.html");

        }, 1000);
    };


    /* cancel */

    const cancel =
        document.getElementById("cancel");


    if (cancel) {

        cancel.onclick = function() {

            localStorage.removeItem(
                "appointmentVisitor"
            );

            loadPage("search.html");
        };
    }
}


/* check-in */
function checkIn(id) {

    const visitor = getData("vmsVisitors")
        .find(v => v.id == id);

    if (!visitor) return;

    const visits = getData("vmsVisits");

    visits.push({

        id: Date.now(),

        visitorId: id,

        visitorName:
            visitor.fullName,

        host:
            getHost(id),

        date:
            new Date()
                .toISOString()
                .split("T")[0],

        checkInTime:
            new Date()
                .toLocaleTimeString(),

        checkOutTime: "",

        status: "Checked In"
    });


    localStorage.setItem(
        "vmsVisits",
        JSON.stringify(visits)
    );


    searchVisitor();

    loadStats();
}


/* check-out */
function checkOut(id) {

    const visits =
        getData("vmsVisits");


    const visit =
        visits.find(v =>
            v.visitorId == id &&
            v.status === "Checked In"
        );


    if (!visit) return;


    visit.status = "Checked Out";

    visit.checkOutTime =
        new Date()
        .toLocaleTimeString();


    localStorage.setItem(
        "vmsVisits",
        JSON.stringify(visits)
    );


    searchVisitor();

    loadStats();
}


/* get host*/
function getHost(id) {

    const appointments =
        getData("vmsAppointments");


    const appointment =
        appointments.find(a =>
            a.visitorId == id &&
            a.status === "Approved"
        );


    return appointment
        ? appointment.host
        : "Walk-in";
}


/* dashboard cards*/
function loadStats() {

    const visitors =
        getData("vmsVisitors");

    const appointments =
        getData("vmsAppointments");

    const visits =
        getData("vmsVisits");


    const total =
        document.getElementById("totalVisitors");

    const pending =
        document.getElementById("pendingAppointments");

    const checkedIn =
        document.getElementById("checkedIn");

    const checkedOut =
        document.getElementById("checkedOut");


    if (total)
        total.textContent =
            visitors.length;


    if (pending)
        pending.textContent =
            appointments.filter(
                a => a.status === "Pending"
            ).length;


    if (checkedIn)
        checkedIn.textContent =
            visits.filter(
                v => v.status === "Checked In"
            ).length;


    if (checkedOut)
        checkedOut.textContent =
            visits.filter(
                v => v.status === "Checked Out"
            ).length;
}


/* logut */
function logout() {

    window.location.href =
        "../index.html";
}


document.addEventListener(
    "DOMContentLoaded",
    loadStats
);