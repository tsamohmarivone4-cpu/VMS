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
    changeStatus(id, "Approved");
}

function rejectAppointment(id) {
    changeStatus(id, "Rejected");
}

function card(a) {

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

    const pending =
        appointments.filter(a => a.status === "Pending");

    const approved =
        appointments.filter(a => a.status === "Approved");

    const rejected =
        appointments.filter(a => a.status === "Rejected");

    pendingCount.textContent = pending.length;
    approvedCount.textContent = approved.length;

    pendingAppointments.innerHTML =
        pending.length
            ? pending.map(card).join("")
            : "<p>No pending appointments.</p>";

    approvedAppointments.innerHTML =
        approved.length
            ? approved.map(card).join("")
            : "<p>No approved appointments.</p>";

    rejectedAppointments.innerHTML =
        rejected.length
            ? rejected.map(card).join("")
            : "<p>No rejected appointments.</p>";

    overviewAppointments.innerHTML =
        pending.length
            ? pending.map(card).join("")
            : "<p>No pending appointments.</p>";
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "../index.html";
}

display();