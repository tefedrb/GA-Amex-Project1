
function revealComment() {
  const commentBtn = document.querySelector('.cmntBtn');
  if (commentBtn.style.display === "none") {
    commentBtn.style.display = "block";
  } else {
    commentBtn.style.display = "none";
  }
}
