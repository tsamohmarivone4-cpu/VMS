/* =========================
   DEFAULT SYSTEM USERS
========================= */

const defaultUsers = [

    {
        id: 1,
        fullName: "System Administrator",
        username: "admin",
        password: "admin123",
        role: "Administrator",
        department: "Administration"
    },

    {
        id: 2,
        fullName: "System Receptionist",
        username: "receptionist",
        password: "reception123",
        role: "Receptionist",
        department: "Reception"
    },

    {
        id: 3,
        fullName: "System Host",
        username: "host",
        password: "host123",
        role: "Host",
        department: "Administration"
    }

];


/* =========================
   CREATE DEFAULT USERS
========================= */

let users =
    JSON.parse(localStorage.getItem("vmsUsers")) || [];


/*
   Only create default users
   if the user list does not exist.
*/

if (!localStorage.getItem("vmsUsers")) {

    localStorage.setItem(
        "vmsUsers",
        JSON.stringify(defaultUsers)
    );

}


/* =========================
   LOGIN
========================= */

document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();


        const username =
            document
                .getElementById("username")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value
                .trim();

        const message =
            document.getElementById("loginMessage");


        /* GET USERS */

        const users =
            JSON.parse(
                localStorage.getItem("vmsUsers")
            ) || [];


        /* FIND USER */

        const user = users.find(u =>

            u.username.toLowerCase() ===
            username.toLowerCase() &&

            u.password === password

        );


        /* INVALID LOGIN */

        if (!user) {

            message.textContent =
                "Invalid username or password.";

            message.style.color = "red";

            return;
        }


        /* SAVE CURRENT USER */

        localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );


        /* GET ROLE */

        const role =
            user.role.toLowerCase();


        /* =========================
           DASHBOARD REDIRECTION
        ========================= */

        if (role === "admin" ||
            role === "administrator") {

            window.location.href =
                "html/admin.html";

        }

        else if (role === "receptionist") {

            window.location.href =
                "html/receptionist.html";

        }

        else if (role === "host") {

            window.location.href =
                "html/host.html";

        }

        else {

            message.textContent =
                "User role is not recognized.";

            message.style.color = "red";
        }

    });