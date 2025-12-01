const commentInput = document.getElementById('commentInput');
const postBtn = document.getElementById('postBtn');
const commentList = document.getElementById('commentList');

let currentUserEmail = null;
let currentDisplayName = "Unknown User";
let currentProfilePicture = "site_images/Default_pfp.png";
let currentUserRole = "user";

const params = new URLSearchParams(window.location.search);
const appName = params.get("name");

const commentsRef = firebase.database().ref(`comments/${appName}`);

fetch("https://hlas-backend.onrender.com/me", { credentials: "include" })
    .then(res => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
    })
    .then(data => {
        currentUserEmail = data.email;

        const safe = currentUserEmail.replace(/\./g, "_");

        currentUserRole = data.role || "user";

        // Load Firebase user profile (displayName + profilePicture)
        return db.ref("users/" + safe).once("value");
    })
    .then(snapshot => {
        const val = snapshot.val() || {};
        currentDisplayName = val.displayName || currentUserEmail.split("@")[0];
        currentProfilePicture = val.profilePicture || "site_images/Default_pfp.png";
    })
    .catch(err => {
        console.error("User not logged in:", err);

        // Disable comment box & button
        postBtn.disabled = true;
        commentInput.disabled = true;
        commentInput.placeholder = "You must be logged in to comment.";
    });


function renderComments(comments) {
    commentList.innerHTML = '';
    comments.forEach(comment => {
        const commentContainer = document.createElement('div');
        commentContainer.classList.add('comment-container');

        // Profile Image
        const profileImg = document.createElement('img');
        profileImg.src = comment.profilePicture || "site_images/Default_pfp.png";
        profileImg.alt = 'User Profile';
        profileImg.classList.add('comment-profile-icon');

        const commentContent = document.createElement('div');
        commentContent.classList.add('comment-content');

        // Comment text
        const commentParagraph = document.createElement('p');
        commentParagraph.innerHTML = `<strong>${comment.user}:</strong> ${comment.text}`;

        commentContent.appendChild(commentParagraph);

        // DELETE BUTTON — only mods/admins
        if (currentUserRole === "moderator" || currentUserRole === "admin") {
            const delBtn = document.createElement("button");
            delBtn.textContent = "Delete";
            delBtn.classList.add("delete-comment-btn");

            delBtn.addEventListener("click", () => {
                if (confirm("Delete this comment?")) {
                    commentsRef.child(comment.id).remove();
                }
            });

            commentContent.appendChild(delBtn);
        }

        commentContainer.appendChild(profileImg);
        commentContainer.appendChild(commentContent);
        commentList.appendChild(commentContainer);
    });
}

// Listen for changes
commentsRef.on('value', function (snapshot) {
    const commentsObj = snapshot.val() || {};
    // convert to array WITH Firebase keys
    const comments = Object.keys(commentsObj).map(key => ({
        id: key,          // Firebase comment ID
        ...commentsObj[key]
    }));
    renderComments(comments);
});

postBtn.addEventListener('click', function () {
    if (!currentUserEmail) {
        alert("You must be logged in to post a comment.");
        return;
    }

    const commentText = commentInput.value.trim();
    if (commentText === "") return;

    const comment = {
        text: commentText,
        timestamp: Date.now(),
        user: currentDisplayName, // DISPLAY NAME
        profilePicture: currentProfilePicture // PROFILE PICTURE
    };

    commentsRef.push(comment).then(() => {
        commentInput.value = "";
    }).catch((error) => {
        console.error("Error posting comment: ", error);
    });
});

commentInput.addEventListener('keydown', function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        postBtn.click();
    }
});