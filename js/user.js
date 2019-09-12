
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
}
}
​

const createPost(event) {
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
}
