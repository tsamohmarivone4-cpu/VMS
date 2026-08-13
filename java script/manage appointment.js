document.addEventListener("DOMContentLoaded", function () {

    const tableBody = document.getElementById("appointmentTableBody");
    const searchInput = document.getElementById("appointmentSearch");
    const noAppointments = document.getElementById("noAppointments");


    // Get appointments from localStorage
    let appointments =
        JSON.parse(localStorage.getItem("vmsAppointments")) || [];


    // Display appointments
    function displayAppointments(data) {

        tableBody.innerHTML = "";


        if (data.length === 0) {

            noAppointments.style.display = "block";
            return;

        }

        noAppointments.style.display = "none";


        data.forEach(function (appointment) {

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
            `;

            tableBody.appendChild(row);

        });

    }


    // Search visitors
    searchInput.addEventListener("input", function () {

        const searchValue =
            searchInput.value.toLowerCase().trim();


        const filteredAppointments =
            appointments.filter(function (appointment) {

                return appointment.visitorName
                    .toLowerCase()
                    .includes(searchValue);

            });


        displayAppointments(filteredAppointments);

    });


    // Display appointments when page opens
    displayAppointments(appointments);

});