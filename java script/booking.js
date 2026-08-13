document.addEventListener("DOMContentLoaded", () => {

    const visitor = JSON.parse(localStorage.getItem("appointmentVisitor"));
    const hostSelect = document.getElementById("host");
    const form = document.getElementById("appointmentForm");

    // Show visitor
    document.getElementById("visitorName").textContent =
        visitor ? visitor.fullName : "No visitor selected";


    // Load Hosts created by Admin
    const users = JSON.parse(localStorage.getItem("vmsUsers")) || [];

    users.filter(user => user.role === "Host").forEach(host => {

        const option = document.createElement("option");

        option.value = host.id;
        option.textContent = host.fullName;

        hostSelect.appendChild(option);
    });


    // Submit appointment
    form.addEventListener("submit", e => {

        e.preventDefault();

        if (!visitor) {
            alert("No visitor has been selected.");
            return;
        }

        const selectedHost =
            hostSelect.options[hostSelect.selectedIndex];

        const purpose =
            document.getElementById("purpose").value.trim();

        const date =
            document.getElementById("appointmentDate").value;

        const time =
            document.getElementById("appointmentTime").value;

        const nda =
            document.getElementById("nda").checked;


        if (!selectedHost.value) {
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


        // Create appointment
        const appointments =
            JSON.parse(localStorage.getItem("vmsAppointments")) || [];

        appointments.push({

            id: Date.now(),

            visitorId: visitor.id,
            visitorName: visitor.fullName,
            phone: visitor.phone,
            email: visitor.email,
            gender: visitor.gender,

            hostId: selectedHost.value,
            host: selectedHost.textContent,

            purpose,
            date,
            time,
            nda,

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
    document.getElementById("cancel").addEventListener("click", () => {

        localStorage.removeItem("appointmentVisitor");

        window.location.href = "receptionist.html";

    });

});