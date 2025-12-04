const URLparam = new URLSearchParams(window.location.search)
const id = URLparam.get("userId")
getProfile()
ProfilePosts()
function getProfile(){
toggleLoader(true)
axios.get(`${baseUrl}/users/${id}`)
.then((res)=>{
toggleLoader(false)

const user = res.data.data
document.getElementById("name").innerHTML = user.name
document.getElementById("username").innerHTML = user.username
document.getElementById("email").innerHTML = user.email
document.getElementById("post_num").innerHTML = user.posts_count
document.getElementById("usersPostName").innerHTML = `${user.name}'s Posts`
document.getElementById("profileImg").src = user.profile_image
})}
function ProfilePosts(){

axios.get(`${baseUrl}/users/${id}/posts`)
.then((res)=>{
    const posts = res.data.data
    document.getElementById("profile_posts").innerHTML = ""
    for (let post of posts){
        let user = JSON.parse(localStorage.user)
        let editbtn  = ``
        let ismyUser = user.id != null && post.author.id == user.id
        if(ismyUser){
            editbtn = `
            <button class = "btn btn-danger" style = "margin-left:5px; float:right;" onclick="deleteThePost('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>
                    <button class = "btn btn-secondary"style =float:right;" onclick="editThePost('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>
            `
        }
        
        const author = post.author
        
        let content = `
        <div class="card mb-5" style="box-shadow: 0px 1px 3px rgb(0 0 0 /0.1),0 1px 2px -1px rgb(0 0 0 /0.1);">
                    <div class="card-header">
                    <img class="post_p_img border border-4" src="${!!Object.keys(author.profile_image).length?author.profile_image:"imgs/default-avatar-icon-of-social-media-user-vector.jpg"}"alt="Profile">
                    <b>@ ${author.name}</b>
                    ${editbtn}
                    </div>
                    <div class="card-body" onclick = "postClicked(${post.id})" style=" cursor: pointer;">
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
                        </span
                        </span>
                    </div>
                    </div>
                </div>
        ` 
        document.getElementById("profile_posts").innerHTML += content
        const currentTag = `tags-${post.id}`
        document.getElementById(currentTag).innerHTML = ""
        for(tag of post.tags){
            let content = `
                <button class=" ms-1 btn btn-sm rounded-5" style = "background-color:gray; color:white;" >policy
                </button>
            `
        document.getElementById(currentTag).innerHTML += content

        }
    }
})
}