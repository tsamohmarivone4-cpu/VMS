let appointments =
    JSON.parse(localStorage.getItem("vmsAppointments")) || [];

function showSection(id) {
    document.querySelectorAll(".section")
        .forEach(s => s.classList.remove("active"));

    document.getElementById(id).classList.add("active");
    display();
}

function save() {
    localStorage.setItem(
        "vmsAppointments",
        JSON.stringify(appointments)
    );
}

function changeStatus(id, status) {

    const appointment =
        appointments.find(a => a.id == id);

    if (!appointment) return;

    appointment.status = status;

    save();
    display();

    alert(
        status === "Approved"
            ? "Appointment approved successfully."
            : "Appointment rejected."
    );
}

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

    if (a.status === "Pending") {
        buttons = `
            <button onclick="approveAppointment(${a.id})">
                Approve
            </button>

            <button onclick="rejectAppointment(${a.id})">
                Reject
            </button>
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

            <h3>${a.visitorName}</h3>

            <p><b>Date:</b> ${a.date}</p>

            <p><b>Time:</b> ${a.time}</p>

            <p><b>Purpose:</b> ${a.purpose}</p>

            <p><b>Status:</b> ${a.status}</p>

            <div class="buttons">
                ${buttons}
            </div>

        </div>
    `;
}

function display() {

    appointments =
        JSON.parse(localStorage.getItem("vmsAppointments")) || [];

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

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "../index.html";
}

display();