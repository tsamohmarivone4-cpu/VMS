document.addEventListener("DOMContentLoaded", () => {

    const panels = [
        "dashboardPanel",
        "checkInPanel",
        "checkOutPanel",
        "searchPanel",
        "appointmentPanel",
        "registerPanel"
    ];

    function show(id) {
        panels.forEach(p => {
            document.getElementById(p).style.display = "none";
        });

        document.getElementById(id).style.display = "block";
    }

    function data(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }


    // SIDEBAR
    dashboardLink.onclick = e => {
        e.preventDefault();
        show("dashboardPanel");
        stats();
    };

    searchVisitorLink.onclick = e => {
        e.preventDefault();
        show("searchPanel");
    };

    appointmentLink.onclick = e => {
        e.preventDefault();
        show("appointmentPanel");
        appointments();
    };

    checkInLink.onclick = e => {
        e.preventDefault();
        show("checkInPanel");
        setDate("checkIn");
    };

    checkOutLink.onclick = e => {
        e.preventDefault();
        show("checkOutPanel");
        setDate("checkOut");
    };


    // DATE & TIME
    function setDate(type) {
        const now = new Date();

        document.getElementById(type + "Date").value =
            now.toISOString().split("T")[0];

        document.getElementById(type + "Time").value =
            now.toTimeString().slice(0, 5);
    }


    // SEARCH VISITOR
    searchVisitorBtn.onclick = () => {

        const text = visitorSearch.value.toLowerCase().trim();

        const visitors = data("vmsVisitors");

        const found = visitors.filter(v =>
            v.fullName.toLowerCase().includes(text) ||
            v.phone.includes(text)
        );

        searchResults.innerHTML = found.length
            ? found.map(v => `
                <div class="visitor-result">
                    <h3>${v.fullName}</h3>
                    <p>${v.phone}</p>

                    <button onclick='book(${JSON.stringify(v)})'>
                        Book Appointment
                    </button>

                    <button onclick='select(${JSON.stringify(v)},"checkIn")'>
                        Check-In
                    </button>

                    <button onclick='select(${JSON.stringify(v)},"checkOut")'>
                        Check-Out
                    </button>
                </div>
            `).join("")
            : "<p>Visitor not found.</p>";
    };


    // BOOK APPOINTMENT
    window.book = visitor => {
        localStorage.setItem(
            "appointmentVisitor",
            JSON.stringify(visitor)
        );

        location.href = "appointment booking.html";
    };


    // SELECT VISITOR
    window.select = (visitor, type) => {

        localStorage.setItem(
            "selectedVisitor",
            JSON.stringify(visitor)
        );

        show(type + "Panel");
        setDate(type);
    };


    // CHECK-IN / CHECK-OUT
    function updateStatus(type) {

        const visitor =
            JSON.parse(localStorage.getItem("selectedVisitor"));

        if (!visitor) {
            alert("Please select a visitor first.");
            return;
        }

        const visitors = data("vmsVisitors");

        const i = visitors.findIndex(v => v.id === visitor.id);

        if (i === -1) {
            alert("Visitor not found.");
            return;
        }

        visitors[i].status =
            type === "checkIn" ? "Checked In" : "Checked Out";

        visitors[i][type + "Date"] =
            document.getElementById(type + "Date").value;

        visitors[i][type + "Time"] =
            document.getElementById(type + "Time").value;

        localStorage.setItem(
            "vmsVisitors",
            JSON.stringify(visitors)
        );

        localStorage.removeItem("selectedVisitor");

        alert(
            type === "checkIn"
                ? "Visitor checked in successfully."
                : "Visitor checked out successfully."
        );

        show("dashboardPanel");
        stats();
    }


    checkInForm.onsubmit = e => {
        e.preventDefault();
        updateStatus("checkIn");
    };

    checkOutForm.onsubmit = e => {
        e.preventDefault();
        updateStatus("checkOut");
    };


    // DASHBOARD STATS
    function stats() {

        const visitors = data("vmsVisitors");
        const appointments = data("vmsAppointments");

        totalVisitors.textContent = visitors.length;

        pendingAppointments.textContent =
            appointments.filter(a => a.status === "Pending").length;

        checkedIn.textContent =
            visitors.filter(v => v.status === "Checked In").length;

        checkedOut.textContent =
            visitors.filter(v => v.status === "Checked Out").length;
    }


    // APPOINTMENTS
    function appointments() {

        const list = data("vmsAppointments");

        appointmentContent.innerHTML = list.length
            ? list.map(a => `
                <p>
                    <strong>${a.visitorName}</strong>
                    - ${a.host}
                    - ${a.purpose}
                    - ${a.date} ${a.time}
                    - ${a.status}
                </p>
            `).join("")
            : "<p>No appointments found.</p>";
    }


    // START
    show("dashboardPanel");
    stats();

});logoutLink.onclick = () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "../login.html";
};