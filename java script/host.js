function approveAppointment(button) {
    let row = button.parentElement.parentElement;
    row.style.backgroundColor = "#d4edda";
    alert("Appointment approved!");
}

function rejectAppointment(button) {
    let row = button.parentElement.parentElement;
    row.style.backgroundColor = "#f8d7da";
    alert("Appointment rejected!");
}

function rescheduleAppointment(button) {
    let row = button.parentElement.parentElement;

    let newDate = prompt("Enter new date:");
    let newTime = prompt("Enter new time:");

    if (newDate && newTime) {
        row.cells[2].innerText = newDate;
        row.cells[3].innerText = newTime;
        alert("Appointment rescheduled!");
    }
}