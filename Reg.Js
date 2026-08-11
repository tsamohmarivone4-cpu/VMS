const form =
document.getElementById("registrat ionForm");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name =
    document.getElementById("fullName").Value;
    const phone =
    document.getElementById("phone").value;
    const gender =
    document.querySelector('input[name="gender"]:checked');

    if (name === "" || phone === "" || email === "" || !gender) {
        alert("Please fll in all the required info")
    }
})