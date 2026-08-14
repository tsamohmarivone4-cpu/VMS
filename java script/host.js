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


// Save appointments
function saveAppointments() {

    localStorage.setItem(
        "appointments",
        JSON.stringify(appointments)
    );
}


// Approve appointment
function approveAppointment(id) {

    let appointments =
        JSON.parse(localStorage.getItem("appointments")) || [];

    const appointment =
        appointments.find(a => a.id === id);

    if (appointment) {

        // Change appointment status
        appointment.status = "Approved";

        // Save updated appointment
        localStorage.setItem(
            "appointments",
            JSON.stringify(appointments)
        );

        // Create receptionist notification
        let notifications =
            JSON.parse(
                localStorage.getItem("receptionistNotifications")
            ) || [];

        notifications.push({
            id: Date.now(),
            message:
                `${appointment.visitorName}'s appointment has been approved by the host.`,
            appointmentId: appointment.id,
            read: false
        });

        localStorage.setItem(
            "receptionistNotifications",
            JSON.stringify(notifications)
        );

        alert("Appointment approved!");

        displayPendingAppointments();
    }
}


// Reject appointment
function rejectAppointment(id) {

    let appointments =
        JSON.parse(localStorage.getItem("appointments")) || [];

    const appointment =
        appointments.find(a => a.id === id);

    if (!appointment) return;

    appointment.status = "Rejected";

    localStorage.setItem(
        "appointments",
        JSON.stringify(appointments)
    );

    // Notify receptionist
    let notifications =
        JSON.parse(
            localStorage.getItem("receptionistNotifications")
        ) || [];

    notifications.push({
        id: Date.now(),
        appointmentId: appointment.id,
        type: "Rejected",
        message:
            `${appointment.visitorName}'s appointment has been rejected by the host.`,
        read: false
    });

    localStorage.setItem(
        "receptionistNotifications",
        JSON.stringify(notifications)
    );

    alert("Appointment rejected!");

    displayPendingAppointments();
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

    
    // Get appointment groups
    const pending =
        appointments.filter(a => a.status === "Pending");

    const approved =
        appointments.filter(a => a.status === "Approved");

    const rejected =
        appointments.filter(a => a.status === "Rejected");

    
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