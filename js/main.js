const baseUrl = "https://tarmeezacademy.com/api/v1"
let x = 1
let last = 1

getPosts()
window.addEventListener("scroll",()=>{
    const endOfpage =  window.innerHeight + window.scrollY  >= document.body.scrollHeight
    if (endOfpage && x < last){
        x+=1
        getPosts(false,x+1)
        console.log(x);
    }})
function userProfile(userId){
    window.location = `profile.html?userId=${userId}`
}
function profileClicked(){
    let userId = JSON.parse(localStorage.user)
    window.location = `profile.html?userId=${userId.id}`

}
function getPosts(reload = true ,page = 1){
    toggleLoader(true)
    axios.get(`${baseUrl}/posts?limit=5&page=${page}`)
.then((res)=>{
    toggleLoader(false)
    last = res.data.meta.last_page
    const posts = res.data.data
    if(reload){
        document.getElementById("posts").innerHTML = "" 
    }
    for (let post of posts){
        let editbtn  = ``
            if(localStorage.user){
        let user = JSON.parse(localStorage.user)
        let ismyUser = user.id != null && post.author.id == user.id
        if(ismyUser){
        editbtn = `
                <button class="btn btn-danger" style="margin-left:5px; float:right;" onclick="deleteThePost('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>
                <button class="btn btn-secondary" style="float:right;" onclick="editThePost('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>`}
        }
        const author = post.author
        
        let content = `
        <div class="card mb-5" style="box-shadow: 0px 1px 3px rgb(0 0 0 /0.1),0 1px 2px -1px rgb(0 0 0 /0.1);">
                    <div class="card-header">
                    <span onclick="userProfile(${author.id})" style="cursor: pointer;">
                    <img class="post_p_img border border-4" src="${!!Object.keys(author.profile_image).length?author.profile_image:"imgs/default-avatar-icon-of-social-media-user-vector.jpg"}"alt="Profile">
                    <b>@ ${author.name}</b>
                    </span>
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
        document.getElementById("posts").innerHTML += content
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

        let img = document.getElementById("post_image")
        if(img){
        img.addEventListener("change",function(e){
        const file = e.target.files[0]
        let imgShow = document.getElementById("showimg")
        let urlImg = URL.createObjectURL(file)
        imgShow.src = urlImg
        imgShow.style.display = "block"
    })
        }
    function DeleteSrc(){
        let imgShow = document.getElementById("showimg")
        imgShow.style.display = "none"
    }


function loginsucc(){
    const username = document.getElementById("name_inp").value
    const password = document.getElementById("password_inp").value
    const param = {
        "username" : username,
        "password" : password
    }
    axios.post(`${baseUrl}/login`,param)
    .then((res) => {
    localStorage.setItem("token", res.data.token)
    localStorage.setItem("user", JSON.stringify(res.data.user))
    const modal = document.getElementById("login")
    const modalinst = bootstrap.Modal.getInstance(modal)
    modalinst.hide()
    showAlert("We're happy to have you back.","login")
    placeData()
    imIn()
    } ).catch((e) => {
        const errorMessage = e.response.data.message;
        showAlert(errorMessage,"danger")
    })
}
function imIn (){
    let token = localStorage.token
    let login = document.getElementById("loginBtn")
    let logout = document.getElementById("logoutBtn")
    let addPost = document.getElementById("addPosts")
    let profbtn = document.getElementById("Prof")
    if (token != null){
        login.style.setProperty("display","none","important")
        logout.style.setProperty("display","flex","important")
        profbtn.style.setProperty("display","flex","important")
    
        if(addPost != null){

            addPost.style.setProperty("display","flex","important")
        }
    }else{
        login.style.setProperty("display","flex","important")
        logout.style.setProperty("display","none","important")
        profbtn.style.setProperty("display", "none","important")
        if(addPost != null){
        addPost.style.setProperty("display","none","important")

    }}
    
}
function logout (){
    localStorage.clear()
    showAlert("Logged out. See you soon!", "logout")
    imIn()
}

function showAlert(message,type) {
    if(type != "danger"){
        document.getElementById("showAlert").style.backgroundColor = "#096f4d85"
    }
const alertPlaceholder = document.getElementById('showAlert')
const appendAlert = (message, type) => {
const wrapper = document.createElement('div')
wrapper.id = "showHide"
wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert" style = "margin :0;">`,
    `<div>${message}</div>`,
    '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
].join('')

alertPlaceholder.append(wrapper)
}
appendAlert(message, type)
    setTimeout(() => {
        const alert = bootstrap.Alert.getOrCreateInstance('#showHide')
        alert.close()
}, 3000);}
imIn()
function registersucc(){
    const name = document.getElementById("reg-name_inp").value
    const username = document.getElementById("reg-username_inp").value
    const password = document.getElementById("reg-password_inp").value
    const email = document.getElementById("reg-email_inp").value
    const profile_img = document.getElementById("pro_img").files[0]
    const formData = new FormData()
    formData.append("username",username)
    formData.append("password",password)
    formData.append("name",name)
    formData.append("email",email)
    formData.append("image",profile_img)
    const headers = {
        headers : {
            "Content-Type" : "multipart/form-data ",
        }
    }

    axios.post(`${baseUrl}/register`,formData,headers)
    .then((res) => {
    localStorage.setItem("token", res.data.token)
    localStorage.setItem("user", JSON.stringify(res.data.user))
    const modal = document.getElementById("register")
    const modalinst = bootstrap.Modal.getInstance(modal)
    modalinst.hide()
    placeData()
        showAlert("Welcome! Your account is ready to go.")

    imIn()
    }).catch((e) => {
        const errorMessage = e.response.data.message;
        showAlert(errorMessage,"danger")
    })}

    function placeData() {
        const userNameProfile = document.getElementById("usernamePro")
        const userData  = JSON.parse(localStorage.getItem("user"))
        userNameProfile.innerHTML = userData.name
        const userImg = document.getElementById("userImg")
        userImg.src = `${!!Object.keys(userData.profile_image).length? userData.profile_image :"imgs/default-avatar-icon-of-social-media-user-vector.jpg"}`
    }
    function createPost(){
        let post_id = document.getElementById("post_id_inp")
        let isCreate = post_id.value == null || post_id.value == "";
        const title = document.getElementById("postTitle")
        const body = document.getElementById("postBody")
        const myform = document.getElementById("myForm")
        let img = document.getElementById("post_image")
        const formData = new FormData()
        formData.append("title",title.value)
        formData.append("body",body.value)
        formData.append("image",img.files[0])
        const token = localStorage.token
            toggleLoader(true)
            let url = ``
            const headers = {
                headers : {
                    "Content-Type" : "multipart/form-data ",
                    "authorization" : `Bearer ${token}`
                }
            }
            if(isCreate){
                url = `${baseUrl}/posts`
            }else{
                formData.append("_method","put")
                url = `${baseUrl}/posts/${post_id.value}`
            }
            axios.post(url,formData,headers)
            .then(() => {
                toggleLoader(false)
            const modal = document.getElementById("createPost")
            const modalinst = bootstrap.Modal.getInstance(modal)
            modalinst.hide()
            myform.reset()
            getPosts()
            getProfile()
            ProfilePosts()
            DeleteSrc()
            isCreate?showAlert("Awesome! Your new post is now published."):showAlert("The Post has been updated.")
            post_id.value = ""
            }).catch((e)=>{
                // const errorMessage = e.response.data.message;
                console.log(e);
                
                showAlert(errorMessage,"danger")
                
            })
        }    
            function postClicked(id){
                window.location = `comments.html?postId=${id}`
                
            }
            function resetForm(){
                setTimeout(() => {
                document.getElementById("myForm").reset()
                document.getElementById("showimg").src = ""
                document.getElementById("showimg").style.visibility= "hidden"
                }, 3000);
                
            }
            function editThePost(post){
                let postData = JSON.parse(decodeURIComponent(post))
                let post_value = document.getElementById("post_id_inp")
                post_value.value = postData.id
                document.getElementById("createPost-title").innerHTML = "Edit Your Post"
                document.getElementById("update_post").innerHTML = "Update"
                document.getElementById("postTitle").value = postData.title
                document.getElementById("postBody").value =  postData.body
                let editModal = new bootstrap.Modal(document.getElementById("createPost"),{})
                editModal.toggle()
            }
            function deleteThePost(post){
                let postData = JSON.parse(decodeURIComponent(post))
                let post_value = document.getElementById("delpost_id_inp")
                post_value.value = postData.id
                let editModal = new bootstrap.Modal(document.getElementById("deletePost"),{})
                editModal.toggle()
            }

            function confirmDeletePosts(){
                const token = localStorage.token
                let post_value = document.getElementById("delpost_id_inp")
                            const headers = {
                headers : {
                    "Content-Type" : "multipart/form-data ",
                    "authorization" : `Bearer ${token}`
                }
            }
    axios.delete(`${baseUrl}/posts/${post_value.value}`,headers)
    .then((res) => {
    const modal = document.getElementById("deletePost")
    const modalinst = bootstrap.Modal.getInstance(modal)
    modalinst.hide()
    showAlert("Post Had Been Deleted","danger")
    getPosts()
    getProfile()
    ProfilePosts()
    } ).catch((e) => {
        const errorMessage = e.response.data.error_message;
        showAlert(errorMessage,"danger")}
)}
            function editName(){
                document.getElementById("createPost-title").innerHTML = "Create Post"
                document.getElementById("update_post").innerHTML = "Post"

            }
            
            
    placeData()


function toggleLoader(show = true){
    let loader = document.getElementById("LoaderStyle")
    if(show){
        loader.style.visibility = "visible"
    }else{
        loader.style.visibility = "hidden"
    }
}

