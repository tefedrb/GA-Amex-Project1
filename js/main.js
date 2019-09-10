const userNameDOM = document.querySelector('#user');
console.log("hello")

const testUser1 = {
  email: "TestThis10@someplace.com",
  password: "123452239",
  username: "HipHopJoe9"
}

let userToken = null;

const signUp = (user) => {
  fetch('http://thesi.generalassemb.ly:8080/signup', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user)
  })
  .then(response => response.json())
  .then(response => {
    console.log('Sign Up', response);
    userToken = response.token;
  })
  .catch(error => {
    console.log(error);
  })
};

const logIn = (email, pass) => {
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
  })
  .catch(error => {
    console.log(error);
  })
};

const createProfile = (additionalEmail, mobile, address) => {
  fetch('http://thesi.generalassemb.ly:8080/profile', {
    method: 'POST',
    headers: {
      "Authorization": "Bearer " + userToken,
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
    console.log('Create Profile', response);
  })
  .catch(error => {
    console.log(error);
  })
};

const createPost = (title, description,) => {
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
