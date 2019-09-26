const settings = document.querySelector('.settings-icon');
const dropDownMenu = document.querySelector('.create-profile');
const homeBtn = document.querySelector('.logo-wrap a');
const settingsIcon = document.querySelector('.settings-icon');
const userHeader = document.querySelector('.userHeader');


const userToken = localStorage.loginToken;

// const addUserProfile = () => {
//   document.querySelector('#innerUser').innerText = localStorage.userName;
//
//   const masterObj = JSON.parse(localStorage.masterObj);
//   if(masterObj[localStorage.email].moreinfo){
//     fillInProfile(JSON.parse(masterObj[localStorage.email].moreinfo));
//   }
// };

const addProfileFromApi = (obj) => {
  const username = obj.user.username;

  document.querySelector('#innerUser').innerText = username;
};



// const checkLogin = (page) => {
//   const userHeader = document.querySelector('.userHeader');
//   if(localStorage.loginToken){
//     userHeader.style.display = 'flex';
//     userHeader.children[1].innerText =
//     localStorage.userName;
//   }
// };

const logOut = (event) => {
  event.preventDefault();
  switchPagesUser();
  localStorage.removeItem('userName');
  localStorage.removeItem('loginToken');
};

// function showLiveComment;

const switchPagesUser = () => {
  const urlArry = window.location.href.split('/');
  const newUrl = urlArry.slice(0,urlArry.length-1)
  .join('/');
  if(window.location.href.includes('index.html')){
    location.replace(newUrl + '/userProfile.html');
  } else {
    location.replace(newUrl + '/index.html');
  }
};

function fillInProfile(userProfile = JSON.parse(localStorage.userProfile)){
  // if(userToken){
  // repeat code one line below here
    document.querySelector('.userHeader span').innerText =
    userProfile.user.username;
    document.querySelector('.userHeader').style.display = 'flex';
    document.querySelector('#innerUser').innerText =
    userProfile.user.username;
    document.querySelector('#backUpEmail').innerText =
    userProfile.additionalEmail;
    document.querySelector('#mobile').innerText =
    userProfile.mobile;
    document.querySelector('#address').innerText =
    userProfile.address;
  // };
};

const createProfile = (event) => {
  event.preventDefault();
  backupEmail = event.target[0].value;
  mobile = event.target[1].value;
  address = event.target[2].value;
  console.log(mobile);
  if(backupEmail.length < 6 && !backupEmail.includes('@')){
    alert('Please Enter a Valid Email');
    return
  }
  if(!mobile){
    alert('Please enter a phone number');
    return
  }
  if(!address){
    alert('Please enter an address');
    return
  }
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
    /////////// const resToJson = JSON.stringify(response)
    // const masterObj = JSON.parse(localStorage.masterObj);
    /////////// localStorage.userProfile = resToJson;
    // masterObj[localStorage.email].moreinfo = resToJson;
    // localStorage.masterObj = JSON.stringify(masterObj);
    console.log(response, 'CREATING PROFILE!');
    dropDownMenu.classList.remove('create-profile-slide');
    localStorage.removeItem('signUpToken');
    userHeader.style.display = 'flex';
    // localStorage.removeItem('logInToken');
    // fillInProfile(response);
  })
  .catch(error => {
    console.log(error);
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
    //////////////////////////////////////////////////////////
    console.log(res);
    if(func) func(res);
  })
  .catch(err => {
    console.log(err);
  })
};

// checkLogin();
// This adds userProfile from masterObj
// addUserProfile();

settings.addEventListener('click', function(e){
  if(dropDownMenu.classList.contains('create-profile-slide')){
    dropDownMenu.classList.remove('create-profile-slide');
  } else {
    dropDownMenu.classList.add('create-profile-slide');
  }
});

if(localStorage.signUpToken){
  dropDownMenu.classList.add('create-profile-slide');
  document.querySelector('#innerUser').innerText = localStorage.userName;
  document.querySelector('.userHeader span').innerText = localStorage.userName;
  alert('Please create a profile');
} else {
  getProfile(fillInProfile);
  userHeader.style.display = 'flex';
}
