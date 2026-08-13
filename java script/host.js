<<<<<<< HEAD

let appointments = [];
=======
// Get appointments from localStorage
let appointments =
    JSON.parse(localStorage.getItem("appointments")) || [];


// Display a section
function showSection(sectionId) {

    const sections =
        document.querySelectorAll(".section");

    sections.forEach(section => {
        section.classList.remove("active");
    });

    document
        .getElementById(sectionId)
        .classList.add("active");

    displayAppointments();
}
>>>>>>> aefc5366499081bf5c55864fc9b3a67d7fcc5b24


<<<<<<< HEAD

// LOAD APPOINTMENTS
function loadAppointments(filter = "All") {

    currentFilter = filter;

    const tableBody =
        document.getElementById("appointmentsTable");

    // Get the SAME appointments created by Booking
    appointments =
        JSON.parse(
            localStorage.getItem("vmsAppointments")
        ) || [];


    const today =
        new Date().toISOString().split("T")[0];


    let filtered = appointments;


    // PENDING
    if (filter === "Pending") {

        filtered = appointments.filter(
            app => app.status === "Pending"
        );

    }


    // TODAY
    if (filter === "Today") {

        filtered = appointments.filter(
            app => app.date === today
        );

    }


    // Clear table
    tableBody.innerHTML = "";


    // No appointments
    if (filtered.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No appointments found
                </td>
            </tr>
        `;

        return;
    }


    // Display appointments
    filtered.forEach(app => {

        const row = `
            <tr>

                <td>${app.visitorName}</td>

                <td>${app.purpose}</td>

                <td>${app.date}</td>

                <td>${app.time}</td>

                <td>
                    <span class="status ${app.status.toLowerCase()}">
                        ${app.status}
                    </span>
                </td>

                <td>

                    ${
                        app.status === "Pending"

                        ? `
                            <button onclick="updateStatus(${app.id}, 'Approved')">
                                Approve
                            </button>

                            <button onclick="updateStatus(${app.id}, 'Rejected')">
                                Reject
                            </button>
                          `

                        : "-"
                    }

                </td>

            </tr>
        `;

        tableBody.innerHTML += row;

    });


    // Active tab
    document
        .querySelectorAll(".tab")
        .forEach(btn => btn.classList.remove("active"));


    document
        .getElementById("tab" + filter)
        .classList.add("active");

}


// APPROVE / REJECT
function updateStatus(id, newStatus) {

    let data =
        JSON.parse(
            localStorage.getItem("vmsAppointments")
        ) || [];


    data = data.map(app => {

        if (app.id === id) {

            app.status = newStatus;

        }

        return app;

    });


    // Save back to the SAME storage
    localStorage.setItem(
        "vmsAppointments",
        JSON.stringify(data)
    );


    alert(`Appointment ${newStatus}`);

    loadAppointments(currentFilter);

}


// TAB BUTTONS

document
    .getElementById("tabAll")
    .addEventListener("click", () => {

        loadAppointments("All");

    });


document
    .getElementById("tabPending")
    .addEventListener("click", () => {

        loadAppointments("Pending");

    });


document
    .getElementById("tabToday")
    .addEventListener("click", () => {

        loadAppointments("Today");

    });


// LOGOUT

function logout() {

    window.location.href = "../index.html";

}


// LOAD WHEN PAGE OPENS

window.onload = function () {

    loadAppointments("All");

};
=======
// Save appointments
function saveAppointments() {

    localStorage.setItem(
        "appointments",
        JSON.stringify(appointments)
    );
}


// Approve appointment
function approveAppointment(id) {

    const appointment =
        appointments.find(a => a.id === id);

    if (appointment) {

        appointment.status = "Approved";

        saveAppointments();

        alert("Appointment approved successfully!");

        displayAppointments();
    }
}


// Reject appointment
function rejectAppointment(id) {

    const appointment =
        appointments.find(a => a.id === id);

    if (appointment) {

        appointment.status = "Rejected";

        saveAppointments();

        alert("Appointment rejected.");

        displayAppointments();
    }
}


// Check visitor in
function checkIn(id) {

    const appointment =
        appointments.find(a => a.id === id);

    if (appointment) {

        appointment.status = "Checked-in";

        saveAppointments();

        alert(
            appointment.visitor +
            " has been checked in."
        );

        displayAppointments();
    }
}


// Check visitor out
function checkOut(id) {

    const appointment =
        appointments.find(a => a.id === id);

    if (appointment) {

        appointment.status = "Completed";

        saveAppointments();

        alert(
            appointment.visitor +
            " has checked out."
        );

        displayAppointments();
    }
}


// Create appointment HTML
function createAppointmentHTML(appointment) {

    let buttons = "";

    // Pending appointment
    if (appointment.status === "Pending") {

        buttons = `
            <div class="buttons">

                <button
                    class="action approve"
                    onclick="approveAppointment(${appointment.id})">
                    Approve
                </button>

                <button
                    class="action reject"
                    onclick="rejectAppointment(${appointment.id})">
                    Reject
                </button>

            </div>
        `;
    }


    // Approved appointment
    if (appointment.status === "Approved") {

        buttons = `
            <div class="buttons">

                <button
                    class="action checkin"
                    onclick="checkIn(${appointment.id})">
                    Check-in Visitor
                </button>

            </div>
        `;
    }


    // Checked-in appointment
    if (appointment.status === "Checked-in") {

        buttons = `
            <div class="buttons">

                <button
                    class="action checkout"
                    onclick="checkOut(${appointment.id})">
                    Check-out Visitor
                </button>

            </div>
        `;
    }


    return `
        <div class="appointment">

            <h3>${appointment.visitor}</h3>

            <p>
                <strong>Date:</strong>
                ${appointment.date}
            </p>

            <p>
                <strong>Time:</strong>
                ${appointment.time}
            </p>

            <p>
                <strong>Purpose:</strong>
                ${appointment.purpose}
            </p>

            <p>
                <strong>Status:</strong>
                <span class="status">
                    ${appointment.status}
                </span>
            </p>

            ${buttons}

        </div>
    `;
}


// Display all appointments
function displayAppointments() {

    // Update counts
    document.getElementById("pendingCount").textContent =
        appointments.filter(a => a.status === "Pending").length;

    document.getElementById("approvedCount").textContent =
        appointments.filter(a => a.status === "Approved").length;

    document.getElementById("currentCount").textContent =
        appointments.filter(a => a.status === "Checked-in").length;

    document.getElementById("completedCount").textContent =
        appointments.filter(a => a.status === "Completed").length;


    // Get appointment groups
    const pending =
        appointments.filter(a => a.status === "Pending");

    const approved =
        appointments.filter(a => a.status === "Approved");

    const rejected =
        appointments.filter(a => a.status === "Rejected");

    const current =
        appointments.filter(a => a.status === "Checked-in");

    const completed =
        appointments.filter(a => a.status === "Completed");


    // Display each group
    displayList(
        "pendingAppointments",
        pending
    );

    displayList(
        "approvedAppointments",
        approved
    );

    displayList(
        "rejectedAppointments",
        rejected
    );

    displayList(
        "currentVisitors",
        current
    );

    displayList(
        "completedVisits",
        completed
    );


    // Show pending appointments on overview
    displayList(
        "overviewAppointments",
        pending
    );
}


// Display appointment list
function displayList(elementId, list) {

    const container =
        document.getElementById(elementId);

    if (!container) return;

    if (list.length === 0) {

        container.innerHTML =
            `<div class="empty">
                No appointments available.
            </div>`;

        return;
    }

    container.innerHTML =
        list.map(createAppointmentHTML).join("");
}


// Logout
function logout() {

    alert("You have been logged out.");

    window.location.href = "index.html";
}


// Load dashboard
displayAppointments();
>>>>>>> aefc5366499081bf5c55864fc9b3a67d7fcc5b24
