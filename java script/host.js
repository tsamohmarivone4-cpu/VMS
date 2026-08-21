document.addEventListener("DOMContentLoaded", () => {

    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user || user.role.toLowerCase() !== "host") {
        location.href = "../index.html";
        return;
    }

    document.querySelector(".topbar p").textContent =
        "Welcome, " + user.fullName;

    const get = key =>
        JSON.parse(localStorage.getItem(key)) || [];


    window.showSection = type => load(type);


    function load(type = "all") {

        const appointments = get("vmsAppointments")
            .filter(a => a.host === user.fullName);

        const visits = get("vmsVisits");

        let list = appointments;

        const filters = {
            pending: a => a.status === "Pending",
            approved: a => a.status === "Approved",
            rescheduled: a => a.status === "Rescheduled",
            current: a => visits.some(v =>
                v.visitorId == a.visitorId &&
                v.status === "Checked In"
            ),
            completed: a => visits.some(v =>
                v.visitorId == a.visitorId &&
                v.status === "Checked Out"
            )
        };

        if (filters[type])
            list = appointments.filter(filters[type]);

        document.getElementById("tableTitle").textContent =
            type === "all"
                ? "All Appointments"
                : type.charAt(0).toUpperCase() + type.slice(1);

        display(list);
        cards(appointments, visits);
    }


    function display(list) {

        const table = document.getElementById("appointmentTableBody");
        const message = document.getElementById("noAppointments");

        table.innerHTML = "";

        message.style.display = list.length ? "none" : "block";

        list.forEach(a => {

            table.innerHTML += `
                <tr>
                    <td>${a.visitorName}</td>
                    <td>${a.purpose}</td>
                    <td>${a.date}</td>
                    <td>${a.time}</td>
                    <td>${a.status}</td>
                    <td>${action(a)}</td>
                </tr>
            `;
        });
    }


    function action(a) {

        if (a.status !== "Pending")
            return "-";

        return `
            <button onclick="update(${a.id},'Approved')">
                Approve
            </button>

            <button onclick="update(${a.id},'Rejected')">
                Reject
            </button>

            <button onclick="update(${a.id},'Rescheduled')">
                Reschedule
            </button>
        `;
    }


    window.update = (id, status) => {

        const appointments = get("vmsAppointments");

        const appointment = appointments.find(a =>
            a.id == id &&
            a.host === user.fullName
        );

        if (!appointment) return;

        appointment.status = status;

        localStorage.setItem(
            "vmsAppointments",
            JSON.stringify(appointments)
        );

        load();

        alert(
            status === "Approved"
                ? "Appointment approved."
                : status === "Rejected"
                ? "Appointment rejected."
                : "Appointment rescheduled."
        );
    };


    function cards(appointments, visits) {

        document.getElementById("pendingCount").textContent =
            appointments.filter(a => a.status === "Pending").length;

        document.getElementById("approvedCount").textContent =
            appointments.filter(a => a.status === "Approved").length;

        document.getElementById("currentCount").textContent =
            visits.filter(v =>
                v.host === user.fullName &&
                v.status === "Checked In"
            ).length;

        document.getElementById("completedCount").textContent =
            visits.filter(v =>
                v.host === user.fullName &&
                v.status === "Checked Out"
            ).length;
    }


    window.logout = () => {
        localStorage.removeItem("currentUser");
        location.href = "../index.html";
    };


    load();

});