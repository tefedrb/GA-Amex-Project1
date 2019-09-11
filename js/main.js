const userNameDOM = document.querySelector('#user');
const classIn = document.querySelector('.email');
const passwordIn = document.querySelector('.password');
const userNameIn = document.querySelector('.username');
const settings = document.querySelector('.settings-icon');
const dropDownMenu = document.querySelector('.create-profile');


console.log("hello")

const testUser1 = {
  email: "TestThis10@someplace.com",
  password: "123452239",
  username: "HipHopJoe9"
}

let userToken = null;

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

const logIn = (event) => {
  event.preventDefault();
  const email = event.target[0].value;
  const pass = event.target[0].value;
  existingUser(email, pass);
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


const createPost = (title, description) => {
  fetch('http://thesi.generalassemb.ly:8080/post/3/comment', {
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
  .then(response => response.json())
  .then(response => {
    console.log('Create Post', response);
  })
  .catch(error => {
    console.log(error);
  })
};

const listAllPosts = () => {
  fetch('http://thesi.generalassemb.ly:8080/post/list', {
    method: 'GET',
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





const userPage = () => {

};

settings.addEventListener('click', function(e){
  if(dropDownMenu.classList.contains('create-profile-slide')){
    dropDownMenu.classList.remove('create-profile-slide');
  } else {
    dropDownMenu.classList.add('create-profile-slide');
  }
})
