// ============================================
// RECEPTIONIST DASHBOARD
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    updateDashboardCards();

    updateRecentActivity();

    setupNavigation();

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
    const totalVisitors =
        visitors.length;


    // Pending appointments
    const pendingAppointments =
        appointments.filter(function (appointment) {

            return appointment.status === "Pending";

        }).length;


    // Checked-in visitors
    const checkedIn =
        visitors.filter(function (visitor) {

            return visitor.status === "Checked In";

        }).length;


    // Checked-out visitors
    const checkedOut =
        visitors.filter(function (visitor) {

            return visitor.status === "Checked Out";

        }).length;


    // Display numbers
    const totalVisitorsElement =
        document.getElementById("totalVisitors");

    const pendingAppointmentsElement =
        document.getElementById("pendingAppointments");

    const checkedInElement =
        document.getElementById("checkedIn");

    const checkedOutElement =
        document.getElementById("checkedOut");


    if (totalVisitorsElement) {
        totalVisitorsElement.textContent =
            totalVisitors;
    }

    if (pendingAppointmentsElement) {
        pendingAppointmentsElement.textContent =
            pendingAppointments;
    }

    if (checkedInElement) {
        checkedInElement.textContent =
            checkedIn;
    }

    if (checkedOutElement) {
        checkedOutElement.textContent =
            checkedOut;
    }

}


// ============================================
// RECENT VISITOR ACTIVITY
// ============================================

function updateRecentActivity() {

    const visitors =
        JSON.parse(
            localStorage.getItem("vmsVisitors")
        ) || [];


    const appointments =
        JSON.parse(
            localStorage.getItem("vmsAppointments")
        ) || [];


    const recentActivity =
        document.getElementById("recentActivity");


    if (!recentActivity) {
        return;
    }


    // Clear existing activity
    recentActivity.innerHTML = "";


    // No visitors
    if (visitors.length === 0) {

        recentActivity.innerHTML = `
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
        visitors.slice().reverse();


    recentVisitors.forEach(function (visitor) {

        let host = "Not assigned";

        let status =
            visitor.status || "Registered";

        let time =
            visitor.time || "--";


        // Find appointment for this visitor
        const appointment =
            appointments.find(function (item) {

                return String(item.visitorId) ===
                       String(visitor.id);

            });


        // If appointment exists
        if (appointment) {

            host =
                appointment.host ||
                appointment.hostName ||
                "Not assigned";


            status =
                appointment.status ||
                "Pending";


            time =
                appointment.time ||
                "--";

        }


        // Create row
        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${visitor.fullName || "Unknown Visitor"}
            </td>

            <td>
                ${host}
            </td>

            <td>
                ${status}
            </td>

            <td>
                ${time}
            </td>

        `;


        recentActivity.appendChild(row);

    });

}


// ============================================
// SIDEBAR NAVIGATION
// ============================================

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


    // ========================================
    // DASHBOARD
    // ========================================

    if (dashboardLink) {

        dashboardLink.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                cards.style.display = "grid";

                tableSection.style.display = "block";

                searchPanel.style.display = "none";

                checkInPanel.style.display = "none";

                checkOutPanel.style.display = "none";


                // Refresh dashboard
                updateDashboardCards();

                updateRecentActivity();

            }
        );

    }


    // ========================================
    // SEARCH VISITOR
    // ========================================

    if (searchVisitorLink) {

        searchVisitorLink.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                cards.style.display = "none";

                tableSection.style.display = "none";

                checkInPanel.style.display = "none";

                checkOutPanel.style.display = "none";

                searchPanel.style.display = "block";

            }
        );

    }


    // ========================================
    // CHECK-IN
    // ========================================

    if (checkInLink) {

        checkInLink.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                cards.style.display = "none";

                tableSection.style.display = "none";

                searchPanel.style.display = "none";

                checkOutPanel.style.display = "none";

                checkInPanel.style.display = "block";

            }
        );

    }


    // ========================================
    // CHECK-OUT
    // ========================================

    if (checkOutLink) {

        checkOutLink.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                cards.style.display = "none";

                tableSection.style.display = "none";

                searchPanel.style.display = "none";

                checkInPanel.style.display = "none";

                checkOutPanel.style.display = "block";

            }
        );

    }


    // ========================================
    // SEARCH FUNCTION
    // ========================================

    setupSearch();

}


// ============================================
// SEARCH VISITOR
// ============================================

function setupSearch() {

    const searchButton =
        document.getElementById("searchVisitorBtn");

    const searchInput =
        document.getElementById("visitorSearch");

    const searchResults =
        document.getElementById("searchResults");


    if (!searchButton ||
        !searchInput ||
        !searchResults) {

        return;
    }


    searchButton.addEventListener(
        "click",
        function () {

            const searchTerm =
                searchInput.value
                    .trim()
                    .toLowerCase();


            // Empty search
            if (!searchTerm) {

                searchResults.innerHTML = `
                    <p class="no-results">
                        Please enter a visitor name
                        or phone number.
                    </p>
                `;

                return;
            }


            // Get visitors
            const visitors =
                JSON.parse(
                    localStorage.getItem("vmsVisitors")
                ) || [];


            // Search visitors
            const matches =
                visitors.filter(
                    function (visitor) {

                        const name =
                            String(
                                visitor.fullName || ""
                            ).toLowerCase();


                        const phone =
                            String(
                                visitor.phone || ""
                            ).toLowerCase();


                        return (
                            name.includes(searchTerm) ||
                            phone.includes(searchTerm)
                        );

                    }
                );


            // ====================================
            // VISITOR NOT FOUND
            // ====================================

            if (matches.length === 0) {

                searchResults.innerHTML = `
                    <p class="no-results">
                        Visitor not found.
                    </p>
                `;

                return;
            }


            // Clear results
            searchResults.innerHTML = "";


            // ====================================
            // DISPLAY RESULTS
            // ====================================

            matches.forEach(
                function (visitor) {

                    const result =
                        document.createElement("div");


                    result.className =
                        "visitor-result";


                    result.innerHTML = `

                        <h3>
                            ${visitor.fullName}
                        </h3>

                        <p>
                            <strong>Phone:</strong>
                            ${visitor.phone || "Not provided"}
                        </p>

                        <p>
                            <strong>Email:</strong>
                            ${visitor.email || "Not provided"}
                        </p>

                        <p>
                            <strong>Gender:</strong>
                            ${visitor.gender || "Not provided"}
                        </p>

                        <button
                            type="button"
                            class="book-appointment-btn"
                            data-id="${visitor.id}"
                        >

                            <i class="fa-solid fa-calendar-plus"></i>

                            Book Appointment

                        </button>

                    `;


                    searchResults.appendChild(result);

                }
            );


            // ====================================
            // BOOK APPOINTMENT BUTTON
            // ====================================

            const appointmentButtons =
                document.querySelectorAll(
                    ".book-appointment-btn"
                );


            appointmentButtons.forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const visitorId =
                                Number(
                                    button.getAttribute(
                                        "data-id"
                                    )
                                );


                            const selectedVisitor =
                                visitors.find(
                                    function (visitor) {

                                        return Number(
                                            visitor.id
                                        ) === visitorId;

                                    }
                                );


                            if (!selectedVisitor) {

                                alert(
                                    "Visitor not found."
                                );

                                return;
                            }


                            // Save visitor for appointment
                            localStorage.setItem(
                                "appointmentVisitor",
                                JSON.stringify(
                                    selectedVisitor
                                )
                            );


                            // Go to appointment page
                            window.location.href =
                                "appointment booking.html";

                        }
                    );

                }
            );

        }
    );

}


// ============================================
// LOGOUT
// ============================================

function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "../index.html";

}