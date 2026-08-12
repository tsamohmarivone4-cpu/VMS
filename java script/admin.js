// admin dashboard//


// Run JavaScript after the page has loaded
document.addEventListener("DOMContentLoaded", function () {

    loadDashboardStatistics();

    setupQuickActions();

    setupSidebar();

});


// dashboard statistics

function loadDashboardStatistics() {

    // Get saved users
    const users =
        JSON.parse(localStorage.getItem("vmsUsers")) || [];

    // Get saved departments
    const departments =
        JSON.parse(localStorage.getItem("vmsDepartments")) || [];

    // Get saved visitors
    const visitors =
        JSON.parse(localStorage.getItem("vmsVisitors")) || [];

    // Get saved appointments
    const appointments =
        JSON.parse(localStorage.getItem("vmsAppointments")) || [];


    // Total users
    document.getElementById("totalUsers").textContent =
        users.length;


    // Total departments
    document.getElementById("totalDepartments").textContent =
        departments.length;


    // Total visitors
    document.getElementById("totalVisitors").textContent =
        visitors.length;


    // Today's visitors
    const today = new Date().toISOString().split("T")[0];

    const todayVisitors = visitors.filter(function (visitor) {

        return visitor.date === today;

    });

    document.getElementById("todayVisits").textContent =
        todayVisitors.length;


    // Pending appointments
    const pendingAppointments = appointments.filter(function (appointment) {

        return appointment.status === "Pending";

    });

    document.getElementById("pendingAppointments").textContent =
        pendingAppointments.length;
}


// quick action

function setupQuickActions() {

    // create user
    const createUserBtn =
        document.getElementById("createUserBtn");

    createUserBtn.addEventListener("click", function () {

        createUser();

    });


    // add department
    const addDepartmentBtn =
        document.getElementById("addDepartmentBtn");

    addDepartmentBtn.addEventListener("click", function () {

        addDepartment();

    });


    //generate report
    const generateReportBtn =
        document.getElementById("generateReportBtn");

    generateReportBtn.addEventListener("click", function () {

        generateReport();

    });


    // view visitors records
    const viewVisitorsBtn =
        document.getElementById("viewVisitorsBtn");

    viewVisitorsBtn.addEventListener("click", function () {

        window.location.href = "visitor-records.html";

    });

}


// create user//

function createUser() {

    const fullName =
        prompt("Enter the user's full name:");

    if (!fullName) {
        return;
    }


    const username =
        prompt("Enter username:");

    if (!username) {
        return;
    }


    const password =
        prompt("Enter password:");

    if (!password) {
        return;
    }


    const role =
        prompt(
            "Enter role:\nAdministrator\nReceptionist\nHost"
        );

    if (!role) {
        return;
    }


    const department =
        prompt("Enter department:");

    if (!department) {
        return;
    }


    // Get existing users
    let users =
        JSON.parse(localStorage.getItem("vmsUsers")) || [];


    // Check whether username already exists
    const existingUser = users.find(function (user) {

        return user.username.toLowerCase() ===
               username.toLowerCase();

    });


    if (existingUser) {

        alert("This username already exists.");

        return;
    }


    // Create new user
    const newUser = {

        id: Date.now(),

        fullName: fullName,

        username: username,

        password: password,

        role: role,

        department: department

    };


    // Add user
    users.push(newUser);


    // Save users
    localStorage.setItem(
        "vmsUsers",
        JSON.stringify(users)
    );


    // Update dashboard
    loadDashboardStatistics();


    alert(
        "User account created successfully!"
    );
}


// add departments//

function addDepartment() {

    const departmentName =
        prompt("Enter department name:");

    if (!departmentName) {
        return;
    }


    // Get existing departments
    let departments =
        JSON.parse(
            localStorage.getItem("vmsDepartments")
        ) || [];


    // Check duplicate
    const exists = departments.some(function (department) {

        return department.name.toLowerCase() ===
               departmentName.toLowerCase();

    });


    if (exists) {

        alert("This department already exists.");

        return;
    }


    // Create department
    const newDepartment = {

        id: Date.now(),

        name: departmentName

    };


    departments.push(newDepartment);


    // Save department
    localStorage.setItem(
        "vmsDepartments",
        JSON.stringify(departments)
    );


    // Update card
    loadDashboardStatistics();


    alert(
        "Department added successfully!"
    );
}


// generate report//

function generateReport() {

    const visitors =
        JSON.parse(
            localStorage.getItem("vmsVisitors")
        ) || [];


    const appointments =
        JSON.parse(
            localStorage.getItem("vmsAppointments")
        ) || [];


    const users =
        JSON.parse(
            localStorage.getItem("vmsUsers")
        ) || [];


    const departments =
        JSON.parse(
            localStorage.getItem("vmsDepartments")
        ) || [];


    const report =

        "VISITOR MANAGEMENT SYSTEM REPORT\n\n" +

        "Total Visitors: " +
        visitors.length + "\n" +

        "Total Appointments: " +
        appointments.length + "\n" +

        "Total Users: " +
        users.length + "\n" +

        "Total Departments: " +
        departments.length + "\n\n" +

        "Report generated on: " +
        new Date().toLocaleString();


    // Create downloadable file
    const blob =
        new Blob(
            [report],
            { type: "text/plain" }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "VMS-Report.txt";


    link.click();


    URL.revokeObjectURL(url);
}



//sidebar active link//

function setupSidebar() {

    const sidebarLinks =
        document.querySelectorAll(".sidebar a");


    sidebarLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            // Ignore logout
            if (
                link.textContent.trim()
                    .toLowerCase()
                    .includes("logout")
            ) {
                return;
            }


            // Remove active class
            sidebarLinks.forEach(function (item) {

                item.parentElement.classList.remove("active");

            });


            // Add active class
            link.parentElement.classList.add("active");

        });

    });

}



// loguot//

function logout() {

    // Remove current logged-in user
    localStorage.removeItem("currentUser");


    // Return to login page
    window.location.href = "../login.html";

}