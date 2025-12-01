let currentUserEmail = null;

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

        currentUserEmail = data.email;

        document.getElementById("email").textContent = data.email;

        document.getElementById("access-level").textContent =
            (data.role || "user").toUpperCase();

        loadProfile(data.email);

    } catch (err) {
        console.error("Error:", err);
        window.location.href = "login.html";
    }
});

function loadProfile(email) {
    const safe = email.replace(/\./g, "_");

    db.ref("users/" + safe).once("value").then(snapshot => {
        const val = snapshot.val() || {};

        // Display name
        const displayName = val.displayName || email.split("@")[0];
        document.getElementById("username-display").textContent = displayName;
        document.getElementById("username").textContent = displayName;

        // Profile picture
        const pfp = val.profilePicture || "site_images/Default_pfp.png";
        document.getElementById("profile-picture").src = pfp;

        // Update nav bar profile picture
        const navPic = document.getElementById("nav-profile-pic");
        if (navPic) navPic.src = currentProfilePicture;

    });
}

// ----------------------
// Update Display Name
// ----------------------

document.getElementById("edit-profile-info").addEventListener("click", async () => {
    const newName = prompt("Enter your new display name:");

    if (!newName) return;

    const safe = currentUserEmail.replace(/\./g, "_");

    db.ref("users/" + safe).update({
        displayName: newName
    });

    // For updating display name
    db.ref("users/" + safe).update({
        displayName: newName
    }).then(() => {
        console.log("Display name updated successfully!");
    }).catch(error => {
        console.error("Error updating display name:", error);
        alert("Failed to update display name. Check console for details.");
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

    input.onchange = function () {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const base64 = e.target.result;

            const safe = currentUserEmail.replace(/\./g, "_");

            // Save Base64 to Firebase
            db.ref("users/" + safe).update({
                profilePicture: base64
            }).then(() => {
                console.log("Profile picture updated successfully!");
            }).catch(error => {
                console.error("Error updating profile picture:", error);
                alert("Failed to update profile picture. Check console for details.");
            });


            // Update instantly
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
