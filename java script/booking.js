document.getElementById("appointmentForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const appointment = {
        id: Date.now(),

        visitor: document.getElementById("visitorName").value,

        date: document.getElementById("appointmentDate").value,

        time: document.getElementById("appointmentTime").value,

        host: document.getElementById("host").value,

        purpose: document.getElementById("purpose").value,

        status: "Pending"
    };

    // Get existing appointments
    let appointments =
        JSON.parse(localStorage.getItem("appointments")) || [];

    // Add new appointment
    appointments.push(appointment);

    // Save appointments
    localStorage.setItem(
        "appointments",
        JSON.stringify(appointments)
    );

    alert("Appointment booked successfully!");

    // Clear form
    this.reset();
});