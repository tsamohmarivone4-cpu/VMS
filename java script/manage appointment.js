function setupAppointments() {

    const table = document.getElementById("appointmentTableBody");
    const search = document.getElementById("appointmentSearch");
    const noAppointments = document.getElementById("noAppointments");

    if (!table) return;


    function getData(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }


    function displayAppointments(appointments) {

        table.innerHTML = "";

        if (!appointments.length) {
            noAppointments.style.display = "block";
            return;
        }

        noAppointments.style.display = "none";


        appointments.forEach(appointment => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${appointment.visitorName}</td>

                <td>${appointment.host}</td>

                <td>${appointment.purpose}</td>

                <td>${appointment.date}</td>

                <td>${appointment.time}</td>

                <td>
                    <span class="status ${appointment.status.toLowerCase()}">
                        ${appointment.status}
                    </span>
                </td>

                <td>
                    ${getAction(appointment)}
                </td>
            `;

            table.appendChild(row);
        });
    }


    function getAction(appointment) {

        const visits = getData("vmsVisits");

        const visit = visits.find(v =>
            v.visitorId == appointment.visitorId
        );


        // Visitor is currently checked in
        if (visit && visit.status === "Checked In") {

            return `
                <button class="action-btn"
                    onclick="appointmentCheckOut(${appointment.visitorId})">
                    Check Out
                </button>
            `;
        }


        // Visitor already checked out
        if (visit && visit.status === "Checked Out") {

            return `
                <button class="action-btn completed" disabled>
                    Visit Completed
                </button>
            `;
        }


        // Appointment approved
        if (appointment.status === "Approved") {

            return `
                <button class="action-btn"
                    onclick="appointmentCheckIn(${appointment.visitorId})">
                    Check In
                </button>
            `;
        }


        return "-";
    }


    // CHECK IN

    window.appointmentCheckIn = function(visitorId) {

        const appointments = getData("vmsAppointments");
        const visits = getData("vmsVisits");

        const appointment = appointments.find(a =>
            a.visitorId == visitorId &&
            a.status === "Approved"
        );

        if (!appointment) return;


        visits.push({

            id: Date.now(),

            visitorId: visitorId,

            visitorName: appointment.visitorName,

            host: appointment.host,

            date: new Date()
                .toISOString()
                .split("T")[0],

            checkInTime:
                new Date().toLocaleTimeString(),

            checkOutTime: "",

            status: "Checked In"

        });


        localStorage.setItem(
            "vmsVisits",
            JSON.stringify(visits)
        );


        displayAppointments(
            getData("vmsAppointments")
        );
    };


    // CHECK OUT

    window.appointmentCheckOut = function(visitorId) {

        const visits = getData("vmsVisits");

        const visit = visits.find(v =>
            v.visitorId == visitorId &&
            v.status === "Checked In"
        );

        if (!visit) return;


        visit.status = "Checked Out";

        visit.checkOutTime =
            new Date().toLocaleTimeString();


        localStorage.setItem(
            "vmsVisits",
            JSON.stringify(visits)
        );


        displayAppointments(
            getData("vmsAppointments")
        );
    };


    // SEARCH APPOINTMENTS

    if (search) {

        search.oninput = function() {

            const value =
                search.value.toLowerCase().trim();

            const appointments =
                getData("vmsAppointments");


            const results = appointments.filter(a =>

                (a.visitorName || "")
                    .toLowerCase()
                    .includes(value)

                ||

                (a.host || "")
                    .toLowerCase()
                    .includes(value)

            );


            displayAppointments(results);
        };
    }


    // LOAD ALL APPOINTMENTS

    displayAppointments(
        getData("vmsAppointments")
    );
}