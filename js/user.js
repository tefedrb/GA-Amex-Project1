
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

function revealComment(){
  const commentBtn = document.querySelector('.cmntBtn');
  if (commentBtn.style.display === "none") {
    commentBtn.style.display = "block";
  } else {
    commentBtn.style.display = "none";
  }
}

const updateProfile = () => {
  const userProfile = JSON.parse(localStorage.userProfile)
  // console.log(userProfile);
  if(loginToken){
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

const newUser = (email, pass, user) => {
  fetch('http://thesi.generalassemb.ly:8080/signup', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: pass,
      username: user
    })
  })
  .then(response => response.json())
  .then(response => {
    console.log('Sign Up', response);
    userToken = response.token;
    existingUser(email, pass);
  })
  .catch(error => {
    console.log(error);
  })
};

const signUp = (event) => {
  event.preventDefault();
  console.log(event);
  const emailIn = event.target[0].value;
  const passIn = event.target[1].value;
  const userIn = event.target[2].value;
  emailIn.includes('@') ? newUser(emailIn, passIn, userIn) :
  alert("You need to enter a valid email address");
};

// Seems like when you login, the token is unique and persists
// throughout the rest of the items that require authentication
const existingUser = (email, pass) => {
  fetch('http://thesi.generalassemb.ly:8080/login', {
    method: 'POST',
    headers: {
      "Authorization": "Bearer " + userToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: pass
    })
  })
  .then(response => response.json())
  .then(response => {
    console.log('Login', response);
    userToken = response.token;
    localStorage.token = userToken;
  })
  .catch(error => {
    console.log(error);
  })
};

const createProfile = (event) => {
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
    console.log('Create Profile', response);
  })
  .catch(error => {
    console.log(error);
  })
};

function updateDom(){
  document.querySelector('.postForm').style.display = "block";
  fetch("http://thesi.generalassemb.ly:8080/user/post", {
      headers: {
          "Authorization": "Bearer " + localStorage.getItem('user')
      }
  })
  .then((response) => {
      return response.json();
  })
  .then((response) => {
      const container = document.querySelector('.postTemp');

      for (let i = 0; i < response.length; i++) {
          const divPost = document.querySelector('package-post');
          const userNameMsg = document.querySelector('.messageUserName');
          const postTitle = document.querySelector('.titleMsg')
          const message = document.querySelector('.message');
          postTitle.innerText = response[i].title;
          message.innerText = res[i].description;
          postTemp.appendChild(divPost);
      }
  })
  .catch((err) => {
      console.log(err);
  })
};

const createPost = (event) => {
  event.preventDefault();
  const title = document.querySelector('.title');
  const description = document.querySelector('.description');
  const pstCommentBtn = document.querySelector('.postComment');

  fetch('http://thesi.generalassemb.ly:8080/post/3/comment', {
    method: 'POST',
    headers: {
      "Authorization": "Bearer " + userToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: title.value,
      description: description.value
    })
  })
  .then((res) => {
      console.log(res);
      updateDom(res);
  })
  .catch((err) => {
      console.log(err);
  })
};

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

}

