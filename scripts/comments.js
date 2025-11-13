const commentInput = document.getElementById('commentInput');
const postBtn = document.getElementById('postBtn');
const commentList = document.getElementById('commentList');

const params = new URLSearchParams(window.location.search);
const appName = params.get("name");

const commentsRef = firebase.database().ref(`comments/${appName}`);

function renderComments(comments) {
    commentList.innerHTML = '';
    comments.forEach(comment => {
        const commentContainer = document.createElement('div');
        commentContainer.classList.add('comment-container');

        const profileImg = document.createElement('img');
        profileImg.src = 'site_images/default_pfp.png';
        profileImg.alt = 'User Profile';
        profileImg.classList.add('comment-profile-icon');

        const commentContent = document.createElement('div');
        commentContent.classList.add('comment-content');

        const commentParagraph = document.createElement('p');
        commentParagraph.innerHTML = `<strong>Username(You):</strong> ${comment.text}`;

        commentContent.appendChild(commentParagraph);
        commentContainer.appendChild(profileImg);
        commentContainer.appendChild(commentContent);

        commentList.appendChild(commentContainer);
    });
}

commentsRef.on('value', function(snapshot) {
    const comments = snapshot.val() || [];
    renderComments(Object.values(comments));
});

postBtn.addEventListener('click', function() {
    const commentText = commentInput.value.trim();
    if(commentText === "") return;

    const comment = {
        text: commentText,
        timestamp: Date.now(),
        user: "Username"
    };

    commentsRef.push(comment).then(() => {
        commentInput.value = "";
    }).catch((error) => {
        console.error("Error posting comment: ", error);
    });
});

commentInput.addEventListener('keydown', function(e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        postBtn.click();
    }
});