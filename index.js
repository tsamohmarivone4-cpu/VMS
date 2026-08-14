// VMS LOGIN

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    let users = JSON.parse(localStorage.getItem("vmsUsers")) || [];

    // Default accounts
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
    ];

    // Add default accounts if they don't exist
    defaultUsers.forEach(defaultUser => {
        if (!users.some(user => user.username === defaultUser.username)) {
            users.push(defaultUser);
        }
    });

    localStorage.setItem("vmsUsers", JSON.stringify(users));

    // Find account
    const user = users.find(user =>
        user.username === username &&
        user.password === password
    );

    // Invalid login
    if (!user) {
        const message = document.getElementById("loginMessage");
        message.textContent = "Invalid username or password.";
        message.style.color = "red";
        return;
    }

    // Save logged-in user
    localStorage.setItem("currentUser", JSON.stringify(user));

    // Open correct dashboard
    if (user.role === "Administrator") {
        window.location.href = "html/admin.html";

    } else if (user.role === "Receptionist") {
        window.location.href = "html/receptionist.html";

    } else if (user.role === "Host") {
        window.location.href = "html/Host.html";
    }
});