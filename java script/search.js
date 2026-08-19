 

const getData = key =>
    JSON.parse(localStorage.getItem(key)) || [];

function setupSearch() {

    const input = document.getElementById("visitorSearch");
    const button = document.getElementById("searchBtn");

    if (!input || !button) return;

    button.onclick = searchVisitor;

    input.onkeydown = e => {
        if (e.key === "Enter") searchVisitor();
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
        message.textContent = "Please enter a name or phone number.";
        message.style.display = "block";
        return;
    }

    const visitors = getData("vmsVisitors").filter(v =>
        (v.fullName || "").toLowerCase().includes(value) ||
        (v.phone || "").includes(value)
    );

    if (!visitors.length) {
        message.textContent = "No visitor found.";
        message.style.display = "block";
        return;
    }

    visitors.forEach(v => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${v.fullName}</td>
            <td>${v.phone}</td>
            <td>${v.gender}</td>
            <td>${v.email || "-"}</td>
            <td>
                <button onclick="visitorAction(${v.id})">
                    ${getAction(v.id)}
                </button>
            </td>
        `;

        table.appendChild(row);
    });
}


function getAction(id) {

    const visits = getData("vmsVisits");
    const appointments = getData("vmsAppointments");

    const visit = visits.find(v =>
        v.visitorId == id
    );

    if (visit?.status === "Checked In")
        return "Check Out";

    if (visit?.status === "Checked Out")
        return "Visit Completed";

    if (
        appointments.some(a =>
            a.visitorId == id &&
            a.status === "Approved"
        )
    )
        return "Check In";

    return "Book Appointment";
}


function visitorAction(id) {

    const action = getAction(id);

    const visitor = getData("vmsVisitors")
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
        checkIn(id);
        return;
    }

    if (action === "Check Out") {
        checkOut(id);
    }
}


function checkIn(id) {

    const visitor = getData("vmsVisitors")
        .find(v => v.id == id);

    if (!visitor) return;

    const visits = getData("vmsVisits");

    visits.push({
        id: Date.now(),
        visitorId: id,
        visitorName: visitor.fullName,
        host: getHost(id),
        date: new Date().toISOString().split("T")[0],
        checkInTime: new Date().toLocaleTimeString(),
        checkOutTime: "",
        status: "Checked In"
    });

    localStorage.setItem(
        "vmsVisits",
        JSON.stringify(visits)
    );

    searchVisitor();
}


function checkOut(id) {

    const visits = getData("vmsVisits");

    const visit = visits.find(v =>
        v.visitorId == id &&
        v.status === "Checked In"
    );

    if (!visit) return;

    visit.status = "Checked Out";
    visit.checkOutTime = new Date().toLocaleTimeString();

    localStorage.setItem(
        "vmsVisits",
        JSON.stringify(visits)
    );

    searchVisitor();
}


function getHost(id) {

    const appointment = getData("vmsAppointments")
        .find(a =>
            a.visitorId == id &&
            a.status === "Approved"
        );

    return appointment ? appointment.host : "Walk-in";
}