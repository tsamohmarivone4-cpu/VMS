document.addEventListener("DOMContentLoaded", function () {

    
    // get the register visitor
    

    const visitorData =
        localStorage.getItem("appointmentVisitor");


    const visitorName =
        document.getElementById("visitorName");


    // Check if a visitor was selected
    if (!visitorData) {

        visitorName.textContent =
            "No visitor selected";

    } else {

        const visitor =
            JSON.parse(visitorData);

        visitorName.textContent =
            visitor.fullName;
    }


    
    // appointment form
    

    const appointmentForm =
        document.getElementById("appointmentForm");


    appointmentForm.addEventListener("submit", function (event) {

        event.preventDefault();


        // Get visitor information
        const visitor =
            JSON.parse(
                localStorage.getItem("appointmentVisitor")
            );


        // Make sure a visitor exists
        if (!visitor) {

            alert(
                "No visitor has been selected."
            );

            return;
        }


        // Get appointment information
        const host =
            document.getElementById("host").value;

        const purpose =
            document.getElementById("purpose").value;

        const date =
            document.getElementById("appointmentDate").value;

        const time =
            document.getElementById("appointmentTime").value;

        const nda =
            document.getElementById("nda").checked;


        // Check host
        if (!host) {

            alert("Please select a host.");

            return;
        }


        // Check purpose
        if (!purpose) {

            alert("Please select the purpose of the visit.");

            return;
        }


        // Check NDA
        if (!nda) {

            alert(
                "Please agree to the digital NDA."
            );

            return;
        }


    
        // get existing appointment
    

        let appointments =
            JSON.parse(
                localStorage.getItem("vmsAppointments")
            ) || [];


        
        // create appointment
        

        const newAppointment = {

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

        };


        
        // save appointment
        

        appointments.push(newAppointment);


        localStorage.setItem(
            "vmsAppointments",
            JSON.stringify(appointments)
        );


        
        // return massage
        

        document.getElementById("message").textContent =
            "Appointment booked successfully!";


        
        // cancel appointment
    

        localStorage.removeItem(
            "appointmentVisitor"
        );


        
        // return to dashboard
        

        setTimeout(function () {

            window.location.href =
                "receptionist.html";

        }, 1000);

    });


    
    // cancel button
    

    const cancelButton =
        document.getElementById("cancel");


    cancelButton.addEventListener("click", function () {

        // Remove temporary appointment visitor
        localStorage.removeItem(
            "appointmentVisitor"
        );


        // Return to receptionist dashboard
        window.location.href =
            "receptionist.html";

    });

});