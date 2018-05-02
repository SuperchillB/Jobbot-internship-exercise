// -----------------------------------
// PROBLEM WORDING
// -----------------------------------

// 1. Show 10 posts from the API in the browser.
// 2. For each post show 3 related comments.
// 3. Under comments show button "load more" to display last 10 comments.


document.addEventListener("DOMContentLoaded", function() {
    
    // -----------------------------------
    // GLOBALS & CLASSES
    // -----------------------------------

    // DOM variables
    let postsContainer = document.querySelector('.posts-container'),
        commentsContainer = document.getElementsByClassName('post-comment-container'),
        article = document.getElementsByTagName('article');
        postBtn = document.getElementsByClassName('post-btn');

    // AJAX-related variables
    let XHR_posts = new XMLHttpRequest(),
        XHR_comments = new XMLHttpRequest(),
        postsURL = "https://jsonplaceholder.typicode.com/posts",
        commentsURL = "https://jsonplaceholder.typicode.com/comments"

    // Arrays used to store posts and comments
    let randomPosts = [], // array collecting 10 random posts
        temp_comments = [], // array collecting 50 comments (5 for each of the 10 posts)
        randomComments = []; // array collecting 3 random comments for each post


    // -----------------------------------
    // AJAX (POSTS AND COMMENTS)
    // -----------------------------------

    // load posts from JSON via a Promise
    let promisePosts = new Promise(function(resolve, reject) {
        // get data from posts JSON
        ajax(postsURL, function(posts){
            resolve(posts); // success
        }) 
    });

    // load comments from JSON via a Promise
    let promiseComments = new Promise(function(resolve, reject) {
        // get data from comments JSON
        ajax(commentsURL, function(comments){
            resolve(comments); // success
        }) 
    });

    // once data is loaded, launch showPosts function
    Promise.all([promisePosts, promiseComments]).then(function(data) {
        // console.log(data);
        showPosts(data[0], data[1]); // index 0 for posts & index 1 for comments
    });

    // create class 'Posts' from which we will instantiate posts with their respective comments
    class Posts {
        constructor(title, content, id, comments, container) {
            this.title = title;
            this.content = content;
            this.id = id; // gives an id to each appended post (article)
            this.comments = getRandomElements(comments.length, comments); 
            this.container = container; // container element inside of which either posts or comments are appended
            this.shownComment = 3; // max number of comments to be displayed
            this.appendPost(); // once object is constructed, launch appendPost method
        }
        // method to append a block of pre-written HTML code into the DOM in the form of post cards
        appendPost(){
            let that = this; // to avoid scope issues
            let html = ''; // will contain a string representing an HTML block

            // HTML structure of each post:
            html += "<article id=post"+ this.id +">"+
                        "<h2 class='post-title'>"+ this.title +"</h2>"+
                        "<div class='post-content'>"+ this.content +"</div>"+
                        "<div class='post-comment-container'><i class='fas fa-comments'></i> Comments (<span></span>)"; // div is closed later

            // iterate through each comment and select 3 of them to be displayed as shown comments
            this.comments.forEach(function(comment, index) {
                // select first 3 comments of the array of shuffled comments per post
                if (index < that.shownComment) {
                    html += "<div class='post-comment-group shown'>"+
                                "<div class='post-comment-name'><a href='mailto:"+ comment.email +"'>"+ comment.name +"</a></div>"+
                                "<div class='post-comment-body'>"+ comment.body +"</div>"+
                                "<hr>"+
                            "</div>";
                }
            });

            // closing the post HTML structure
            html +=     "</div><div class='post-btn'><div>Load more</div></div>"+ // we close here the div of '.post-comment-container'
                    "</article>";

            // we save the entire HTML block in the html property
            this.html = html;
        }

        // method to load and append the additional hidden comments that weren't initially displayed
        loadMore() {
            let that = this; // to avoid scope issues
            let html = ''; // will contain a string representing an HTML block

            // iterate through each comment and select the rest of them (2) to be displayed as hidden comments
            this.comments.forEach(function(comment, index) {
                // select last comments (2) of the array of shuffled comments per post
                if (index >= that.shownComment) {
                    html += "<div class='post-comment-group hidden''>"+
                                "<div class='post-comment-name'><a href='mailto:"+ comment.email +"'>"+ comment.name +"</a></div>"+
                                "<div class='post-comment-body'>"+ comment.body +"</div>"+
                            "<hr>"+
                            "</div>";
                }
            });

            // append the entire HTML block of hidden comments collected in 'html' to the comments section in the HTML
            document.querySelector('#post'+ this.id + ' .post-comment-container').innerHTML += html;
        }
    }

    function showPosts (posts, comments) {
        // select 10 posts from the posts JSON at random
        let randomPosts = getRandomElements(10, posts);
        // console.log("The 10 randomly selected posts are ", randomPosts);

        // create empty array that will collect the 10 randomly selected posts in the form of objects
        let newPostArr = [];

        // store each of the 10 randomly selected post objects to the newPostArr array
        for(let i = 0; i < randomPosts.length; i++){
            // create array called 'postComment' which will contain all related comments to each of the 10 randomly selected posts
            let postComment = comments.filter(function(comment){
                return comment.postId == randomPosts[i].id; // return all the comments whose 'postId' = the 'id' of the related post
            });
            // instantiate new post from Posts object and store it in variable 'newPost' 
            let newPost = new Posts(randomPosts[i].title, randomPosts[i].body, i+1, postComment, postsContainer);
            // push this new post object into the previously created array
            newPostArr.push(newPost);
            // repeat this for each of the 10 randomly selected posts
        }

        // loop through each item of the previously created array containing all 10 post objects
        newPostArr.forEach( function(newPost, index) {
            // for each of these objects, append their html property (block of HTML) into the container element of all the posts (postsContainer)
            postsContainer.innerHTML += newPost.html;

            // display number of comments for each post after 'Comments' on page
            document.getElementsByTagName('span')[index].textContent = newPost.comments.length;
        });

        // 'Load more' button
        newPostArr.forEach(function(newPost, index) {
            // when 'Load more' button is clicked
            document.getElementById('post'+newPost.id).querySelector('.post-btn').addEventListener('click', function(){
                // launch loadMore() method stated inside the Posts class
                newPost.loadMore();
                // make 'load more' button disappear since there are no more comments to display after that
                this.style.display = 'none';
            })
        });


    }

    // -----------------------------------
    // DOM FUNCTIONS
    // -----------------------------------

    // function that toggles shadow on header when page is scrolled
    window.onscroll = function showShadowHeader(){
        let header = document.querySelector('.header'),
            postsContainerTop = postsContainer.getBoundingClientRect().top;
        if (postsContainerTop <= 70) {
            header.classList.add('header-shadow');
        } else {
            header.classList.remove('header-shadow');
        }
    }
})



// -----------------------------------
// HELPER FUNCTIONS
// -----------------------------------

// function to make a GET ajax request
function ajax (url, callback) {
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success
            let data = JSON.parse(request.responseText);
            callback(data);
        } else {
            // Target server reached, but an error is returned
            callback(request, 'Error');
        }
    };
    request.onerror = function() {
        // Connection error
        callback(request, 'Error');
    };
    request.send();
}

// function that returns given number of random posts/comments
function getRandomElements (qty, jsonArr) {
    // declare empty array that will collect the randomly selected elements
    let finalArr = [];
    for(let el = 0; el < qty; el++){ // for loop to avoid duplicates
        let randomObj = jsonArr[Math.floor(Math.random()*jsonArr.length)]; // save random post/comment in randomObj variable
        if (finalArr.indexOf(randomObj) == -1) { // if given post/comment isn't in the array
            finalArr.push(randomObj);
        } else { // if given post/comment is a duplicate of a post/comment already saved in the array
            el--;
        }
    }
    return finalArr;
}