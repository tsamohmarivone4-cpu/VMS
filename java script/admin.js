document.addEventListener("DOMContentLoaded", () => {

    const $ = id => document.getElementById(id);
    const data = key => JSON.parse(localStorage.getItem(key)) || [];
    const save = (key, value) =>
        localStorage.setItem(key, JSON.stringify(value));

    const sections = [
        "dashboardSection",
        "manageUsersSection",
        "manageDepartmentsSection",
        "visitorRecordsSection",
        "appointmentRecordsSection",
        "reportsSection",
        "settingsSection"
    ];

    function show(id) {
        sections.forEach(s => $(s).style.display = s === id ? "block" : "none");

        document.querySelectorAll(".sidebar li")
            .forEach(li => li.classList.remove("active"));

        const link = document.querySelector(`[id="${id.replace("Section", "Link")}"]`);
        if (link) link.parentElement.classList.add("active");
    }

    // DASHBOARD
    function loadStats() {
        const users = data("vmsUsers");
        const departments = data("vmsDepartments");
        const visitors = data("vmsVisitors");
        const appointments = data("vmsAppointments");

        $("totalUsers").textContent = users.length;
        $("totalDepartments").textContent = departments.length;
        $("totalVisitors").textContent = visitors.length;

        const today = new Date().toISOString().split("T")[0];

        $("todayVisits").textContent =
            visitors.filter(v => v.date === today).length;

        $("pendingAppointments").textContent =
            appointments.filter(a => a.status === "Pending").length;
    }


    // SIDEBAR
    $("dashboardLink").onclick = e => {
        e.preventDefault();
        show("dashboardSection");
    };

    $("manageUsersLink").onclick = e => {
        e.preventDefault();
        show("manageUsersSection");
        displayUsers(data("vmsUsers"));
    };

    $("manageDepartmentsLink").onclick = e => {
        e.preventDefault();
        show("manageDepartmentsSection");
        displayDepartments(data("vmsDepartments"));
    };

    $("visitorRecordsLink").onclick = e => {
        e.preventDefault();
        show("visitorRecordsSection");
        displayVisitors(data("vmsVisitors"));
    };

    $("appointmentRecordsLink").onclick = e => {
        e.preventDefault();
        show("appointmentRecordsSection");
        displayAppointments(data("vmsAppointments"));
    };

    $("reportsLink").onclick = e => {
        e.preventDefault();
        show("reportsSection");
    };

    $("settingsLink").onclick = e => {
        e.preventDefault();
        show("settingsSection");
    };


    // USERS
    function displayUsers(users) {
        $("userTableBody").innerHTML = users.map(u => `
            <tr>
                <td>${u.fullName}</td>
                <td>${u.username}</td>
                <td>${u.role}</td>
                <td>${u.department}</td>
                <td>
                    <button onclick="deleteUser(${u.id})">Delete</button>
                </td>
            </tr>
        `).join("") || "<tr><td colspan='5'>No users found.</td></tr>";
    }

    function addUser() {
        const fullName = prompt("Full name:");
        const username = prompt("Username:");
        const password = prompt("Password:");
        const role = prompt("Role: Administrator, Receptionist or Host");
        const department = prompt("Department:");

        if (!fullName || !username || !password || !role || !department)
            return alert("Please complete all fields.");

        let users = data("vmsUsers");

        if (users.some(u => u.username.toLowerCase() === username.toLowerCase()))
            return alert("Username already exists.");

        users.push({
            id: Date.now(),
            fullName,
            username,
            password,
            role,
            department
        });

        save("vmsUsers", users);
        displayUsers(users);
        loadStats();

        alert("User created successfully.");
    }

    $("addUserBtn").onclick = addUser;
    $("createUserBtn").onclick = () => {
        show("manageUsersSection");
        addUser();
    };


    window.deleteUser = id => {
        if (!confirm("Delete this user?")) return;

        const users = data("vmsUsers").filter(u => u.id != id);

        save("vmsUsers", users);
        displayUsers(users);
        loadStats();
    };


    // DEPARTMENTS
    function displayDepartments(departments) {
        $("departmentTableBody").innerHTML =
            departments.map(d => `
                <tr>
                    <td>${d.name}</td>
                    <td>
                        <button onclick="deleteDepartment(${d.id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `).join("") ||
            "<tr><td colspan='2'>No departments found.</td></tr>";
    }

    function addDepartment() {
        const name = prompt("Department name:");

        if (!name) return;

        let departments = data("vmsDepartments");

        if (departments.some(d =>
            d.name.toLowerCase() === name.toLowerCase()
        ))
            return alert("Department already exists.");

        departments.push({
            id: Date.now(),
            name
        });

        save("vmsDepartments", departments);
        displayDepartments(departments);
        loadStats();

        alert("Department added successfully.");
    }

    $("newDepartmentBtn").onclick = addDepartment;
    $("addDepartmentBtn").onclick = () => {
        show("manageDepartmentsSection");
        addDepartment();
    };

    window.deleteDepartment = id => {
        if (!confirm("Delete this department?")) return;

        const departments =
            data("vmsDepartments").filter(d => d.id != id);

        save("vmsDepartments", departments);
        displayDepartments(departments);
        loadStats();
    };


    // VISITORS
    function displayVisitors(visitors) {
        $("visitorTableBody").innerHTML =
            visitors.map(v => `
                <tr>
                    <td>${v.fullName || "-"}</td>
                    <td>${v.phone || "-"}</td>
                    <td>${v.email || "-"}</td>
                    <td>${v.gender || "-"}</td>
                    <td>${v.date || "-"}</td>
                    <td>${v.status || "Registered"}</td>
                </tr>
            `).join("") ||
            "<tr><td colspan='6'>No visitors found.</td></tr>";
    }

    $("visitorSearch").oninput = function () {
        const text = this.value.toLowerCase();

        displayVisitors(
            data("vmsVisitors").filter(v =>
                (v.fullName || "").toLowerCase().includes(text) ||
                (v.phone || "").includes(text)
            )
        );
    };

    $("viewVisitorsBtn").onclick = () => {
        show("visitorRecordsSection");
        displayVisitors(data("vmsVisitors"));
    };


    // APPOINTMENTS
    function displayAppointments(appointments) {
        $("appointmentTableBody").innerHTML =
            appointments.map(a => `
                <tr>
                    <td>${a.visitorName || "-"}</td>
                    <td>${a.host || "-"}</td>
                    <td>${a.purpose || "-"}</td>
                    <td>${a.date || "-"}</td>
                    <td>${a.time || "-"}</td>
                    <td>${a.status || "Pending"}</td>
                </tr>
            `).join("") ||
            "<tr><td colspan='6'>No appointments found.</td></tr>";
    }

    $("appointmentSearch").oninput = function () {
        const text = this.value.toLowerCase();

        displayAppointments(
            data("vmsAppointments").filter(a =>
                (a.visitorName || "").toLowerCase().includes(text) ||
                (a.host || "").toLowerCase().includes(text)
            )
        );
    };


    // REPORTS
    function report(type) {

        let content = "";

        if (type === "visitors")
            content = JSON.stringify(data("vmsVisitors"), null, 2);

        if (type === "appointments")
            content = JSON.stringify(data("vmsAppointments"), null, 2);

        if (type === "users")
            content = JSON.stringify(data("vmsUsers"), null, 2);

        const file = new Blob([content], { type: "text/plain" });
        const link = document.createElement("a");

        link.href = URL.createObjectURL(file);
        link.download = `VMS-${type}-Report.txt`;
        link.click();
    }

    $("visitorReportBtn").onclick = () => report("visitors");
    $("appointmentReportBtn").onclick = () => report("appointments");
    $("userReportBtn").onclick = () => report("users");

    $("generateReportBtn").onclick = () => {
        show("reportsSection");
    };


    // SETTINGS
    $("saveSettingsBtn").onclick = () => {

        localStorage.setItem(
            "systemName",
            $("systemName").value
        );

        localStorage.setItem(
            "adminName",
            $("adminName").value
        );

        alert("Settings saved successfully.");
    };


    // LOGOUT
    $("logoutLink").onclick = () => {
        localStorage.removeItem("currentUser");
    };


    // START
    show("dashboardSection");
    loadStats();

});