const setUserForm = document.querySelector('.signUpLogIn');
const logInBtn = document.querySelector('.logInBtn');
const signUpBtn = document.querySelector('.signUpBtn');
const signUpForm = document.querySelector('.signUpForm');
const logInForm = document.querySelector('.logInForm');

let loginToken = localStorage.loginToken;
let signUpToken = localStorage.signUpToken;
let posts = [];

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

const saveUserName = (user) => {
  localStorage.userName = user;
};

const saveEmail = (email) => {
  localStorage.email = email;
};

const saveSignUpToken = (token) => {
  localStorage.signUpToken = token;
  signUpToken = token;
};


const signUp = (email, pass, user) => {
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
    if(response.httpStatus === 'BAD_REQUEST'){
      alert('Username/email already used');
      return
    };
    saveUserName(user);
    saveSignUpToken(response.token);
    logIn(email, pass);
    console.log(response, 'THE RESPONSE');
    console.log(response.token);
  })
  .catch(error => {
    console.log('WOOPS');
    console.log(error);
  })
};

const newUser = (event) => {
  event.preventDefault();
  const emailIn = event.target[0].value;
  const passIn = event.target[1].value;
  const userIn = event.target[2].value;
  emailIn.includes('@') ? signUp(emailIn, passIn, userIn) :
  alert("You need to enter a valid email address");
};
// Seems like when you login, the token is unique and persists
// throughout the rest of the items that require authentication
const logIn = (email, pass) => {
  fetch('http://thesi.generalassemb.ly:8080/login', {
    method: 'POST',
    headers: {
      // "Authorization": "Bearer " + signUpToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: pass
    })
  })
  .then(response => response.json())
  .then(response => {
    saveEmail(email);
    console.log(response);
    // Saving login token
    loginToken = response.token
    localStorage.loginToken = loginToken;
    // CAN WE USE LOGIN TOKEN TO GRAB USERNAME INFO FROM API?
    if(signUpToken){
      addToMasterObj(email, pass, localStorage.userName, loginToken);
    }
    const masterObj = JSON.parse(localStorage.masterObj);
    saveUserName(masterObj[email].username);
    switchPages();
  })
  .catch(error => {
    console.log(error);
  })
};

const captureLogin = (event) => {
  event.preventDefault();
  const email = event.target[0].value;
  const pass = event.target[1].value;
  if(!email || !pass){
    alert('Email or password not recognized');
    return
  }
  logIn(email, pass);
};

const addToMasterObj = (email, pass, user, loginTok) => {
  if(!localStorage.masterObj){
    localStorage.masterObj = JSON.stringify({});
  }
  const convertedObj = JSON.parse(localStorage.masterObj);
  convertedObj[email] = {
    password: pass,
    loginT: loginTok,
    username: user
  };
  localStorage.masterObj = JSON.stringify(convertedObj);
};

setUserForm.addEventListener('mouseover', function(e){
    if(e.target === signUpBtn){
      for(let i = 0; i < 3; i++){
        signUpForm.children[i].classList.add('showInputs');
        signUpForm.children[i].classList.remove('collapseInputs');
      }
      for(let i = 0; i < 2; i++){
        logInForm.children[i].classList.remove('showInputs');
        logInForm.children[i].classList.add('collapseInputs');
      }
    }
    if(e.target === logInBtn){
      for(let i = 0; i < 3; i++){
        signUpForm.children[i].classList.remove('showInputs');
        signUpForm.children[i].classList.add('collapseInputs');
      }
      for(let i = 0; i < 2; i++){
        logInForm.children[i].classList.add('showInputs');
        logInForm.children[i].classList.remove('collapseInputs');
      }
    }
});
