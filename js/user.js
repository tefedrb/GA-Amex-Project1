const userNameDOM = document.querySelector('#user');
const classIn = document.querySelector('.email');
const passwordIn = document.querySelector('.password');
const userNameIn = document.querySelector('.username');
const settings = document.querySelector('.settings-icon');
const dropDownMenu = document.querySelector('.create-profile');
const setUserForm = document.querySelector('.signUpLogIn');
const logInBtn = document.querySelector('.logInBtn');
const signUpBtn = document.querySelector('.signUpBtn');
const signUpForm = document.querySelector('.signUpForm');
const logInForm = document.querySelector('.logInForm');
const homeBtn = document.querySelector('.logo-wrap a');

const userToken = localStorage.loginToken;
const addUserProfile = () => {
  document.querySelector('#innerUser').innerText = localStorage.userName;
  const masterObj = JSON.parse(localStorage.masterObj);
  if(masterObj[localStorage.email].moreinfo){
    updateProfile(JSON.parse(masterObj[localStorage.email].moreinfo));
  }
};

const checkLogin = (page) => {
  const userHeader = document.querySelector('.userHeader');
  if(localStorage.loginToken){
    userHeader.style.display = 'flex';
    userHeader.children[1].innerText =
    localStorage.userName;
  }
};

const logOut = (event) => {
  event.preventDefault();
  switchPages();
  localStorage.removeItem('userName');
  localStorage.removeItem('loginToken');
};

checkLogin();
// This adds userProfile from masterObj
addUserProfile();
// Display all posts using masterObj
callAllPosts(collectAllTokens());

function showCommentInput(event){
  const targetArticle = event.target.closest('.post-temp');
  const inputWrap = targetArticle.querySelector('.inputWrap');
  if (inputWrap.style.display === "none") {
    inputWrap.style.display = "flex";
  } else {
    inputWrap.style.display = "none";
  }
};

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

const switchPages = () => {
  const urlArry = window.location.href.split('/');
  const newUrl = urlArry.slice(0,urlArry.length-1)
  .join('/');
  if(window.location.href.includes('index.html')){
    location.replace(newUrl + '/userProfile.html');
  } else {
    location.replace(newUrl + '/index.html');
  }
};

const editProfile = (event) => {
  event.preventDefault();
  const backupEmail = event.target[0].value;
  const mobile = event.target[1].value;
  const address = event.target[2].value;
  fetch('http://thesi.generalassemb.ly:8080/profile', {
    method: 'POST',
    headers: {
      "Authorization": "Bearer " + userToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      additionalEmail: backupEmail,
      mobile: mobile,
      address: address
    })
  })
  .then(response => response.json())
  .then(response => {
    const resToJson = JSON.stringify(response)
    const masterObj = JSON.parse(localStorage.masterObj);
    localStorage.userProfile = resToJson;
    masterObj[localStorage.email].moreinfo = resToJson;
    localStorage.masterObj = JSON.stringify(masterObj);
    updateProfile();
  })
  .catch(error => {
    console.log(error);
  })
};

function updateProfile(userProfile = JSON.parse(localStorage.userProfile)){
  if(userToken){
    document.querySelector('#innerUser').innerText =
    userProfile.user.username;
    document.querySelector('#backUpEmail').innerText =
    userProfile.additionalEmail;
    document.querySelector('#mobile').innerText =
    userProfile.mobile;
    document.querySelector('#address').innerText =
    userProfile.address;
  }
};

function addPostToDom(title, description, username){
  document.querySelector('.postForm').style.display = "block";
  const parentNode = document.querySelector('.containerLanding');
  const postTemp = document.querySelector('.post-temp');
  const newTemp = postTemp.cloneNode(true);
  newTemp.querySelector('.titleMsg').innerText = title;
  newTemp.querySelector('.message').innerText = description;
  newTemp.querySelector('.messageUserName').innerText = `Posted by ${username}`;
  newTemp.style.display = 'block';
  parentNode.appendChild(newTemp);
};

const createPost = (event) => {
  event.preventDefault();
  const title = event.target.children[0].value;
  const description = event.target.children[1].value;
  addPostToDom(title, description, localStorage.userName);
  fetch('http://thesi.generalassemb.ly:8080/post', {
    method: 'POST',
    headers: {
      "Authorization": "Bearer " + userToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: title,
      description: description
    })
  })
  .then(res => {
    return res.json();
  })
  .then(res => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  })
};

const listAllPosts = () => {
  fetch('http://thesi.generalassemb.ly:8080/post/list', {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(res => {
    return res.json();
  })
  .then(res => {
    console.log(res, 'list all posts');
    // allPostsIteration(res, addPostToDom);
  })
  .catch((err) => {
    console.log(err);
  })
};

const allPostsIteration = (arr, nodeFunc) => {
  arr.forEach(i => {
    nodeFunc(i.title, i.description, i.user.username);
  });
};

function postGenerator(title, description, username){
  // I need to add the comments id to div
  const livePost = document.querySelector('.livePost');
  const copyPost = livePost.cloneNode(true);


  // an id tag will be added to post - look
  // at api example in class - consider data-*
};

const newComment = (event) => {
  event.preventDefault();
  const thisComment = event.target.querySelector('.commentInput');
  fetch('http://thesi.generalassemb.ly:8080/comment/3', {
    method: 'POST',
    headers: {
      "Authorization": "Bearer " + userToken,
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
}



const getCommentsByUser = () => {
  fetch('http://thesi.generalassemb.ly:8080/user/comment', {
    method: 'GET',
    headers: {
      "Authorization": "Bearer " + userToken,
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
      "Authorization": "Bearer " + userToken,
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(response => {
    console.log('uh', response);
  })
  .catch(error => {
    console.log(error);
  })
};

function collectAllTokens(){
  // I need to use each persons token and use a loop for a request.
  // This is part of the flow of things used when refreshing
  // the page in order to recieve all posts. 
  const allTokens = [];
  const masterObj = JSON.parse(localStorage.masterObj);
  for(let key in masterObj){
    allTokens.push(masterObj[key].loginT);
  }
  localStorage.allTokens = JSON.stringify(allTokens);
  return allTokens;
};

// This is run in order to post all local posts
// In order for this set-up to work, we need to have
// postAllPosts(res) taking in the response from getPostsByUser
function callAllPosts(arr){
  arr.forEach(i => {
    getPostsByUser(i);
  });
};

function postAllPosts(arr){
  arr.forEach(i => {
    addPostToDom(i.title, i.description, i.user.username);
  });
};

function getPostsByUser(token){
  fetch('http://thesi.generalassemb.ly:8080/user/post', {
    method: 'GET',
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
  })
  .then(res => {
    return res.json();
  })
  .then(res => {
    console.log(res);
    // postAllPosts(res);
  })
  .catch(err => {
    console.log(err)
  })
};

function getProfile(func){
  fetch('http://thesi.generalassemb.ly:8080/profile', {
    method: 'GET',
    headers: {
      "Authorization": "Bearer " + userToken,
      "Content-Type": "application/json"
    },
  })
  .then(res => {
    return res.json();
  })
  .then(res => {
    console.log(res);
    if(func) func(res);
  })
  .catch(err => {
    console.log(err);
  })
};

settings.addEventListener('click', function(e){
  if(dropDownMenu.classList.contains('create-profile-slide')){
    dropDownMenu.classList.remove('create-profile-slide');
  } else {
    dropDownMenu.classList.add('create-profile-slide');
  }
});

function liveFeed(event){
  event.preventDefault();
  const aside = document.querySelector('aside');
  if(aside.classList.contains('showAside')){
    aside.classList.remove('showAside');
  } else {
    aside.classList.add('showAside');
  }
};
