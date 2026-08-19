function setupRegistration() {

    const form = document.getElementById("VisitorForm");

    if (!form) return;

    form.onsubmit = function (event) {

        event.preventDefault();

        const visitor = {
            id: Date.now(),
            fullName: form.elements["fullname"].value.trim(),
            phone: form.elements["phone"].value.trim(),
            gender: form.elements["gender"].value,
            email: form.elements["email"].value.trim(),
            date: new Date().toISOString().split("T")[0]
        };

        // Get existing visitors
        let visitors =
            JSON.parse(localStorage.getItem("vmsVisitors")) || [];

        // Save visitor
        visitors.push(visitor);

        localStorage.setItem(
            "vmsVisitors",
            JSON.stringify(visitors)
        );

        // Save visitor for appointment
        localStorage.setItem(
            "appointmentVisitor",
            JSON.stringify(visitor)
        );

        // Check save
        if (!localStorage.getItem("vmsVisitors")) {
            alert("Visitor could not be saved.");
            return;
        }

        alert("Visitor registered successfully!");

        // Open appointment inside dashboard
        loadPage("appointment booking.html");
    };
}