document.addEventListener("DOMContentLoaded", () => {

    const $ = id => document.getElementById(id);
    const get = key => JSON.parse(localStorage.getItem(key)) || [];
    const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    const pages = [
        "dashboardSection",
        "manageUsersSection",
        "manageDepartmentsSection",
        "visitorRecordsSection",
        "appointmentRecordsSection",
        "reportsSection",
        "settingsSection"
    ];

    function show(page) {
        pages.forEach(p => $(p).style.display = p === page ? "block" : "none");
        document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));

        const link = $(page.replace("Section", "Link"));
        if (link) link.parentElement.classList.add("active");
    }


    // dashboard stats
    function stats() {
        const v = get("vmsVisitors");
        const a = get("vmsAppointments");

        $("totalVisitors").textContent = v.length;
        $("totalUsers").textContent = get("vmsUsers").length;
        $("totalDepartments").textContent = get("vmsDepartments").length;

        const today = new Date().toISOString().split("T")[0];

        $("todayVisits").textContent =
            v.filter(x => x.date === today).length;

        $("pendingAppointments").textContent =
            a.filter(x => x.status === "Pending").length;
    }


    // sidebar navigation
    $("dashboardLink").onclick = e => {
        e.preventDefault();
        show("dashboardSection");
    };

    $("manageUsersLink").onclick = e => {
        e.preventDefault();
        show("manageUsersSection");
        users();
    };

    $("manageDepartmentsLink").onclick = e => {
        e.preventDefault();
        show("manageDepartmentsSection");
        departments();
    };

    $("visitorRecordsLink").onclick = e => {
        e.preventDefault();
        show("visitorRecordsSection");
        visitors();
    };

    $("appointmentRecordsLink").onclick = e => {
        e.preventDefault();
        show("appointmentRecordsSection");
        appointments();
    };

    $("reportsLink").onclick = e => {
        e.preventDefault();
        show("reportsSection");
    };

    $("settingsLink").onclick = e => {
        e.preventDefault();
        show("settingsSection");
    };


    // users
    function users() {
        const list = get("vmsUsers");

        $("userTableBody").innerHTML = list.map(u => `
            <tr>
                <td>${u.fullName}</td>
                <td>${u.username}</td>
                <td>${u.role}</td>
                <td>${u.department}</td>
                <td><button onclick="deleteUser(${u.id})">Delete</button></td>
            </tr>
        `).join("");
    }

    function addUser() {
        const fullName = prompt("Full name:");
        const username = prompt("Username:");
        const password = prompt("Password:");
        const role = prompt("Role:");
        const department = prompt("Department:");

        if (!fullName || !username || !password || !role || !department)
            return alert("Complete all fields.");

        const list = get("vmsUsers");

        if (list.some(u => u.username === username))
            return alert("Username already exists.");

        list.push({
            id: Date.now(),
            fullName,
            username,
            password,
            role,
            department
        });

        save("vmsUsers", list);
        users();
        stats();
        alert("User created.");
    }

    $("addUserBtn").onclick = addUser;
    $("createUserBtn").onclick = () => {
        show("manageUsersSection");
        addUser();
    };

    window.deleteUser = id => {
        save("vmsUsers", get("vmsUsers").filter(u => u.id != id));
        users();
        stats();
    };


    // departments
    function departments() {
        const list = get("vmsDepartments");

        $("departmentTableBody").innerHTML = list.map(d => `
            <tr>
                <td>${d.name}</td>
                <td><button onclick="deleteDepartment(${d.id})">Delete</button></td>
            </tr>
        `).join("");
    }

    function addDepartment() {
        const name = prompt("Department name:");
        if (!name) return;

        const list = get("vmsDepartments");

        if (list.some(d => d.name.toLowerCase() === name.toLowerCase()))
            return alert("Department already exists.");

        list.push({ id: Date.now(), name });

        save("vmsDepartments", list);
        departments();
        stats();
    }

    $("newDepartmentBtn").onclick = addDepartment;
    $("addDepartmentBtn").onclick = () => {
        show("manageDepartmentsSection");
        addDepartment();
    };

    window.deleteDepartment = id => {
        save("vmsDepartments", get("vmsDepartments").filter(d => d.id != id));
        departments();
        stats();
    };


    // visitors
    function visitors(list = get("vmsVisitors")) {
        $("visitorTableBody").innerHTML = list.map(v => `
            <tr>
                <td>${v.fullName || "-"}</td>
                <td>${v.phone || "-"}</td>
                <td>${v.email || "-"}</td>
                <td>${v.gender || "-"}</td>
                <td>${v.date || "-"}</td>
                <td>${v.status || "Registered"}</td>
            </tr>
        `).join("");
    }

    $("visitorSearch").oninput = function () {
        const text = this.value.toLowerCase();

        visitors(get("vmsVisitors").filter(v =>
            (v.fullName || "").toLowerCase().includes(text) ||
            (v.phone || "").includes(text)
        ));
    };

    $("viewVisitorsBtn").onclick = () => {
        show("visitorRecordsSection");
        visitors();
    };


    // appiointments
    function appointments(list = get("vmsAppointments")) {
        $("appointmentTableBody").innerHTML = list.map(a => `
            <tr>
                <td>${a.visitorName || "-"}</td>
                <td>${a.host || "-"}</td>
                <td>${a.purpose || "-"}</td>
                <td>${a.date || "-"}</td>
                <td>${a.time || "-"}</td>
                <td>${a.status || "Pending"}</td>
            </tr>
        `).join("");
    }

    $("appointmentSearch").oninput = function () {
        const text = this.value.toLowerCase();

        appointments(get("vmsAppointments").filter(a =>
            (a.visitorName || "").toLowerCase().includes(text) ||
            (a.host || "").toLowerCase().includes(text)
        ));
    };


    // reports
    function report(key) {
        const file = new Blob(
            [JSON.stringify(get(key), null, 2)],
            { type: "text/plain" }
        );

        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.download = `VMS-${key}-Report.txt`;
        link.click();
    }

    $("visitorReportBtn").onclick = () => report("vmsVisitors");
    $("appointmentReportBtn").onclick = () => report("vmsAppointments");
    $("userReportBtn").onclick = () => report("vmsUsers");

    $("generateReportBtn").onclick = () => show("reportsSection");


    // settings
    $("saveSettingsBtn").onclick = () => {
        localStorage.setItem("systemName", $("systemName").value);
        localStorage.setItem("adminName", $("adminName").value);
        alert("Settings saved.");
    };


    // START
    show("dashboardSection");
    stats();

});