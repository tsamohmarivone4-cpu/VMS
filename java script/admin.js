document.addEventListener("DOMContentLoaded", () => {

    const $ = id => document.getElementById(id);

    const get = key =>
        JSON.parse(localStorage.getItem(key)) || [];

    const save = (key, data) =>
        localStorage.setItem(key, JSON.stringify(data));


    /* =========================
       PAGE NAVIGATION
    ========================= */

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

        pages.forEach(p => {
            if ($(p))
                $(p).style.display = p === page ? "block" : "none";
        });

        document.querySelectorAll(".sidebar li")
            .forEach(li => li.classList.remove("active"));

        const link = $(page.replace("Section", "Link"));

        if (link)
            link.parentElement.classList.add("active");
    }


    /* =========================
       DASHBOARD STATISTICS
    ========================= */

    function stats() {

        const visitors = get("vmsVisitors");
        const appointments = get("vmsAppointments");

        $("totalVisitors").textContent = visitors.length;
        $("totalUsers").textContent = get("vmsUsers").length;
        $("totalDepartments").textContent =
            get("vmsDepartments").length;

        const today =
            new Date().toISOString().split("T")[0];

        $("todayVisits").textContent =
            visitors.filter(v => v.date === today).length;

        $("pendingAppointments").textContent =
            appointments.filter(a => a.status === "Pending").length;
    }


    /* =========================
       SIDEBAR
    ========================= */

    $("dashboardLink").onclick = e => {
        e.preventDefault();
        show("dashboardSection");
        stats();
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


    /* =========================
       USERS
    ========================= */

    function users(list = get("vmsUsers")) {

        $("userTableBody").innerHTML =
            list.map(u => `
                <tr>
                    <td>${u.fullName || "-"}</td>
                    <td>${u.username || "-"}</td>
                    <td>${u.role || "-"}</td>
                    <td>${u.department || "-"}</td>
                    <td>
                        <button onclick="deleteUser(${u.id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `).join("");
    }


    /* LOAD DEPARTMENTS */

    function loadDepartments() {

        const select = $("department");

        if (!select) return;

        const departments = get("vmsDepartments");

        select.innerHTML = `
            <option value="">Select department</option>
        `;

        departments.forEach(d => {

            select.innerHTML += `
                <option value="${d.name}">
                    ${d.name}
                </option>
            `;

        });
    }


    /* OPEN USER FORM */

    function openUserForm() {

        $("userFormBox").style.display = "block";

        loadDepartments();
    }


    $("addUserBtn").onclick = openUserForm;


    $("createUserBtn").onclick = () => {

        show("manageUsersSection");

        openUserForm();
    };


    /* CLOSE USER FORM */

    $("cancelUserBtn").onclick = () => {

        $("userForm").reset();

        $("userFormBox").style.display = "none";
    };


    /* CREATE USER */

    $("userForm").onsubmit = e => {

        e.preventDefault();

        const fullName =
            $("fullName").value.trim();

        const username =
            $("username").value.trim();

        const password =
            $("password").value;

        const role =
            $("role").value;

        const department =
            $("department").value;


        if (
            !fullName ||
            !username ||
            !password ||
            !role ||
            !department
        ) {

            alert("Please complete all fields.");

            return;
        }


        const list = get("vmsUsers");


        /* CHECK USERNAME */

        if (
            list.some(
                u =>
                    u.username.toLowerCase() ===
                    username.toLowerCase()
            )
        ) {

            alert("Username already exists.");

            return;
        }


        /* CREATE USER */

        list.push({

            id: Date.now(),

            fullName: fullName,

            username: username,

            password: password,

            role: role,

            department: department

        });


        save("vmsUsers", list);


        users();

        stats();


        $("userForm").reset();

        $("userFormBox").style.display = "none";


        alert("User created successfully.");
    };


    /* DELETE USER */

    window.deleteUser = id => {

        const list =
            get("vmsUsers")
                .filter(u => u.id != id);

        save("vmsUsers", list);

        users();

        stats();
    };


    /* SEARCH USERS */

    $("userSearch").oninput = function () {

        const text =
            this.value.toLowerCase();

        const list =
            get("vmsUsers").filter(u =>
                (u.fullName || "")
                    .toLowerCase()
                    .includes(text) ||

                (u.username || "")
                    .toLowerCase()
                    .includes(text) ||

                (u.role || "")
                    .toLowerCase()
                    .includes(text)
            );

        users(list);
    };


    /* =========================
       DEPARTMENTS
    ========================= */

    function departments(list = get("vmsDepartments")) {

        $("departmentTableBody").innerHTML =
            list.map(d => `
                <tr>
                    <td>${d.name}</td>
                    <td>
                        <button onclick="deleteDepartment(${d.id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `).join("");
    }


    function addDepartment() {

        const name =
            prompt("Department name:");

        if (!name) return;


        const list =
            get("vmsDepartments");


        if (
            list.some(
                d =>
                    d.name.toLowerCase() ===
                    name.toLowerCase()
            )
        ) {

            alert("Department already exists.");

            return;
        }


        list.push({

            id: Date.now(),

            name: name.trim()

        });


        save("vmsDepartments", list);

        departments();

        stats();

        alert("Department created.");
    }


    $("newDepartmentBtn").onclick =
        addDepartment;


    $("addDepartmentBtn").onclick = () => {

        show("manageDepartmentsSection");

        addDepartment();
    };


    window.deleteDepartment = id => {

        const list =
            get("vmsDepartments")
                .filter(d => d.id != id);

        save("vmsDepartments", list);

        departments();

        stats();
    };


    /* SEARCH DEPARTMENTS */

    $("departmentSearch").oninput = function () {

        const text =
            this.value.toLowerCase();

        const list =
            get("vmsDepartments")
                .filter(d =>
                    d.name.toLowerCase()
                        .includes(text)
                );

        departments(list);
    };


    /* =========================
       VISITORS
    ========================= */

    function visitors(list = get("vmsVisitors")) {

        $("visitorTableBody").innerHTML =
            list.map(v => `
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

        const text =
            this.value.toLowerCase();

        visitors(
            get("vmsVisitors").filter(v =>
                (v.fullName || "")
                    .toLowerCase()
                    .includes(text) ||

                (v.phone || "")
                    .includes(text)
            )
        );
    };


    $("viewVisitorsBtn").onclick = () => {

        show("visitorRecordsSection");

        visitors();
    };


    /* =========================
       APPOINTMENTS
    ========================= */

    function appointments(
        list = get("vmsAppointments")
    ) {

        $("appointmentTableBody").innerHTML =
            list.map(a => `
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

        const text =
            this.value.toLowerCase();

        appointments(
            get("vmsAppointments").filter(a =>
                (a.visitorName || "")
                    .toLowerCase()
                    .includes(text) ||

                (a.host || "")
                    .toLowerCase()
                    .includes(text)
            )
        );
    };


    /* =========================
       REPORTS
    ========================= */

    function report(key) {

        const file = new Blob(
            [JSON.stringify(get(key), null, 2)],
            { type: "text/plain" }
        );

        const link =
            document.createElement("a");

        link.href =
            URL.createObjectURL(file);

        link.download =
            `VMS-${key}-Report.txt`;

        link.click();
    }


    $("visitorReportBtn").onclick =
        () => report("vmsVisitors");

    $("appointmentReportBtn").onclick =
        () => report("vmsAppointments");

    $("userReportBtn").onclick =
        () => report("vmsUsers");


    $("generateReportBtn").onclick = () => {

        show("reportsSection");
    };


    /* =========================
       SETTINGS
    ========================= */

    $("saveSettingsBtn").onclick = () => {

        localStorage.setItem(
            "systemName",
            $("systemName").value
        );

        localStorage.setItem(
            "adminName",
            $("adminName").value
        );

        alert("Settings saved.");
    };


    /* =========================
       START
    ========================= */

    show("dashboardSection");

    stats();

});