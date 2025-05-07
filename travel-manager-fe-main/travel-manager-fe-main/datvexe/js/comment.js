const carId = new URLSearchParams(window.location.search).get("this_id");
const commentsContainer = document.getElementById("comments-container");
const userAvatar = document.getElementById("user-avatar");
const commentTextArea = document.getElementById("commentTextArea");
const token = sessionStorage.getItem("token"); // Replace with actual session token retrieval

let currentUserId;

document.addEventListener("DOMContentLoaded", () => {
  fetchUser();
  fetchComments();
});

function fetchUser() {
  fetch("http://127.0.0.1:8000/api/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.avatar) {
        userAvatar.src = data.avatar;
      }
      currentUserId = data.id; // Save current user's ID
    })
    .catch((error) => console.error("Error fetching user:", error));
}

function fetchComments() {
  fetch(`http://127.0.0.1:8000/api/cars/${carId}/comments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status) {
        commentsContainer.innerHTML = "";
        data.comments.forEach((comment) => {
          fetch(`http://127.0.0.1:8000/api/user/${comment.user_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => response.json())
            .then((userData) => {
              const formattedDate = new Date(
                comment.created_at
              ).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              });
              const userAvatar = userData.user.avatar || "/img/Xe/1.jpg";
              const userName = userData.user.full_name || "Unknown User";
              const deleteButton =
                comment.user_id === currentUserId
                  ? `<div style="color:red;font-size:20px;" class="hover_delete" onclick="deleteComment(${comment.id})">
                      <i class="fa fa-trash"></i>
                    </div>`
                  : "";

              commentsContainer.innerHTML += `
                <div style="display: flex; justify-content: space-between;align-items: center;">
                  <div class="d-flex flex-start align-items-center">
                    <img class="rounded-circle shadow-1-strong me-3" src="${userAvatar}" alt="avatar" width="60" height="60" />
                    <div>
                      <h6 class="fw-bold text-primary mb-1">${userName}</h6>
                      <p class="text-muted small mb-0">${formattedDate}</p>
                      <p class="mt-3 mb-4 pb-2">${comment.comment}</p>
                    </div>
                  </div>
                  ${deleteButton}
                </div>
              `;
            })
            .catch((error) =>
              console.error("Error fetching user for comment:", error)
            );
        });
      }
    })
    .catch((error) => console.error("Error fetching comments:", error));
}

function postComment() {
  const comment = commentTextArea.value;

  fetch(`http://127.0.0.1:8000/api/cars/${carId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ comment }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status) {
        commentTextArea.value = "";
        fetchComments();
      }
    })
    .catch((error) => console.error("Error posting comment:", error));
}

function deleteComment(commentId) {
  fetch(`http://127.0.0.1:8000/api/comments`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id: commentId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status) {
        commentTextArea.value = "";
        fetchComments();
      }
    })
    .catch((error) => console.error("Lỗi khi xóa comment", error));
}
