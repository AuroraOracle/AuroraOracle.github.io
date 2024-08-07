document.addEventListener("DOMContentLoaded", () => {
    const postButton = document.getElementById("postButton");
    const postContent = document.getElementById("postContent");
    const posts = document.getElementById("posts");

    const forbiddenWords = [
        "badword1", "badword2", "badword3" // здесь добавьте нежелательные слова
    ];

    // Загрузка постов из localStorage при загрузке страницы
    loadPosts();

    postButton.addEventListener("click", () => {
        const content = postContent.value.trim();
        if (content && !containsForbiddenWords(content)) {
            createPost(content);
            savePosts();
            postContent.value = "";
        } else {
            alert("Your post contains forbidden words. Please remove them.");
        }
    });

    function containsForbiddenWords(text) {
        const regex = new RegExp(forbiddenWords.join("|"), "i");
        return regex.test(text);
    }

    function createPost(content) {
        const post = document.createElement("div");
        post.classList.add("post");

        const postContent = document.createElement("div");
        postContent.classList.add("post-content");
        postContent.textContent = content;

        const postActions = document.createElement("div");
        postActions.classList.add("post-actions");

        const likeButton = document.createElement("span");
        likeButton.classList.add("like-button");
        likeButton.textContent = "Like (0)";
        likeButton.addEventListener("click", () => {
            const likes = parseInt(likeButton.textContent.match(/\d+/)[0]);
            likeButton.textContent = `Like (${likes + 1})`;
            savePosts(); // сохраняем посты после изменения количества лайков
        });

        const commentSection = document.createElement("div");
        commentSection.classList.add("comment-section");

        const commentTextarea = document.createElement("textarea");
        commentTextarea.placeholder = "Write a comment...";

        const commentButton = document.createElement("button");
        commentButton.textContent = "Comment";
        commentButton.addEventListener("click", () => {
            const commentContent = commentTextarea.value.trim();
            if (commentContent && !containsForbiddenWords(commentContent)) {
                addComment(commentSection, commentContent);
                commentTextarea.value = "";
                savePosts(); // сохраняем посты после добавления комментария
            } else {
                alert("Your comment contains forbidden words. Please remove them.");
            }
        });

        postActions.appendChild(likeButton);
        postActions.appendChild(commentTextarea);
        postActions.appendChild(commentButton);
        post.appendChild(postContent);
        post.appendChild(postActions);
        post.appendChild(commentSection);
        posts.appendChild(post);
    }

    function addComment(commentSection, content) {
        const comment = document.createElement("div");
        comment.classList.add("comment");
        comment.textContent = content;
        commentSection.appendChild(comment);
    }

    function savePosts() {
        const postsArray = [];
        const postElements = document.querySelectorAll(".post");
        postElements.forEach(postElement => {
            const postContent = postElement.querySelector(".post-content").textContent;
            const likeButton = postElement.querySelector(".like-button").textContent;
            const likes = parseInt(likeButton.match(/\d+/)[0]);
            const comments = [];
            postElement.querySelectorAll(".comment").forEach(comment => {
                comments.push(comment.textContent);
            });
            postsArray.push({ content: postContent, likes, comments });
        });
        localStorage.setItem("posts", JSON.stringify(postsArray));
    }

    function loadPosts() {
        const savedPosts = localStorage.getItem("posts");
        if (savedPosts) {
            const postsArray = JSON.parse(savedPosts);
            postsArray.forEach(postData => {
                createPostFromData(postData);
            });
        }
    }

    function createPostFromData(postData) {
        const post = document.createElement("div");
        post.classList.add("post");

        const postContent = document.createElement("div");
        postContent.classList.add("post-content");
        postContent.textContent = postData.content;

        const postActions = document.createElement("div");
        postActions.classList.add("post-actions");

        const likeButton = document.createElement("span");
        likeButton.classList.add("like-button");
        likeButton.textContent = `Like (${postData.likes})`;
        likeButton.addEventListener("click", () => {
            const likes = parseInt(likeButton.textContent.match(/\d+/)[0]);
            likeButton.textContent = `Like (${likes + 1})`;
            savePosts();
        });

        const commentSection = document.createElement("div");
        commentSection.classList.add("comment-section");

        const commentTextarea = document.createElement("textarea");
        commentTextarea.placeholder = "Write a comment...";

        const commentButton = document.createElement("button");
        commentButton.textContent = "Comment";
        commentButton.addEventListener("click", () => {
            const commentContent = commentTextarea.value.trim();
            if (commentContent && !containsForbiddenWords(commentContent)) {
                addComment(commentSection, commentContent);
                commentTextarea.value = "";
                savePosts();
            } else {
                alert("Your comment contains forbidden words. Please remove them.");
            }
        });

        postData.comments.forEach(commentContent => {
            addComment(commentSection, commentContent);
        });

        postActions.appendChild(likeButton);
        postActions.appendChild(commentTextarea);
        postActions.appendChild(commentButton);
        post.appendChild(postContent);
        post.appendChild(postActions);
        post.appendChild(commentSection);
        posts.appendChild(post);
    }
});