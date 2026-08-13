// VMS LOGIN

const loginForm = document.getElementById("loginForm");


loginForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();


    // ==========================================
    // GET USERS CREATED BY ADMIN
    // ==========================================

    let users =
        JSON.parse(localStorage.getItem("vmsUsers")) || [];


    // ==========================================
    // DEFAULT SYSTEM ACCOUNTS
    // ==========================================

    const defaultUsers = [

        {
            id: "admin",
            fullName: "Administrator",
            username: "admin",
            password: "admin123",
            role: "Administrator",
            department: "Administration"
        },

        {
            id: "reception",
            fullName: "Receptionist",
            username: "reception",
            password: "reception123",
            role: "Receptionist",
            department: "Reception"
        },

        {
            id: "host",
            fullName: "Host",
            username: "host",
            password: "host123",
            role: "Host",
            department: "General"
        }
<<<<<<< HEAD

=======
        
>>>>>>> aefc5366499081bf5c55864fc9b3a67d7fcc5b24
    ];


    // Add default users if they don't already exist
    defaultUsers.forEach(function(defaultUser) {

        const exists = users.some(function(user) {

            return user.username === defaultUser.username;

        });


        if (!exists) {

            users.push(defaultUser);

        }

    });


    // Save users
    localStorage.setItem(
        "vmsUsers",
        JSON.stringify(users)
    );


    // ==========================================
    // FIND USER
    // ==========================================

    const user = users.find(function(account) {

        return (
            account.username === username &&
            account.password === password
        );

    });


    // ==========================================
    // INVALID LOGIN
    // ==========================================

    if (!user) {

        const message =
            document.getElementById("loginMessage");

        message.textContent =
            "Invalid username or password.";

        message.style.color = "red";

        return;
    }


    // ==========================================
    // SAVE CURRENT USER
    // ==========================================

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );


    // ==========================================
    // REDIRECT USER
    // ==========================================

    if (user.role === "Administrator") {

        window.location.href =
            "html/admin.html";

    }

    else if (user.role === "Receptionist") {

        window.location.href =
            "html/receptionist.html";

    }

    else if (user.role === "Host") {

        window.location.href =
            "html/Host.html";

    }


});