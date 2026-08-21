const searchData = key =>
    JSON.parse(localStorage.getItem(key)) || [];


/* START SEARCH */

function setupSearch() {

    const input = document.getElementById("visitorSearch");
    const button = document.getElementById("searchBtn");

    if (!input || !button) return;

    button.onclick = searchVisitor;

    input.onkeydown = e => {
        if (e.key === "Enter") {
            searchVisitor();
        }
    };
}


/* SEARCH VISITOR */

function searchVisitor() {

    const input = document.getElementById("visitorSearch");
    const table = document.getElementById("visitorTable");
    const message = document.getElementById("noResult");

    if (!input || !table || !message) return;

    const value = input.value.trim().toLowerCase();

    table.innerHTML = "";
    message.style.display = "none";

    if (!value) {
        message.textContent =
            "Please enter a name or phone number.";
        message.style.display = "block";
        return;
    }

    const visitors = searchData("vmsVisitors");

    const results = visitors.filter(visitor =>
        (visitor.fullName || "")
            .toLowerCase()
            .includes(value) ||
        (visitor.phone || "")
            .includes(value)
    );

    if (!results.length) {
        message.textContent = "No visitor found.";
        message.style.display = "block";
        return;
    }

    results.forEach(visitor => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${visitor.fullName}</td>
            <td>${visitor.phone}</td>
            <td>${visitor.gender || "-"}</td>
            <td>${visitor.email || "-"}</td>

            <td>
                <button
                    class="action-btn"
                    onclick="searchVisitorAction(${visitor.id})">
                    ${searchGetAction(visitor.id)}
                </button>
            </td>
        `;

        table.appendChild(row);
    });
}


/* ACTION */

function searchGetAction(id) {

    const visits = searchData("vmsVisits");
    const appointments = searchData("vmsAppointments");

    const visit = visits.find(v =>
        v.visitorId == id
    );

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


/* VISITOR ACTION */

function searchVisitorAction(id) {

    const action = searchGetAction(id);

    const visitor = searchData("vmsVisitors")
        .find(v => v.id == id);

    if (!visitor) return;


    if (action === "Book Appointment") {

        localStorage.setItem(
            "appointmentVisitor",
            JSON.stringify(visitor)
        );

        loadPage("appointment booking.html");

        return;
    }


    if (action === "Check In") {

        searchCheckIn(id);

        return;
    }


    if (action === "Check Out") {

        searchCheckOut(id);

        return;
    }
}


/* CHECK IN */

function searchCheckIn(id) {

    const visitor = searchData("vmsVisitors")
        .find(v => v.id == id);

    if (!visitor) return;

    const visits = searchData("vmsVisits");

    visits.push({

        id: Date.now(),

        visitorId: id,

        visitorName: visitor.fullName,

        host: searchGetHost(id),

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


/* CHECK OUT */

function searchCheckOut(id) {

    const visits = searchData("vmsVisits");

    const visit = visits.find(v =>
        v.visitorId == id &&
        v.status === "Checked In"
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


/* HOST */

function searchGetHost(id) {

    const appointment = searchData("vmsAppointments")
        .find(a =>
            a.visitorId == id &&
            a.status === "Approved"
        );

    return appointment
        ? appointment.host
        : "Walk-in";
}