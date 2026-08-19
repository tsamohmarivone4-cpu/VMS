document.addEventListener("DOMContentLoaded", () => {

    const visitor = JSON.parse(
        localStorage.getItem("appointmentVisitor")
    );

    const form = document.getElementById("appointmentForm");
    const host = document.getElementById("host");

    // Show visitor
    document.getElementById("visitorName").textContent =
        visitor ? visitor.fullName : "No visitor selected";


    // Load hosts
    const users =
        JSON.parse(localStorage.getItem("vmsUsers")) || [];

    users
        .filter(user =>
            user.role &&
            user.role.toLowerCase() === "host"
        )
        .forEach(user => {

            const option = document.createElement("option");

            option.value = user.fullName;
            option.textContent = user.fullName;

            host.appendChild(option);
        });


    // Submit appointment
    form.addEventListener("submit", e => {

        e.preventDefault();

        if (!visitor) {
            alert("No visitor selected.");
            return;
        }

        if (!host.value) {
            alert("Please select a host.");
            return;
        }


        const appointments =
            JSON.parse(
                localStorage.getItem("vmsAppointments")
            ) || [];


        appointments.push({

            id: Date.now(),

            visitorId: visitor.id,
            visitorName: visitor.fullName,

            phone: visitor.phone,
            email: visitor.email,
            gender: visitor.gender,

            host: host.value,

            purpose:
                document.getElementById("purpose").value,

            date:
                document.getElementById("appointmentDate").value,

            time:
                document.getElementById("appointmentTime").value,

            status: "Pending"

        });


        localStorage.setItem(
            "vmsAppointments",
            JSON.stringify(appointments)
        );


        localStorage.removeItem("appointmentVisitor");


        document.getElementById("message").textContent =
            "Appointment booked successfully!";


        setTimeout(() => {
            window.location.href = "receptionist.html";
        }, 1000);

    });


    // Cancel
    document.getElementById("cancel").onclick = () => {

        localStorage.removeItem("appointmentVisitor");

        window.location.href = "receptionist.html";

    };

});