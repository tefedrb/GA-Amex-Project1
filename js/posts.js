const createPost = (event) => {
  event.preventDefault();
  const title = event.target.children[0].value;
  const description = event.target.children[1].value;
  console.log(event);
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
    const id = res.id;
    addPostLocal(title, description, localStorage.userName, id);
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
  })
  .catch((err) => {
    console.log(err);
  })
};

function postsIterator(arr, nodeFunc){
  arr.reverse().forEach(i => {
    nodeFunc(i.user.username, i.title, i.description, i.id);
  });
};

function postLiveList(res){
  postsIterator(res, livePostGenerator);
};

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

  // need to create a dropDown for each post that shows comments
  // need to create a delete post function
  // append a node form to copyPost that has a submit func
  // that activates the delete post func on that post

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
  arr.forEach(token => {
    console.log('going going')
    getPostsByUser(token);
  });
};

function postAllPosts(arr){
  arr.forEach(i => {
    addPostLocal(i.title, i.description, i.user.username, i.id);
  });
};

function getPostsByUser(token, func){
  fetch('http://thesi.generalassemb.ly:8080/user/post', {
    method: 'GET',
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    }
  })
  .then(res => {
    return res.json();
  })
  .then(res => {
    if(func) func(res);
    console.log(res);
    postAllPosts(res);
  })
  .catch(err => {
    console.log(err)
  })
};

// Need to have the post id within the html
function addPostLocal(title, description, username, id){
  document.querySelector('.postForm').style.display = "block";
  const referenceNode = document.querySelector('.container-post');
  const parentNode = document.querySelector('.containerLanding');
  const postTemp = document.querySelector('.post-temp');
  const newTemp = postTemp.cloneNode(true);
  newTemp.setAttribute('data-id', id);
  newTemp.querySelector('.titleMsg').innerText = title;
  newTemp.querySelector('.message').innerText = description;
  newTemp.querySelector('.messageUserName').innerText = `Posted by ${username}`;
  newTemp.style.display = 'block';
  referenceNode.parentNode.insertBefore(newTemp, referenceNode.nextSibling);
};

function liveFeed(event){
  event.preventDefault();
  const aside = document.querySelector('aside');
  if(aside.classList.contains('showAside')){
    aside.classList.remove('showAside');
  } else {
    aside.classList.add('showAside');
    setTimeout(function(){
      listAllPosts(postLiveList);
    }, 525);
  }
};

function deletePost(postId){
  fetch('http://thesi.generalassemb.ly:8080/post/'+postId, {
    method: 'DELETE',
    headers: {
      "Authorization": "Bearer " + localStorage.loginToken,
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
}

callAllPosts(collectAllTokens());
