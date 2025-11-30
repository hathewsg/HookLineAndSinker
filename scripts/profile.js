document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("https://hlas-backend.onrender.com/me", {
            credentials: "include"
        });

        if (!response.ok) {
            window.location.href = "login.html";
            return;
        }

        const data = await response.json();

        document.getElementById("username").textContent = data.email;
        document.getElementById("email").textContent = data.email;

        document.getElementById("username-display").textContent =
            data.displayName || data.email.split("@")[0];

        document.getElementById("access-level").textContent =
            (data.role || "user").toUpperCase();

        if (data.profilePicture) {
            document.getElementById("profile-picture").src = data.profilePicture;
        }

    } catch (err) {
        console.error("Error:", err);
        window.location.href = "login.html";
    }
});

// ----------------------
// Update Display Name
// ----------------------
document.getElementById("edit-profile-info").addEventListener("click", async () => {
    const newName = prompt("Enter new display name:");
    if (!newName) return;

    await fetch("https://hlas-backend.onrender.com/update-display-name", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: newName })
    });

    document.getElementById("username-display").textContent = newName;
    document.getElementById("username").textContent = newName;

});

// ----------------------
// Update Profile Picture
// ----------------------
document.getElementById("edit-profile-img").addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = () => {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async () => {
            const base64 = reader.result;

            await fetch("https://hlas-backend.onrender.com/update-profile-picture", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: base64 })
            });

            document.getElementById("profile-picture").src = base64;
        };

        reader.readAsDataURL(file);
    };

    input.click();
});

// ----------------------
// Logout
// ----------------------
document.getElementById("logout-button").addEventListener("click", async () => {
    await fetch("https://hlas-backend.onrender.com/logout", {
        method: "POST",
        credentials: "include"
    });

    window.location.href = "login.html";
});
