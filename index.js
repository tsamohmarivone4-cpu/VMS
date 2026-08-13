//vms login //

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Temporary accounts
    const users = [
        {
            username: "admin",
            password: "admin123",
            role: "Administrator"
        },
        {
            username: "reception",
            password: "reception123",
            role: "Receptionist"
        },
        {
            username: "host",
            password: "host123",
            role: "Host"
        }
        
    ];

    // Find matching account
    const user = users.find(function(account) {

        return (
            account.username === username &&
            account.password === password
        );

    });


    // Incorrect login
    if (!user) {

        document.getElementById("loginMessage").textContent =
            "Invalid username or password.";

        document.getElementById("loginMessage").style.color = "red";

        return;
    }


    // Save logged-in user
    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );


    // Send user to the correct dashboard

    if (user.role === "Administrator") {

        window.location.href = "html/admin.html";

    }

    else if (user.role === "Receptionist") {

        window.location.href = "html/receptionist.html";

    }

    else if (user.role === "Host") {

        window.location.href = "html/Host.html";

    }


});