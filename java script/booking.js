
document.getElementById("bookingForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const booking = {
        visitor: "Ngoni vanessa",
        host: document.getElementById("hostName").value,
        purpose: document.getElementById("purpose").value,
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        status: "Pending"
    };

    // Get existing bookings
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    // Add new booking
    bookings.push(booking);

    // Save booking
    localStorage.setItem("bookings", JSON.stringify(bookings));

    // Go to host dashboard
    window.location.href = "host-dashboard.html";
});