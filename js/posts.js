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

const listAllPosts = (func) => {
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
    if(func) func(res);
    // allPostsIteration(res, addPostToDom);
  })
  .catch((err) => {
    console.log(err);
  })
};

function allPostsIteration(arr, nodeFunc){
  arr.forEach(i => {
    nodeFunc(i.user.username, i.title, i.description, i.id);
  });
};

function postLiveList(res){
  listAllPosts(allPostsIteration(res, livePostGenerator));
}

function livePostGenerator(username, title, description, id){
  // I need to add the post id to div
  // an id tag will be added to post - look
  // at api example in class - consider data-*
  const livePost = document.querySelector('.livePost');
  const copyPost = livePost.cloneNode(true);
  copyPost.setAttribute("data-id", id);
  copyPost.children[0].children[0].innerText = `User: ${username}`;
  copyPost.children[0].children[1].innerText = `post id: ${id}`;
  copyPost.children[1].innerText = title;
  copyPost.children[2].innerText = description;
  copyPost.style.display = 'block';
  document.querySelector("aside section").appendChild(copyPost);
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

callAllPosts(collectAllTokens());
