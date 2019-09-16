const currentUser = localStorage.loginToken;
//I NEED TO GET POST BY ID BEFORE I CAN GET COMMENT - NEED TO INSERT POST
//INTO WHERE 3 IS

//Function copied via plainjs.com
function insertAfter(el, referenceNode){
  referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
};

const newComment = (event) => {
  event.preventDefault();
  console.log(event.path[4].dataset.id);
  // For local posts
  const postNum = event.path[4].dataset.id;
  console.log(postNum)
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
    console.log(res, 'NEW COMMENT');
    // localCmmFindNdPaste(res, event, res.id);
    addTrashBins(localCmmFindNdPaste(res, event, res.id));
  })
  .catch((err) => {
    console.log(err);
  })
};

// Two functions - one for new post, one for finding and pasting
// Insert this into iterator
function localCmmFindNdPaste(obj, event, id){
  let user;
  if(obj) {
   user = obj.user.username;
  } else {
   user = localStorage.userName;
  }
  const inputText = obj.text;
  const element = event.path[2];
  const commentHTML = element.querySelector('.postedComment');
  const copyComment = commentHTML.cloneNode(true);
  const referenceNode = element.querySelector('.inputWrap');
  copyComment.setAttribute('data-id', id);
  copyComment.children[0].innerText = user;
  copyComment.children[1].children[0].innerText = inputText;
  copyComment.style.display = "block";
  insertAfter(copyComment, referenceNode);
  return [copyComment]
};
// new post
// function addCommentToDom(user, event){
//   const element = event.path[3].querySelector('.commentInput');
//   const inputText = element.value;
//   const commentsArea = element.closest('.commentsArea');
//   const commentHTML = document.querySelector('.postedComment');
//   const copyComment = commentHTML.cloneNode(true);
//   commentsArea.appendChild(copyComment);
//   copyComment.children[0].innerText = user;
//   copyComment.children[1].children[0].innerText = inputText;
//   copyComment.style.display = "block";
// };

function iterateCmmForLocal(res, event){
  res.forEach(comment => {
    localCmmFindNdPaste(comment, event, comment.id);
  });
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
    console.log(response, 'uh');
  })
  .catch(error => {
    console.log(error);
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
    console.log(res, 'comments by post id');
    if(func && event) func(res, event);
  })
  .catch(err => {
    console.log(err);
  })
};

function postCommentsLive(res, event){
  //Need to copy nodes and paste data
  // look for data then set up copy paste nodes
  if(res.length < 1) return;
  const commentAreaNode = event.path[1].children[4];
  const liveComment = commentAreaNode.children[1];
  const referenceNode = commentAreaNode.querySelector('.liveInputWrap');
  res.forEach(comment => {
    const newNode = liveComment.cloneNode(true);
    newNode.children[0].innerText = comment.user.username;
    newNode.children[1].innerText = comment.text;
    newNode.style.display = "block";
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  });
};

function deRenderComments(event, alt){
  let htmlCollection;
  if(alt) {
    htmlCollection = alt;
  } else {
    htmlCollection = event.path[1].children[4].children;
  }
  const length = htmlCollection.length;
  let iteration = length-1;
  while(iteration > 1){
    htmlCollection[1].remove();
    iteration--
  };
};

function showLiveComments(event){
  const findPost = event.target.closest('.livePost');
  const commentsArea = findPost.querySelector('.liveCommentsArea');
  const postId = event.path[1].attributes[2].value;
  if (commentsArea.style.display === "none") {
    commentsArea.style.display = "block";
    getCommentsByPostId(postId, postCommentsLive, event);
  } else {
    deRenderComments(event);
    commentsArea.style.display = "none";
  }
};

function postCommentsLocal(res){
  // if(res.length < 1) return;
  // const commentAreaNode = event.path[3];
  // const liveComment = commentAreaNode.children[1];
  // const referenceNode = commentAreaNode.querySelector('.liveInputWrap');
  // res.forEach(comment => {
  //   getCommentsByPostId(addCommentToDom, event);
  // });
}

function showLocalComments(event){
  const targetArticle = event.target.closest('.post-temp');
  const commentsArea = targetArticle.querySelector('.commentsArea');
  const postId = targetArticle.dataset.id
  console.log(postId, 'POST ID')
  const grandParent = event.target.parentNode.parentNode;
  const grandChildren = grandParent.querySelector('.active').children;
  if (commentsArea.style.display === "none") {
    getCommentsByPostId(postId, iterateCmmForLocal, event);
    commentsArea.style.display = "flex";
    getCommentsByUser(grandChildren);
  } else {
    console.log(event.target.parentNode.parentNode, 'pay attention')
    console.log(grandParent.querySelector('.active').children)
    deRenderComments(null, grandChildren);
    commentsArea.style.display = "none";
  }
};

const getCommentsByUser = (htmlCollec) => {
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
    const commentsToArr = usersCommentTest(res);
    console.log(commentsToArr, 'commentsToArr');
    console.log(htmlCollec)
    const userComments = iterateComments(htmlCollec, commentsToArr);
    console.log(userComments, 'usercomments');
    addTrashBins(userComments);
  })
  .catch(err => {
    console.log(err);
  })
};

// Get array of Ids from user
const usersCommentTest = (res) => {
  const output = [];
  res.forEach(comment => {
    output.push(comment.id);
  })
  return output;
};
// addTrashBins(iterateComments(htmlC, usersCommentTest(res))
// iterate through comments and see if
// the id is included in array. If it is, add a trashBin to that element.
function iterateComments(htmlC, arr){
  const confirmedComments = [];
  for(let i = 0; i < htmlC.length; i++){
    console.log(htmlC[i].dataset.id, 'dataset?')
    if(arr.includes(parseInt(htmlC[i].dataset.id))){
      confirmedComments.push(htmlC[i]);
    };
  }
  return confirmedComments
};

function addTrashBins(arr){
  const trash = document.querySelector('.trash');
  arr.forEach(element => {
    const copy = trash.cloneNode(true);
    copy.style.display = 'block';
    element.querySelector('.sub-active-icons').appendChild(copy);
  })
};

document.addEventListener('click', function(e){
  if(!e.target.parentNode.classList.contains('trash')) return;
  // comment
  console.log('yelp')
  const nestedLocalComment = e.target.parentNode.parentNode.parentNode;

  if(nestedLocalComment.classList.contains('postedComment')){
    deleteComment(nestedLocalComment.dataset.id);
    nestedLocalComment.remove();
  }
  // deleteComment()
});
