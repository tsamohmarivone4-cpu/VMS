// SEARCH VISITOR
function searchVisitor() {

    const text = $("visitorSearch").value.toLowerCase().trim();
    const visitors = data("vmsVisitors");

    const results = visitors.filter(v =>
        (v.fullName || "").toLowerCase().includes(text) ||
        (v.phone || "").includes(text)
    );

    $("searchResults").innerHTML = results.length
        ? results.map(v => `
            <div class="visitor-result">

                <h3>${v.fullName}</h3>

                <p>Phone: ${v.phone}</p>

                <p>Email: ${v.email || "-"}</p>

                <button onclick="visitorAction(${v.id})">
                    ${getAction(v.id)}
                </button>

            </div>
        `).join("")
        : "<p>Visitor not found.</p>";
}


// GET ACTION
function getAction(id) {

    const visits = data("vmsVisits");
    const appointments = data("vmsAppointments");

    const visit = visits.find(v => v.visitorId == id);

    if (visit?.status === "Checked In")
        return "Check Out";

    if (visit?.status === "Checked Out")
        return "Visit Completed";

    if (appointments.some(a =>
        a.visitorId == id &&
        a.status === "Approved"
    ))
        return "Check In";

    return "Book Appointment";
}


// ACTION
window.visitorAction = function(id) {

    const action = getAction(id);

    const visitor = data("vmsVisitors")
        .find(v => v.id == id);

    if (!visitor) return;

    if (action === "Book Appointment") {

        localStorage.setItem(
            "appointmentVisitor",
            JSON.stringify(visitor)
        );

        window.location.href = "appointment booking.html";
    }

    else if (action === "Check In") {
        checkVisitorIn(id);
    }

    else if (action === "Check Out") {
        checkVisitorOut(id);
    }
};


// CHECK IN
function checkVisitorIn(id) {

    let visitors = data("vmsVisitors");

    const visitor = visitors.find(v => v.id == id);

    if (!visitor) return;

    visitor.status = "Checked In";
    visitor.checkInDate =
        new Date().toISOString().split("T")[0];
    visitor.checkInTime =
        new Date().toLocaleTimeString();

    save("vmsVisitors", visitors);

    alert("Visitor checked in successfully.");

    searchVisitor();
    stats();
}


// CHECK OUT
function checkVisitorOut(id) {

    let visitors = data("vmsVisitors");

    const visitor = visitors.find(v => v.id == id);

    if (!visitor) return;

    visitor.status = "Checked Out";
    visitor.checkOutDate =
        new Date().toISOString().split("T")[0];
    visitor.checkOutTime =
        new Date().toLocaleTimeString();

    save("vmsVisitors", visitors);

    alert("Visitor checked out successfully.");

    searchVisitor();
    stats();
}


$("searchVisitorBtn").onclick = searchVisitor;

$("visitorSearch").onkeydown = e => {
    if (e.key === "Enter") searchVisitor();
};