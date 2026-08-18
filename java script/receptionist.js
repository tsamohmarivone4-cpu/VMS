// CHANGE PAGE
function showPage(pageId, button) {

    // Hide all pages
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });

    // Show selected page
    document.getElementById(pageId).classList.add("active-page");


    // Remove active class from all buttons
    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    // Add active class to clicked button
    button.classList.add("active");
}


// SEARCH VISITOR
function searchVisitor() {

    const searchValue =
        document.getElementById("visitorSearch").value.trim();

    const results =
        document.getElementById("searchResults");

    if (searchValue === "") {
        results.innerHTML = "<p>Please enter a name or phone number.</p>";
        return;
    }

    results.innerHTML = `
        <div class="activities">
            <h2>Search Result</h2>
            <p>Searching for: <strong>${searchValue}</strong></p>
        </div>
    `;
}