document.addEventListener("DOMContentLoaded", () => {

    const currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || currentUser.role.toLowerCase() !== "host") {
        window.location.href = "../index.html";
        return;
    }

    document.querySelector(".topbar p").textContent =
        "Welcome, " + currentUser.fullName;

    displayAppointments();


    // show section
    window.showSection = function(id) {

        document.querySelectorAll(".section")
            .forEach(section =>
                section.classList.remove("active")
            );

        document.getElementById(id)
            .classList.add("active");

        displayAppointments();
    };


    // get the host appointment
    function getMyAppointments() {

        const appointments =
            JSON.parse(
                localStorage.getItem("vmsAppointments")
            ) || [];

        return appointments.filter(a =>
            a.host === currentUser.fullName
        );
    }


    // display appointment
    function displayAppointments() {

        const appointments = getMyAppointments();

        const pending =
            appointments.filter(a => a.status === "Pending");

        const approved =
            appointments.filter(a => a.status === "Approved");

        const rejected =
            appointments.filter(a => a.status === "Rejected");


        document.getElementById("pendingCount").textContent =
            pending.length;

        document.getElementById("approvedCount").textContent =
            approved.length;


        displayList(
            "hostAppointments",
            pending
        );

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
    }


    // display pending table
    function displayList(id, list) {

        const box = document.getElementById(id);

        if (!box) return;

        if (!list.length) {

            box.innerHTML =
                "<p>No appointments found.</p>";

            return;
        }


        if (id === "hostAppointments") {

            box.innerHTML = list.map(a => `
                <tr>
                    <td>${a.visitorName}</td>
                    <td>${a.purpose}</td>
                    <td>${a.date}</td>
                    <td>${a.time}</td>
                    <td>
                        <button onclick="approveAppointment(${a.id})">
                            Approve
                        </button>

                        <button onclick="rejectAppointment(${a.id})">
                            Reject
                        </button>
                    </td>
                </tr>
            `).join("");

            return;
        }


        box.innerHTML = list.map(a => `
            <div class="appointment">
                <h3>${a.visitorName}</h3>
                <p><b>Purpose:</b> ${a.purpose}</p>
                <p><b>Date:</b> ${a.date}</p>
                <p><b>Time:</b> ${a.time}</p>
                <p><b>Status:</b> ${a.status}</p>
            </div>
        `).join("");
    }


    // approve
    window.approveAppointment = function(id) {

        updateStatus(id, "Approved");

        alert("Appointment approved.");
    };


    // reject
    window.rejectAppointment = function(id) {

        updateStatus(id, "Rejected");

        alert("Appointment rejected.");
    };


    // update status
    function updateStatus(id, status) {

        let appointments =
            JSON.parse(
                localStorage.getItem("vmsAppointments")
            ) || [];

        const appointment =
            appointments.find(a =>
                a.id == id &&
                a.host === currentUser.fullName
            );

        if (!appointment) return;

        appointment.status = status;

        localStorage.setItem(
            "vmsAppointments",
            JSON.stringify(appointments)
        );

        displayAppointments();
    }


    // logout
    window.logout = function() {

        localStorage.removeItem("currentUser");

        window.location.href = "../index.html";
    };

});