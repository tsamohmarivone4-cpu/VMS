
    // Visitor
    const visitorData = localStorage.getItem("appointmentVisitor");
    const visitorName = document.getElementById("visitorName");

    if (visitorData) {
        visitorName.textContent = JSON.parse(visitorData).fullName;
    } else {
        visitorName.textContent = "No visitor selected";
    }


    // Load Hosts created by Admin
    const hostSelect = document.getElementById("host");
    const users = JSON.parse(localStorage.getItem("vmsUsers")) || [];

    const hosts = users.filter(user =>
        user.role.toLowerCase() === "host"
    );

    hosts.forEach(host => {
        const option = document.createElement("option");

        option.value = host.fullName;
        option.textContent = host.fullName;

        hostSelect.appendChild(option);
    });


    // Appointment form
    document.getElementById("appointmentForm")
        .addEventListener("submit", function (event) {

            event.preventDefault();

            const visitor = JSON.parse(
                localStorage.getItem("appointmentVisitor")
            );

            if (!visitor) {
                alert("No visitor has been selected.");
                return;
            }

            const host = document.getElementById("host").value;
            const purpose = document.getElementById("purpose").value.trim();
            const date = document.getElementById("appointmentDate").value;
            const time = document.getElementById("appointmentTime").value;
            const nda = document.getElementById("nda").checked;

            if (!host) {
                alert("Please select a host.");
                return;
            }

            if (!purpose) {
                alert("Please enter the purpose of the visit.");
                return;
            }

            if (!nda) {
                alert("Please agree to the digital NDA.");
                return;
            }

            const appointments =
                JSON.parse(localStorage.getItem("vmsAppointments")) || [];

            appointments.push({
                id: Date.now(),
                visitorId: visitor.id,
                visitorName: visitor.fullName,
                phone: visitor.phone,
                email: visitor.email,
                gender: visitor.gender,
                host: host,
                purpose: purpose,
                date: date,
                time: time,
                nda: nda,
                status: "Pending"
            });

            localStorage.setItem(
                "vmsAppointments",
                JSON.stringify(appointments)
            );

            document.getElementById("message").textContent =
                "Appointment booked successfully!";

            localStorage.removeItem("appointmentVisitor");

            setTimeout(() => {
                window.location.href = "receptionist.html";
            }, 1000);
        });


    // Cancel
    document.getElementById("cancel")
        .addEventListener("click", function () {

            localStorage.removeItem("appointmentVisitor");

            window.location.href = "receptionist.html";
        });

    // Go to host dashboard
    window.location.href = "host-dashboard.html";
});