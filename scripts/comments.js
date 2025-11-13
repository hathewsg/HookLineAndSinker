const commentInput = document.getElementById('commentInput');
const postBtn = document.getElementById('postBtn');
const commentList = document.getElementById('commentList');

const params = new URLSearchParams(window.location.search);
const appName = params.get("name");

const storageKey = `comments_${appName}`;

let comments = JSON.parse(localStorage.getItem(storageKey)) || [];

function renderComments() {
    commentList.innerHTML = '';
    comments.forEach(text => {
        const commentContainer = document.createElement('div');
        commentContainer.classList.add('comment-container');

        const profileImg = document.createElement('img');
        profileImg.src = 'site_images/default_pfp.png';
        profileImg.alt = 'User Profile';
        profileImg.classList.add('comment-profile-icon');

        const commentContent = document.createElement('div');
        commentContent.classList.add('comment-content');

        const commentParagraph = document.createElement('p');
        commentParagraph.innerHTML = `<strong>Username(You):</strong> ${text}`;

        commentContent.appendChild(commentParagraph);
        commentContainer.appendChild(profileImg);
        commentContainer.appendChild(commentContent);

        commentList.appendChild(commentContainer);
    });
}

renderComments();

postBtn.addEventListener('click', function() {
    const commentText = commentInput.value.trim();
    if(commentText === "") return;

    comments.push(commentText);
    localStorage.setItem('comments', JSON.stringify(comments));
    renderComments();
    commentInput.value = "";
});

commentInput.addEventListener('keydown', function(e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        postBtn.click();
    }
});