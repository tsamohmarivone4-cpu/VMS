
let appointments = [];

let currentFilter = "All";


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