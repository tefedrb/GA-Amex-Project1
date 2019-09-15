const currentUser = localStorage.loginToken;
//I NEED TO GET POST BY ID BEFORE I CAN GET COMMENT - NEED TO INSERT POST
//INTO WHERE 3 IS


const newComment = (event) => {
  event.preventDefault();
  console.log(event.path[4].dataset.id);
  // For local posts
  const postNum = event.path[4].dataset.id;

  const thisComment = event.target.querySelector('.commentInput');
  fetch('http://thesi.generalassemb.ly:8080/comment/'+postNum, {
    method: 'POST',
    headers: {
      "Authorization": "Bearer " + currentUser,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: thisComment.value
    })
  })
  .then(res => {
    return res.json();
  })
  .then(res => {
    console.log(res);
    addCommentToDom(localStorage.userName, thisComment);
  })
  .catch((err) => {
    console.log(err);
  })
};

// can change this to query and find post by id
function addCommentToDom(user, element){
  const inputText = element.value;
  const commentsArea = element.closest('.commentsArea');
  const commentHTML = document.querySelector('.postedComment');
  const copyComment = commentHTML.cloneNode(true);
  commentsArea.appendChild(copyComment);
  copyComment.children[0].innerText = user;
  copyComment.children[1].children[0].innerText = inputText;
  copyComment.style.display = "block";
};

const getCommentsByUser = () => {
  fetch('http://thesi.generalassemb.ly:8080/user/comment', {
    method: 'GET',
    headers: {
      "Authorization": "Bearer " + currentUser,
      "Content-Type": "application/json"
    },
  })
  .then(res => {
    return res.json();
  })
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  })
};

const deleteComment = (id) => {
  fetch('http://thesi.generalassemb.ly:8080/comment/'+id, {
    method: 'DELETE',
    headers: {
      "Authorization": "Bearer " + currentUser,
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(response => {
    console.log('uh', response);
  })
  .catch(error => {
    alert('')
  })
};

const getCommentsByPostId = (id, func, event) => {
  fetch('http://thesi.generalassemb.ly:8080/post/' +id +'/comment', {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    },
  })
  .then(res => {
    return res.json();
  })
  .then(res => {
    console.log(res);
    if(func && event) func(res, event);
  })
  .catch(err => {
    console.log(err);
  })
};

function postComments(res, event){
  //Need to copy nodes and paste data
  // look for data then set up copy paste nodes
};

function showLiveComments(event){
  const findPost = event.target.closest('.livePost');
  const commentsArea = findPost.querySelector('.liveCommentsArea');
  const postId = event.path[1].attributes[2].value;
  if (commentsArea.style.display === "none") {
    commentsArea.style.display = "block";
    console.log(event);
    return
    getCommentsByPostId(postId, postComments, event);
    console.log(event.path[1].attributes[2].value);
  } else {
    commentsArea.style.display = "none";
  }
};

const loadComments = (event) => {

};
