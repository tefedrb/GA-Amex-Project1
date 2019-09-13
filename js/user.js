
// comment icon to hide and reveal upon click within post
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

const userToken = localStorage.loginToken;
const addUserProfile = () => {
  document.querySelector('#innerUser').innerText = localStorage.userName;
};

addUserProfile();

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
  console.log(commentHTML, copyComment)
  commentsArea.appendChild(copyComment);
  copyComment.children[0].innerText = user;
  copyComment.children[1].children[0].innerText = inputText;
  copyComment.style.display = "block";
};

// updateProfile();
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
// Seems like when you login, the token is unique and persists
// throughout the rest of the items that require authentication

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
    localStorage.userProfile = JSON.stringify(response);
    console.log('edited Profile', response);
    updateProfile();
  })
  .catch(error => {
    console.log(error);
  })
};

const updateProfile = () => {
  const userProfile = JSON.parse(localStorage.userProfile);
  // console.log(userProfile);
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

function addPostToDom(title, description){
  document.querySelector('.postForm').style.display = "block";
  console.log(event, 'alksdjflkasjflk')

  const parentNode = document.querySelector('.containerLanding');
  const postTemp = document.querySelector('.post-temp');
  const newTemp = postTemp.cloneNode(true);
    // ADD USER NAME
  // newTemp.querySelector('.messageUserName').innerText =
  newTemp.querySelector('.titleMsg').innerText = title;
  newTemp.querySelector('.message').innerText = description;
  parentNode.appendChild(newTemp);
  newTemp.style.display = 'block';
};

const createPost = (event) => {
  event.preventDefault();
  const title = event.target.children[0].value;
  const description = event.target.children[1].value;
  addPostToDom(title, description);
  console.log(typeof title, typeof description, 'TITLE AND DESCRIPTION')
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

const newComment = (event) => {
  event.preventDefault();
  console.log(event);
  const thisComment = event.target.querySelector('.commentInput');
  console.log(thisComment);
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


const deleteComment = () => {
  fetch('http://thesi.generalassemb.ly:8080/post/list', {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      additionalEmail: additionalEmail,
      mobile: mobile,
      address: address
    })
  })
  .then(response => response.json())
  .then(response => {
    console.log('List All Posts', response);
  })
  .catch(error => {
    console.log(error);
  })
};

settings.addEventListener('click', function(e){
  if(dropDownMenu.classList.contains('create-profile-slide')){
    dropDownMenu.classList.remove('create-profile-slide');
  } else {
    dropDownMenu.classList.add('create-profile-slide');
  }
});
