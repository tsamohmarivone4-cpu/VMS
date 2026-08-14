
// HOST DASHBOARD

const currentUser =
    JSON.parse(localStorage.getItem("currentUser"));

let appointments =
    JSON.parse(localStorage.getItem("vmsAppointments")) || [];


// Show section
function showSection(section) {

    const content = document.getElementById("mainContent");

    if (section === "overview") {
        content.innerHTML = `
            <h2>Overview</h2>

            <div class="cards">
                <div class="card">
                    <h3>Pending</h3>
                    <p>${getAppointments("Pending").length}</p>
                </div>

                <div class="card">
                    <h3>Approved</h3>
                    <p>${getAppointments("Approved").length}</p>
                </div>

                <div class="card">
                    <h3>Current Visitors</h3>
                    <p>${getCurrent().length}</p>
                </div>

                <div class="card">
                    <h3>Completed</h3>
                    <p>${getCompleted().length}</p>
                </div>
            </div>

            <h2>Pending Appointments</h2>
            <div id="appointmentList"></div>
        `;

        display(getAppointments("Pending"), "appointmentList");
    }

    else if (section === "pending") {
        content.innerHTML = `
            <h2>Pending Appointments</h2>
            <div id="appointmentList"></div>
        `;

        display(getAppointments("Pending"), "appointmentList");
    }

    else if (section === "approved") {
        content.innerHTML = `
            <h2>Approved Appointments</h2>
            <div id="appointmentList"></div>
        `;

        display(getAppointments("Approved"), "appointmentList");
    }

    else if (section === "rejected") {
        content.innerHTML = `
            <h2>Rejected Appointments</h2>
            <div id="appointmentList"></div>
        `;

        display(getAppointments("Rejected"), "appointmentList");
    }

    else if (section === "current") {
        content.innerHTML = `
            <h2>Current Visitors</h2>
            <div id="appointmentList"></div>
        `;

        display(getCurrent(), "appointmentList");
    }

    else if (section === "completed") {
        content.innerHTML = `
            <h2>Completed Visits</h2>
            <div id="appointmentList"></div>
        `;

        display(getCompleted(), "appointmentList");
    }
}


// Get appointments belonging to this Host
function myAppointments() {

    if (!currentUser) return [];

    return appointments.filter(a =>
        a.host === currentUser.fullName ||
        a.host === currentUser.username
    );
}


// Filter by status
function getAppointments(status) {

    return myAppointments().filter(a =>
        a.status === status
    );
}


// Current visitors
function getCurrent() {

    return myAppointments().filter(a =>
        a.status === "Checked In"
    );
}


// Completed visits
function getCompleted() {

    return myAppointments().filter(a =>
        a.status === "Checked Out"
    );
}


// Display appointments
function display(data, element) {

    const box = document.getElementById(element);

    if (!data.length) {
        box.innerHTML = "<p>No appointments found.</p>";
        return;
    }

    box.innerHTML = data.map(a => `
        <div class="appointment">

            <h3>${a.visitorName}</h3>

            <p>Purpose: ${a.purpose}</p>
            <p>Date: ${a.date}</p>
            <p>Time: ${a.time}</p>
            <p>Status: ${a.status}</p>

            ${
                a.status === "Pending"
                ? `
                    <button onclick="updateStatus(${a.id}, 'Approved')">
                        Approve
                    </button>

                    <button onclick="updateStatus(${a.id}, 'Rejected')">
                        Reject
                    </button>
                  `
                : ""
            }

        </div>
    `).join("");
}


// Approve / Reject
function updateStatus(id, status) {

    appointments = appointments.map(a => {

        if (a.id === id) {
            a.status = status;
        }

        return a;
    });

    localStorage.setItem(
        "vmsAppointments",
        JSON.stringify(appointments)
    );

    showSection("overview");
}


// Logout
function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "../index.html";
}


// Show logged-in Host
if (currentUser) {

    document.getElementById("welcome").textContent =
        "Welcome, " + currentUser.fullName;
}


// Start dashboard
showSection("overview");