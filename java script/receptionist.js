
// receptionist dashboard

document.addEventListener("DOMContentLoaded", function () {

    updateDashboardCards();

    setupNavigation();

    setupSearch();

    setupCheckIn();

    setupCheckOut();

    loadRecentActivity();

});


// ============================================
// UPDATE DASHBOARD CARDS
// ============================================

function updateDashboardCards() {

    const visitors =
        JSON.parse(localStorage.getItem("vmsVisitors")) || [];

    const appointments =
        JSON.parse(localStorage.getItem("vmsAppointments")) || [];


    // Total visitors
    document.getElementById("totalVisitors").textContent =
        visitors.length;


    // Pending appointments
    const pendingAppointments =
        appointments.filter(function (appointment) {

            return appointment.status === "Pending";

        }).length;


    document.getElementById("pendingAppointments").textContent =
        pendingAppointments;


    // Checked in
    const checkedIn =
        visitors.filter(function (visitor) {

            return visitor.status === "Checked In";

        }).length;


    document.getElementById("checkedIn").textContent =
        checkedIn;


    // Checked out
    const checkedOut =
        visitors.filter(function (visitor) {

            return visitor.status === "Checked Out";

        }).length;


    document.getElementById("checkedOut").textContent =
        checkedOut;
}



// sidebar navigation


function setupNavigation() {

    const dashboardLink =
        document.getElementById("dashboardLink");

    const searchVisitorLink =
        document.getElementById("searchVisitorLink");

    const checkInLink =
        document.getElementById("checkInLink");

    const checkOutLink =
        document.getElementById("checkOutLink");


    const cards =
        document.querySelector(".cards");

    const tableSection =
        document.querySelector(".table-section");


    const searchPanel =
        document.getElementById("searchPanel");

    const checkInPanel =
        document.getElementById("checkInPanel");

    const checkOutPanel =
        document.getElementById("checkOutPanel");


    
    // dashboard
    

    dashboardLink.addEventListener("click", function (event) {

        event.preventDefault();

        cards.style.display = "grid";

        tableSection.style.display = "block";

        searchPanel.style.display = "none";

        checkInPanel.style.display = "none";

        checkOutPanel.style.display = "none";

        updateDashboardCards();

        loadRecentActivity();

    });


    
    // search visitor
    

    searchVisitorLink.addEventListener("click", function (event) {

        event.preventDefault();

        cards.style.display = "none";

        tableSection.style.display = "none";

        searchPanel.style.display = "block";

        checkInPanel.style.display = "none";

        checkOutPanel.style.display = "none";

    });


    
    // check-in
    

    checkInLink.addEventListener("click", function (event) {

        event.preventDefault();

        cards.style.display = "none";

        tableSection.style.display = "none";

        searchPanel.style.display = "none";

        checkInPanel.style.display = "block";

        checkOutPanel.style.display = "none";

    });


    
    // check-out
    

    checkOutLink.addEventListener("click", function (event) {

        event.preventDefault();

        cards.style.display = "none";

        tableSection.style.display = "none";

        searchPanel.style.display = "none";

        checkInPanel.style.display = "none";

        checkOutPanel.style.display = "block";

    });

}



// search button


function setupSearch() {

    const searchButton =
        document.getElementById("searchVisitorBtn");

    const searchInput =
        document.getElementById("visitorSearch");

    const searchResults =
        document.getElementById("searchResults");


    searchButton.addEventListener("click", function () {

        const searchTerm =
            searchInput.value.trim().toLowerCase();


        if (!searchTerm) {

            searchResults.innerHTML =
                "<p class='no-results'>Please enter a visitor name or phone number.</p>";

            return;
        }


        const visitors =
            JSON.parse(
                localStorage.getItem("vmsVisitors")
            ) || [];


        const matches =
            visitors.filter(function (visitor) {

                const name =
                    (visitor.fullName || "")
                        .toLowerCase();

                const phone =
                    (visitor.phone || "")
                        .toLowerCase();


                return (
                    name.includes(searchTerm) ||
                    phone.includes(searchTerm)
                );

            });


        // Visitor not found
        if (matches.length === 0) {

            searchResults.innerHTML = `
                <p class="no-results">
                    Visitor not found.
                </p>
            `;

            return;
        }


        searchResults.innerHTML = "";


        // Display visitor
        matches.forEach(function (visitor) {

            const result =
                document.createElement("div");

            result.className =
                "visitor-result";


            result.innerHTML = `

                <h3>${visitor.fullName}</h3>

                <p>
                    <strong>Phone:</strong>
                    ${visitor.phone}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${visitor.email || "Not provided"}
                </p>

                <p>
                    <strong>Gender:</strong>
                    ${visitor.gender || "Not provided"}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${visitor.status || "Registered"}
                </p>

                <button
                    type="button"
                    class="book-appointment-btn"
                    data-id="${visitor.id}"
                >
                    <i class="fa-solid fa-calendar-plus"></i>
                    Book Appointment
                </button>

                <button
                    type="button"
                    class="visitor-checkin-btn"
                    data-id="${visitor.id}"
                >
                    <i class="fa-solid fa-right-to-bracket"></i>
                    Check-In
                </button>

                <button
                    type="button"
                    class="visitor-checkout-btn"
                    data-id="${visitor.id}"
                >
                    <i class="fa-solid fa-right-from-bracket"></i>
                    Check-Out
                </button>

            `;


            searchResults.appendChild(result);

        });


        setupVisitorButtons();

    });

}



// buttons


function setupVisitorButtons() {

    const bookButtons =
        document.querySelectorAll(".book-appointment-btn");

    const checkInButtons =
        document.querySelectorAll(".visitor-checkin-btn");

    const checkOutButtons =
        document.querySelectorAll(".visitor-checkout-btn");


    
    // book an appointment
    

    bookButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const visitorId =
                Number(
                    button.getAttribute("data-id")
                );


            const visitors =
                JSON.parse(
                    localStorage.getItem("vmsVisitors")
                ) || [];


            const selectedVisitor =
                visitors.find(function (visitor) {

                    return visitor.id === visitorId;

                });


            if (!selectedVisitor) {

                alert("Visitor not found.");

                return;

            }


            localStorage.setItem(
                "appointmentVisitor",
                JSON.stringify(selectedVisitor)
            );


            window.location.href =
                "appointment booking.html";

        });

    });


    
    // check in from the search bar
    

    checkInButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const visitorId =
                Number(
                    button.getAttribute("data-id")
                );


            selectVisitorForCheckIn(visitorId);

        });

    });


    
    // check-out from the search bar

    checkOutButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const visitorId =
                Number(
                    button.getAttribute("data-id")
                );


            selectVisitorForCheckOut(visitorId);

        });

    });

}



// select visitor for check-in


function selectVisitorForCheckIn(visitorId) {

    localStorage.setItem(
        "selectedCheckInVisitor",
        visitorId
    );


    // Open check-in panel
    document.querySelector(".cards").style.display =
        "none";

    document.querySelector(".table-section").style.display =
        "none";

    document.getElementById("searchPanel").style.display =
        "none";

    document.getElementById("checkOutPanel").style.display =
        "none";

    document.getElementById("checkInPanel").style.display =
        "block";


    alert("Visitor selected for check-in. Enter the date and time.");

}



// select visitor for check-out

function selectVisitorForCheckOut(visitorId) {

    localStorage.setItem(
        "selectedCheckOutVisitor",
        visitorId
    );


    // Open check-out panel
    document.querySelector(".cards").style.display =
        "none";

    document.querySelector(".table-section").style.display =
        "none";

    document.getElementById("searchPanel").style.display =
        "none";

    document.getElementById("checkInPanel").style.display =
        "none";

    document.getElementById("checkOutPanel").style.display =
        "block";


    alert("Visitor selected for check-out. Enter the date and time.");

}


// ============================================
// CHECK-IN FORM
// ============================================

function setupCheckIn() {

    const form =
        document.getElementById("checkInForm");


    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const visitorId =
            Number(
                localStorage.getItem(
                    "selectedCheckInVisitor"
                )
            );


        if (!visitorId) {

            alert(
                "Please search and select a visitor first."
            );

            return;

        }


        const date =
            document.getElementById(
                "checkInDate"
            ).value;


        const time =
            document.getElementById(
                "checkInTime"
            ).value;


        if (!date || !time) {

            alert(
                "Please enter both date and time."
            );

            return;

        }


        const visitors =
            JSON.parse(
                localStorage.getItem("vmsVisitors")
            ) || [];


        const visitorIndex =
            visitors.findIndex(function (visitor) {

                return visitor.id === visitorId;

            });


        if (visitorIndex === -1) {

            alert("Visitor not found.");

            return;

        }


        // Update visitor
        visitors[visitorIndex].status =
            "Checked In";

        visitors[visitorIndex].checkInDate =
            date;

        visitors[visitorIndex].checkInTime =
            time;


        // Save visitors
        localStorage.setItem(
            "vmsVisitors",
            JSON.stringify(visitors)
        );


        // Clear selected visitor
        localStorage.removeItem(
            "selectedCheckInVisitor"
        );


        alert(
            visitors[visitorIndex].fullName +
            " has been checked in successfully."
        );


        form.reset();


        updateDashboardCards();

        loadRecentActivity();


        // Return to dashboard
        document.getElementById(
            "dashboardLink"
        ).click();

    });

}



// check-out form


function setupCheckOut() {

    const form =
        document.getElementById("checkOutForm");


    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const visitorId =
            Number(
                localStorage.getItem(
                    "selectedCheckOutVisitor"
                )
            );


        if (!visitorId) {

            alert(
                "Please search and select a visitor first."
            );

            return;

        }


        const date =
            document.getElementById(
                "checkOutDate"
            ).value;


        const time =
            document.getElementById(
                "checkOutTime"
            ).value;


        if (!date || !time) {

            alert(
                "Please enter both date and time."
            );

            return;

        }


        const visitors =
            JSON.parse(
                localStorage.getItem("vmsVisitors")
            ) || [];


        const visitorIndex =
            visitors.findIndex(function (visitor) {

                return visitor.id === visitorId;

            });


        if (visitorIndex === -1) {

            alert("Visitor not found.");

            return;

        }


        // Make sure visitor has checked in
        if (
            visitors[visitorIndex].status !==
            "Checked In"
        ) {

            alert(
                "This visitor has not been checked in."
            );

            return;

        }


        // Update visitor
        visitors[visitorIndex].status =
            "Checked Out";

        visitors[visitorIndex].checkOutDate =
            date;

        visitors[visitorIndex].checkOutTime =
            time;


        // Save visitors
        localStorage.setItem(
            "vmsVisitors",
            JSON.stringify(visitors)
        );


        // Clear selected visitor
        localStorage.removeItem(
            "selectedCheckOutVisitor"
        );


        alert(
            visitors[visitorIndex].fullName +
            " has been checked out successfully."
        );


        form.reset();


        updateDashboardCards();

        loadRecentActivity();


        // Return to dashboard
        document.getElementById(
            "dashboardLink"
        ).click();

    });

}



// recent visitor activities


function loadRecentActivity() {

    const activityTable =
        document.getElementById(
            "recentActivity"
        );


    if (!activityTable) {

        return;

    }


    const visitors =
        JSON.parse(
            localStorage.getItem("vmsVisitors")
        ) || [];


    activityTable.innerHTML = "";


    if (visitors.length === 0) {

        activityTable.innerHTML = `
            <tr>
                <td colspan="4">
                    No visitor activity yet.
                </td>
            </tr>
        `;

        return;

    }


    // Show newest visitors first
    const recentVisitors =
        visitors.slice().reverse().slice(0, 10);


    recentVisitors.forEach(function (visitor) {

        let time = "—";


        if (visitor.status === "Checked In") {

            time =
                visitor.checkInTime || "—";

        }
        else if (
            visitor.status === "Checked Out"
        ) {

            time =
                visitor.checkOutTime || "—";

        }


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${visitor.fullName || "Unknown"}
            </td>

            <td>
                ${visitor.host || "—"}
            </td>

            <td>
                ${visitor.status || "Registered"}
            </td>

            <td>
                ${time}
            </td>

        `;


        activityTable.appendChild(row);

    });

}



// logout


const logoutLink =
    document.getElementById("logoutlink");


if (logoutLink) {

    logoutLink.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "currentUser"
            );

        }
    );

}