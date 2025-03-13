async function createOktaUser() {
    const userData = {
        profile: {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            email: document.getElementById("email").value,
            login: document.getElementById("email").value,
        },
        credentials: {
            password: document.getElementById("password").value, // Set a default password (or ask user)
        }
    };
    

    try {
        const response = await fetch("http://localhost:5000/signup", { // ✅ Call your backend
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            alert("User created successfully!");
            window.location.href = "index.html"; // ✅ Redirect to login page
        } else {
            alert(`Error: ${result.errorSummary || "Something went wrong"}`);
        }
    } catch (error) {
        console.error("Network/Fetch Error:", error);
        alert("Failed to connect to the server.");
    }
}