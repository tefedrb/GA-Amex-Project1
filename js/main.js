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

let loginToken = localStorage.loginToken;
let signUpToken = localStorage.signUpToken;

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
    console.log('Sign Up', response);
    signUpToken = response.token;
    localStorage.signUpToken = signUpToken;
    logIn(email, pass);
  })
  .catch(error => {
    console.log(error);
  })
};

const newUser = (event) => {
  event.preventDefault();
  console.log('new user event', event);
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
      "Authorization": "Bearer " + signUpToken,
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
    loginToken = response.token;
    localStorage.loginToken = loginToken;
  })
  .catch(error => {
    console.log(error);
  })
};

const captureLogin = (event) => {
  event.preventDefault();
  const email = event.target[0].value;
  const pass = event.target[0].value;
  logIn(email, pass);
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
