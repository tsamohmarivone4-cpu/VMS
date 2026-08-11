// receptionist dashboard//

document.addEventListener("DOMContentLoaded", function () {

    updateDashboardCards();

});


//update dashboard cards//

function updateDashboardCards() {

    // Get visitors from Local Storage
    const visitors =
        JSON.parse(localStorage.getItem("vmsVisitors")) || [];


    // Get appointments from Local Storage
    const appointments =
        JSON.parse(localStorage.getItem("vmsAppointments")) || [];


    // Count total visitors
    const totalVisitors = visitors.length;


    // Count pending appointments
    const pendingAppointments =
        appointments.filter(function (appointment) {

            return appointment.status === "Pending";

        }).length;


    // Count checked-in visitors
    const checkedIn =
        visitors.filter(function (visitor) {

            return visitor.status === "Checked In";

        }).length;


    // Count checked-out visitors
    const checkedOut =
        visitors.filter(function (visitor) {

            return visitor.status === "Checked Out";

        }).length;


    // Display the numbers
    document.getElementById("totalVisitors").textContent =
        totalVisitors;

    document.getElementById("pendingAppointments").textContent =
        pendingAppointments;

    document.getElementById("checkedIn").textContent =
        checkedIn;

    document.getElementById("checkedOut").textContent =
        checkedOut;
}