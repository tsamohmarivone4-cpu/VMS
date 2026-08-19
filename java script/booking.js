function setupAppointment() {

    const visitor = JSON.parse(
        localStorage.getItem("appointmentVisitor")
    );

    const form =
        document.getElementById("appointmentForm");

    const host =
        document.getElementById("host");

    const visitorName =
        document.getElementById("visitorName");


    if (!form) return;


    // Show visitor

    visitorName.textContent =
        visitor
            ? visitor.fullName
            : "No visitor selected";


    // Load hosts

    const users =
        JSON.parse(
            localStorage.getItem("vmsUsers")
        ) || [];


    users
        .filter(user =>
            user.role &&
            user.role.toLowerCase() === "host"
        )
        .forEach(user => {

            const option =
                document.createElement("option");

            option.value =
                user.fullName;

            option.textContent =
                user.fullName;

            host.appendChild(option);

        });


    // Submit appointment

    form.onsubmit = function (e) {

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

            visitorName:
                visitor.fullName,

            phone:
                visitor.phone,

            email:
                visitor.email,

            gender:
                visitor.gender,

            host:
                host.value,

            purpose:
                document.getElementById("purpose").value,

            date:
                document.getElementById("appointmentDate").value,

            time:
                document.getElementById("appointmentTime").value,

            status: "Pending"

        });


        // Save appointment

        localStorage.setItem(
            "vmsAppointments",
            JSON.stringify(appointments)
        );


        // Remove temporary visitor

        localStorage.removeItem(
            "appointmentVisitor"
        );


        // Show success message

        document.getElementById("message")
            .textContent =
            "Appointment booked successfully!";


        // Stay inside receptionist dashboard

        setTimeout(() => {

            loadPage("search.html");

        }, 1000);

    };


    // Cancel

    const cancel =
        document.getElementById("cancel");


    if (cancel) {

        cancel.onclick = () => {

            localStorage.removeItem(
                "appointmentVisitor"
            );

            loadPage("search.html");

        };

    }

}