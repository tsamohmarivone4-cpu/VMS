document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("visitorSearch");
    const searchBtn = document.getElementById("searchBtn");

    searchBtn.onclick = searchVisitor;

    searchInput.addEventListener("keypress", e => {
        if (e.key === "Enter") searchVisitor();
    });

});


function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}


function searchVisitor() {

    const value =
        document.getElementById("visitorSearch")
        .value.trim().toLowerCase();

    const table =
        document.getElementById("visitorTable");

    const noResult =
        document.getElementById("noResult");

    table.innerHTML = "";
    noResult.style.display = "none";


    if (!value) {
        noResult.textContent =
            "Please enter a name or phone number.";
        noResult.style.display = "block";
        return;
    }


    const visitors = getData("vmsVisitors");

    const results = visitors.filter(visitor =>

        (visitor.fullName || "")
            .toLowerCase()
            .includes(value)

        ||

        (visitor.phone || "")
            .includes(value)
    );


    if (!results.length) {
        noResult.textContent = "No visitor found.";
        noResult.style.display = "block";
        return;
    }


    results.forEach(visitor => {

        const id = visitor.id;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${visitor.fullName}</td>
            <td>${visitor.phone}</td>
            <td>${visitor.gender}</td>
            <td>${visitor.email || "-"}</td>
            <td>
                <button
                    class="action-btn"
                    onclick="visitorAction(${id})">
                    ${getAction(id)}
                </button>
            </td>
        `;

        table.appendChild(row);
    });
}


/* =========================
   GET ACTION
========================= */

function getAction(visitorId) {

    const appointments = getData("vmsAppointments");
    const visits = getData("vmsVisits");


    // Currently checked in
    const checkedIn = visits.find(visit =>
        visit.visitorId == visitorId &&
        visit.status === "Checked In"
    );

    if (checkedIn) {
        return "Check Out";
    }


    // Already completed
    const completed = visits.find(visit =>
        visit.visitorId == visitorId &&
        visit.status === "Checked Out"
    );

    if (completed) {
        return "Visit Completed";
    }


    // Approved appointment
    const approved = appointments.find(appointment =>
        appointment.visitorId == visitorId &&
        appointment.status === "Approved"
    );

    if (approved) {
        return "Check In";
    }


    // No approved appointment
    return "Book Appointment";
}


/* =========================
   ACTION BUTTON
========================= */

function visitorAction(visitorId) {

    const action = getAction(visitorId);


    if (action === "Book Appointment") {

        const visitor = getData("vmsVisitors")
            .find(visitor => visitor.id == visitorId);

        localStorage.setItem(
            "appointmentVisitor",
            JSON.stringify(visitor)
        );

        window.location.href =
            "appointment booking.html";

        return;
    }


    if (action === "Check In") {

        checkIn(visitorId);
        return;
    }


    if (action === "Check Out") {

        checkOut(visitorId);
        return;
    }
}


/* =========================
   CHECK IN
========================= */

function checkIn(visitorId) {

    const visitor = getData("vmsVisitors")
        .find(visitor => visitor.id == visitorId);

    const visits = getData("vmsVisits");

    visits.push({

        id: Date.now(),

        visitorId: visitor.id,

        visitorName: visitor.fullName,

        host: getHost(visitorId),

        date: new Date()
            .toISOString()
            .split("T")[0],

        checkInTime:
            new Date().toLocaleTimeString(),

        checkOutTime: "",

        status: "Checked In"

    });

    localStorage.setItem(
        "vmsVisits",
        JSON.stringify(visits)
    );

    searchVisitor();
}


/* =========================
   CHECK OUT
========================= */

function checkOut(visitorId) {

    const visits = getData("vmsVisits");

    const visit = visits.find(visit =>
        visit.visitorId == visitorId &&
        visit.status === "Checked In"
    );

    if (!visit) return;

    visit.status = "Checked Out";

    visit.checkOutTime =
        new Date().toLocaleTimeString();

    localStorage.setItem(
        "vmsVisits",
        JSON.stringify(visits)
    );

    searchVisitor();
}


/* =========================
   GET HOST
========================= */

function getHost(visitorId) {

    const appointments = getData("vmsAppointments");

    const appointment = appointments.find(
        appointment =>
            appointment.visitorId == visitorId &&
            appointment.status === "Approved"
    );

    return appointment
        ? appointment.host
        : "Walk-in";
}