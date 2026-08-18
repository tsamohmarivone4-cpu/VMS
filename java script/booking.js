document.addEventListener("DOMContentLoaded", () => {

    // Visitor
    const visitorData = localStorage.getItem("appointmentVisitor");
    const visitorName = document.getElementById("visitorName");
    const hostSelect = document.getElementById("host");
    const form = document.getElementById("appointmentForm");

    // get visitor from local storage
    const visitor = JSON.parse(
        localStorage.getItem("appointmentVisitor")
    );

    if (visitor) {
        visitorName.textContent = visitor.fullName;
    } else {
        visitorName.textContent = "No visitor selected";
    }


    // get host craeted by admin
    const users =
        JSON.parse(localStorage.getItem("vmsUsers")) || [];

    users
        .filter(user =>
            user.role &&
            user.role.toLowerCase() === "host"
        )
        .forEach(host => {

            const option = document.createElement("option");

            option.value = host.fullName;
            option.textContent = host.fullName;

            hostSelect.appendChild(option);
        });


    // book appointment
    form.addEventListener("submit", event => {

        event.preventDefault();

        if (!visitor) {
            alert("No visitor has been selected.");
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

            host: hostSelect.value,

            purpose: document.getElementById("purpose").value,

            date: document.getElementById("appointmentDate").value,

            time: document.getElementById("appointmentTime").value,


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


    // cancel appointment booking
    document.getElementById("cancel").addEventListener("click", () => {

        localStorage.removeItem("appointmentVisitor");

        window.location.href = "receptionist.html";

    });

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


    }
});