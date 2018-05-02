# Jobbot-internship-exercise

[Project link](https://superchillb.github.io/Jobbot-internship-exercise/)
(works best when ad-blocker extention is switched off)

### Problem wording

1. Show 10 posts from the API in the browser.
2. For each post show 3 related comments.
3. Under comments show button "load more" to display last 10 comments.

### Tools used in this project

- Vanilla JavaScript
- AJAX (XMLHttpRequest)
- Promises
- Object-Oriented Programming (classes)

### Comments

- For this project, I personally thought it would be best to do it in plain JavaScript to show I have understood the basics of the language and how it works exactly.
- For the simplicity of this exercise, and in order to avoid browser inconsistencies and library dependencies, I decided to use the XMLHttpRequest to request data from the API
- To spice things up, and in order to make the code more modular - although there is no specific reason to do this - I decided to use OOP to generate each post and comment. The code seemed cleaner this way.
- Since each post in the given API has only a maximum number of 5 comments, I could only display the last 2 comments when the 'Load more' button is clicked
- I tried to comment my code as much as possible, hence the seemingly long JS file
