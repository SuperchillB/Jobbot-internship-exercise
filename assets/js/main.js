// -----------------------------------
// PROBLEM WORDING
// -----------------------------------

// 1. Show 10 posts from the API in the browser.
// 2. For each post show 3 related comments.
// 3. Under comments show button "load more" to display last 10 comments.


// -----------------------------------
// GLOBALS & CLASSES
// -----------------------------------

// DOM variables
let postsContainer = document.querySelector('.posts-container'),
    commentsContainer = document.getElementsByClassName('post-comment-container'),
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

// Switches
// let btnIsClicked = false; // to determine whether 'load more' btn was clicked for the first time

// create class 'Posts' from which we will instantiate posts with their respective comments
class Posts {
    // constructor(title, content, {name = '', email = '', body = ''}) {
    constructor(title, content) {
        this.title = title;
        this.content = content;
        // this.comments = {name, email, body};
    }
    // method to append a block of pre-written HTML code into the DOM in the form of post cards
    appendPost(){
        return ("<article>"+
                    "<h2 class='post-title'>"+ this.title +"</h2>"+
                    "<div class='post-content'>"+ this.content +"</div>"+
                    "<div class='post-comment-container'>Comments</div>"+
                    "<div class='post-btn'>Load more</div>"+
                "</article>");
    }
    // // method to append a block of pre-written HTML code into the DOM in the form of comments
    // appendComments(){
    //     return ("<div class='post-comment-name'><a href='mailto:"+ this.comments.email +"'>"+ this.comments.name +"</a></div>"+
    //             "<div class='post-comment-body'>"+ this.comments.body +"</div>"+
    //             "<hr>");
    // }
}

// create class 'Comments' from which we will instantiate comments
class Comments {
    constructor(name, email, body, isShown) {
        this.name = name;
        this.email = email;
        this.body = body;
        this.isShown = false;
    }
    // method to append a block of pre-written HTML code into the DOM (shown comments)
    appendShownComment(){
        return ("<div class='post-comment-group shown'>"+
                    "<div class='post-comment-name'><a href='mailto:"+ this.email +"'>"+ this.name +"</a></div>"+
                    "<div class='post-comment-body'>"+ this.body +"</div>"+
                "<hr>"+
                "</div>");
    }
    // method to append a block of pre-written HTML code into the DOM (hidden comments)
    appendHiddenComment(){
        return ("<div class='post-comment-group hidden' style='display:none'>"+
                    "<div class='post-comment-name'><a href='mailto:"+ this.email +"'>"+ this.name +"</a></div>"+
                    "<div class='post-comment-body'>"+ this.body +"</div>"+
                "<hr>"+
                "</div>");
    }
}



// -----------------------------------
// AJAX - POSTS
// -----------------------------------

XHR_posts.open("GET", postsURL);
XHR_posts.responseType = 'json';
XHR_posts.send();
XHR_posts.onload = function() {
    let posts = XHR_posts.response;
    showPosts(posts);
}

function showPosts (objects) {
// CREATE FUNCTION RIGHT BELOW     
	// get 10 random posts from given API
	// for(let i = 0; i < 10; i++){ // for loop to avoid duplicates
	// 	let randomObj = giveRandomItem(100, objects); // save random post in randomObj variable
	// 	if (randomPosts.indexOf(randomObj) == -1) { // if given post isn't in the array
	// 		randomPosts.push(randomObj);
	// 	} else { // if given post is a duplicate of a post already saved in the array
	// 		i--;
	// 	}
	// }
    getRandomElements(10, objects, randomPosts);
// END OF FUNCTION ABOVE    
    console.log("The 10 randomly selected posts are ", randomPosts);

    // create empty variable that will contain a string of HTML code for a single post
    let postCard = '';
    // append each of the 10 randomly selected posts to the DOM
    for(let i = 0; i < randomPosts.length; i++){
        // instantiate from Posts class
        // postCard = new Posts(randomPosts[i].title, randomPosts[i].body, {name: '', email: '', body: ''}).appendPost();
        postCard = new Posts(randomPosts[i].title, randomPosts[i].body).appendPost();
        // append to HTML
        postsContainer.innerHTML += postCard;
    }

    // create a counter variable to generate an id for each post
    let postIdCounter = 1;
    // iterate through each created article
    for(let i = 0; i < document.getElementsByTagName('article').length; i++){
        // add corresponding id to postCard
        document.getElementsByTagName('article')[i].setAttribute("id", "post-" + postIdCounter);
        // // increment id counter
        postIdCounter++;
    }


    // -----------------------------------
    // AJAX - COMMENTS
    // -----------------------------------

    XHR_comments.open("GET", commentsURL);
    XHR_comments.responseType = 'json';
    XHR_comments.send();
    XHR_comments.onload = function() {
        let comments = XHR_comments.response;
        showComments(comments);
    }

    function showComments (objects) {
        // iterate through each of the 10 randomly selected posts
        for(let i = 0; i < randomPosts.length; i++){
            // for each of these posts, compare their id with that of each of the 500 comments
            for(let j = 0; j < objects.length; j++){
                // if they match
                if (objects[j].postId == randomPosts[i].id) {
                    // push the comment to a temporary array
                    temp_comments.push(objects[j]);
                }
            }
            console.log("The 5 comments for post # " + (i+1) + " are ", temp_comments);          
            // create an empty array that will store 3 random comments related to each of the 10 posts
            let temp_shownComments = [];
// CREATE FUNCTION RIGHT BELOW  
            // get 3 random comments from given API
            // for(let k = 0; k < 3; k++){ // for loop to avoid duplicates
            //     let randomObj = giveRandomItem(5, temp_comments); // save random comment in randomObj variable
            //     if (temp_shownComments.indexOf(randomObj) == -1) { // if given comment isn't in the array
            //         temp_shownComments.push(randomObj);
            //     } else { // if given comment is a duplicate of a comment already saved in the array
            //         k--;
            //     }
            // }
            getRandomElements(3, temp_comments, temp_shownComments);
// END OF FUNCTION ABOVE
            console.log("The 3 shown comments for post # " + (i+1) + " are ", temp_shownComments);
            
            // iterate through each of the 3 shown comments
            for(let l = 0; l < temp_shownComments.length; l++){
                // instantiate from Comments class
                shownComment = new Comments(temp_shownComments[l].name, temp_shownComments[l].email, temp_shownComments[l].body, true).appendShownComment();
                // append to HTML
                commentsContainer[i].innerHTML += shownComment;
            }

            // iterate through each of the 5 related comments
            for(let m = 0; m < temp_comments.length; m++){
                if (temp_shownComments.indexOf(temp_comments[m]) == -1) {
                    console.log(temp_comments[m]);
                    // instantiate from Comments class
                    hiddenComment = new Comments(temp_comments[m].name, temp_comments[m].email, temp_comments[m].body, false).appendHiddenComment();
                    // append to HTML
                    commentsContainer[i].innerHTML += hiddenComment;
                }
            }

            // when user clicks on 'load more' button show hidden comments
            postBtn[i].addEventListener('click', function(event){
                // set btnIsClicked to true (button was clicked for the first time)
                let btnIsClicked = true;
                // select all hidden comments in given post
                let temp_hidden = document.getElementById("post-" + (i+1)).getElementsByClassName('hidden');
                // select 'load more' button in given post
                let temp_btn = document.getElementById("post-" + (i+1)).querySelector('.post-btn');

                // let element = event.target;
                // console.log("btn " + element.parentNode.getAttribute("id") + " was clicked");

                // display each of these hidden comments in given post
                for(let hiddenCounter = 0; hiddenCounter < temp_hidden.length; hiddenCounter++){
                    if (temp_hidden[hiddenCounter].style.display == 'none') {
                        // show hidden comments
                        temp_hidden[hiddenCounter].style.display = 'block';
                        // change content of btn to 'hide last comments'
                        temp_btn.textContent = 'Hide last comments';
                    } else if (temp_hidden[hiddenCounter].style.display = 'block') {
                        // hide hidden comments
                        temp_hidden[hiddenCounter].style.display = 'none';
                        // change content of btn to 'hide last comments'
                        temp_btn.textContent = 'Load more';
                    }
                }
            });

            // when user clicks on 'hide comments' button hide hidden comments
            // postBtn[i].addEventListener('click', showHiddenComments);

            // empty temp_comments to store the 5 comments of the following post
            temp_comments = [];
        }
    }
}



// -----------------------------------
// HELPER FUNCTIONS
// -----------------------------------

// function that gives a random item in a given array
// function giveRandomItem (arrLength, array) {
// 	let randomNumber = Math.floor(Math.random()*arrLength);
// 	return array[randomNumber];
// }

// function that gets given number of random posts/comments
function getRandomElements (qty, jsonArr, finalArr) {
    for(let el = 0; el < qty; el++){ // for loop to avoid duplicates
        let randomObj = jsonArr[Math.floor(Math.random()*jsonArr.length)]; // save random post/comment in randomObj variable
        if (finalArr.indexOf(randomObj) == -1) { // if given post/comment isn't in the array
            finalArr.push(randomObj);
        } else { // if given post/comment is a duplicate of a post/comment already saved in the array
            el--;
        }
    }
}
































// // 1. Show 10 posts from the API in the browser.
// // 2. For each post show 3 related comments.
// // 3. Under comments show button "load more" to display last 10 comments.


// // -----------------------------------
// // LOAD POSTS
// // -----------------------------------

// // DOM variables
// let postsContainer = document.querySelector('.posts-container');

// // AJAX-related variables
// let XHR_posts = new XMLHttpRequest(),
//     XHR_comments = new XMLHttpRequest(),
//     postsURL = "https://jsonplaceholder.typicode.com/posts",
//     commentsURL = "https://jsonplaceholder.typicode.com/comments"

// // Arrays used to store posts and comments
// let randomPosts = []; // array collecting 10 random posts
// let randomComments = []; // array collecting 3 random comments for each post

// // XHR_posts.onreadystatechange = function(){
// //  // check if request was finished and actually worked
// //  if (XHR_posts.readyState == 4 && XHR_posts.status == 200) {
// //      // console.log(XHR_posts.responseText);
// //      console.log(JSON.parse(XHR_posts.responseText));
// //  } else {
// //      console.log("Error");
// //  }
// // };

// XHR_posts.open("GET", postsURL);
// XHR_posts.responseType = 'json';
// XHR_posts.send();

// XHR_posts.onload = function() {
//     let posts = XHR_posts.response;
//     // console.log(posts);
//     showPosts(posts);
// }

// // create class 'Posts' from which we will instantiate posts with their respective comments
// class Posts {
//     constructor(title, content, {name = '', email = '', body = ''}) {
//         this.title = title;
//         this.content = content;
//         this.comments = {name, email, body};
//     }
//     // method to append a block of pre-written HTML code into the DOM in the form of post cards
//     appendPost(){
//         return ("<article>"+
//                     "<h2 class='post-title'>"+ this.title +"</h2>"+
//                     "<div class='post-content'>"+ this.content +"</div>"+
//                     "<div class='post-comment-container'>Comments</div>"+
//                     "<div class='post-btn'>Load More</div>"+
//                 "</article>");
//     }
//     // method to append a block of pre-written HTML code into the DOM in the form of comments
//     appendComments(){
//         return ("<div class='post-comment-name'><a href='mailto:"+ this.comments.email +"'>"+ this.comments.name +"</a></div>"+
//                 "<div class='post-comment-body'>"+ this.comments.body +"</div>"+
//                 "<hr>");
//     }
// }

// // create class 'Comments' from which we will instantiate comments
// // class Comments {
// //     constructor(name, email, body) {
// //         this.name = name;
// //         this.email = email;
// //         this.body = body;
// //     }
// //     // method to append a block of pre-written HTML code into the DOM
// //     append(){
// //         return ("<div class='post-comment-name'><a href='mailto:"+ this.email +"'>"+ this.name +"</a></div>"+
// //                 "<div class='post-comment-body'>"+ this.body +"</div>"+
// //                 "<hr>");
// //     }
// // }

// function showPosts (objects) {
//     // get 10 random posts from given API
//     // let randomPosts = []; // array collecting 10 random posts
//     for(let i = 0; i < 10; i++){ // for loop to avoid duplicates
//         let randomObj = giveRandomItem(100, objects); // save random post in randomObj variable
//         if (randomPosts.indexOf(randomObj) == -1) { // if given post isn't in the array
//             randomPosts.push(randomObj);
//         } else { // if given post is a duplicate of a post already saved in the array
//             i--;
//         }
//     }
//     console.log(randomPosts);
// // -------------
// // WITHOUT OOP
// // -------------

//     // for(let i = 0; i < randomPosts; i++){
//     //     // create DOM elements
//     //     let postCard = document.createElement("article"),
//     //         postCardTitle = document.createElement("h2"),
//     //         postCardContent = document.createElement("div"),
//     //         postCardComments = document.createElement("div"),
//     //         postCardBtn = document.createElement("div");

//     //     // give DOM elements their respective attributes


//     //     postsContainer.appendChild();
//     //     randomPosts[i].title
//     // }

// // -------------
// // WITH OOP
// // -------------
//     // create empty variable that will contain a string of HTML code for a single post
//     let postCard = '';
//     // append each of the 10 randomly selected posts to the DOM
//     for(let i = 0; i < randomPosts.length; i++){
//         // instantiate from Posts class
//         postCard = new Posts(randomPosts[i].title, randomPosts[i].body, {name: '', email: '', body: ''}).appendPost();
//         // append to HTML
//         postsContainer.innerHTML += postCard;
//     }

// }



// // -----------------------------------
// // LOAD COMMENTS
// // -----------------------------------

// XHR_comments.open("GET", commentsURL);
// XHR_comments.responseType = 'json';
// XHR_comments.send();

// XHR_comments.onload = function() {
//     let comments = XHR_comments.response;
//     // console.log(posts);
//     // showComments(comments);
// }

// function showComments (objects) {
// // -------------
// // WITH OOP
// // -------------
//     // get 3 random comments from given API
//     let randomComments = []; // array collecting 3 random comments
//     for(let i = 0; i < 3; i++){ // for loop to avoid duplicates
//         let randomObj = giveRandomItem(100, objects); // save random comment in randomObj variable
//         if (randomComments.indexOf(randomObj) == -1) { // if given comment isn't in the array
//             randomComments.push(randomObj);
//         } else { // if given comment is a duplicate of a comment already saved in the array
//             i--;
//         }
//     }
//     console.log(randomComments);

//     // create empty variable that will contain a string of HTML code for a single comment
//     let shownComments = '';
//     // append each of the 3 randomly selected comments to the post
//     for(let i = 0; i < randomComments; i++){
//         // instantiate from Comments class
//         shownComments = new Comments(randomComments[i].name, randomComments[i].email, randomComments[i].body).append();
//         // !!! append to HTML => SELECT CORRESPONDING POST BASED ON ID
//         if (condition) {
//             // statement
//         }
//         // .innerHTML += shownComments;
//     }
// }



// // -----------------------------------
// // HELPER FUNCTIONS
// // -----------------------------------

// // function that gives a random item in a given array
// function giveRandomItem (arrLength, array) {
//     let randomNumber = Math.floor(Math.random()*arrLength);
//     return array[randomNumber];
// }