const urlparam = new URLSearchParams(window.location.search);
const id = urlparam.get("postId");
getPost();
imIn()

function getPost() {
    axios.get(`${baseUrl}/posts/${id}`)
        .then((res) => {
            const post = res.data.data;
            const comments = post.comments;
            const author = post.author;
            const user_name = document.getElementById("comm_user_name");
            user_name.innerHTML = `${author.name}'s`;

            let content = `
                <div class="card" style="box-shadow: 0px 1px 3px rgb(0 0 0 /0.1),0 1px 2px -1px rgb(0 0 0 /0.1);">
                    <div class="card-header">
                      <img class="post_p_img border border-4" src="${!!Object.keys(author.profile_image).length?author.profile_image:"imgs/default-avatar-icon-of-social-media-user-vector.jpg"}"alt="Profile">
                      <b>@ ${author.name}</b>
                    </div>
                    <div class="card-body">
                      <img class="w-100" src="${post.image}" alt="" >
                      <h4>${[post.title]}</h4>
                      <p>${post.body}</p>
                      <h6 style="color: rgb(138, 138, 138);">${post.created_at}</h6>
                      <hr>
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-dots" viewBox="0 0 16 16">
                          <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                          <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2"/>
                        </svg>
                        <span>(${post.comments_count}) Comments
                        <span id="tags-${post.id}">
                        </span>
                        </span>
                      </div>
                    </div>
                </div>
            `;
            document.getElementById("post_card").innerHTML = content;

            // Clear previous comments before adding new ones
            document.getElementById("comment_post").innerHTML = "";

            for (comment of comments) {
                const comment_auth = comment.author;
                let comment_content = `
                    <div class="card-header mt-2">
                        <img class="post_p_img border border-4" src="${!!Object.keys(comment_auth.profile_image).length?comment_auth.profile_image:"imgs/default-avatar-icon-of-social-media-user-vector.jpg"}"alt="Profile">
                        <b>@ ${comment_auth.name}</b>
                        <div style="margin:10px 0 0 30px">
                            ${comment.body}
                            <hr>
                        </div> 
                    </div>
                `;
                document.getElementById("comment_post").innerHTML += comment_content;
            }
        });
}

let commentInp = document.getElementById("make_comm");
function sendComment() {
    let token = localStorage.token;
    let param = {
        "body": commentInp.value
    };
    axios.post(`${baseUrl}/posts/${id}/comments`, param, {
        headers: {
            "authorization": `Bearer ${token}`
        }
    })
    .then((res) => {
      commentInp.value = ''
        getPost();
      showAlert("Got it! Your comment is now live.")

        
        
    }).catch((e) => {
      const errorMessage = e.response.data.message;
      showAlert(errorMessage,"danger")
  });
}

commentInp.addEventListener("keydown",(e)=>{
  if(e.key === "Enter"){
    sendComment()
  }
})
