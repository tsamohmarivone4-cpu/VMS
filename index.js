/* defualt systerm user */

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


/* create defualt user */

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


/* login form */

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


        /* get usre */

        const users =
            JSON.parse(
                localStorage.getItem("vmsUsers")
            ) || [];


        /* find user */

        const user = users.find(u =>

            u.username.toLowerCase() ===
            username.toLowerCase() &&

            u.password === password

        );


        /* invalid login */

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


        /* get a role */

        const role =
            user.role.toLowerCase();


        /* dashbaord redirection */

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