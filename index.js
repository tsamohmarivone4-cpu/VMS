/* DEFAULT SYSTEM USERS */

const defaultUsers = [

    {
        id: 1,
        fullName: "Administrator",
        username: "admin",
        password: "admin123",
        role: "Administrator",
        department: "Administration"
    },

    {
        id: 2,
        fullName: "Receptionist",
        username: "reception",
        password: "reception123",
        role: "Receptionist",
        department: "Reception"
    },

    {
        id: 3,
        fullName: "Host",
        username: "host",
        password: "host123",
        role: "Host",
        department: "Administration"
    }

];


/* get user*/

let users =
    JSON.parse(localStorage.getItem("vmsUsers")) || [];


/* add defult user */

defaultUsers.forEach(defaultUser => {

    const existing = users.find(
        user => user.username === defaultUser.username
    );

    if (!existing) {

        users.push(defaultUser);

    } else {

        existing.fullName = defaultUser.fullName;
        existing.role = defaultUser.role;
        existing.department = defaultUser.department;
        existing.password = defaultUser.password;

    }

});


/* save users */

localStorage.setItem(
    "vmsUsers",
    JSON.stringify(users)
);


/* login */

document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();

        const username =
            document.getElementById("username")
                .value.trim();

        const password =
            document.getElementById("password")
                .value.trim();

        const message =
            document.getElementById("loginMessage");


        const users =
            JSON.parse(
                localStorage.getItem("vmsUsers")
            ) || [];


        const user = users.find(u =>
            u.username.toLowerCase() ===
            username.toLowerCase() &&
            u.password === password
        );


        if (!user) {

            message.textContent =
                "Invalid username or password.";

            message.style.color = "red";

            return;
        }


        /* save current user */

        localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );


        /* redirect */

        const role =
            user.role.toLowerCase();


        if (
            role === "admin" ||
            role === "administrator"
        ) {

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