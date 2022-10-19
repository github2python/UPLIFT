var messagesRef = firebase.database().ref('users');

document.getElementById('resume-form').addEventListener('submit', submitResume);


function submitResume(event) {
    event.preventDefault();

    var username = document.getElementById("username").value;
    var skill = document.getElementById("skill").value;
    var stack = document.getElementById("describe").value;

    // Save message
    saveResume(username, skill, describe);

    document.getElementById('resume-form').reset();

    location.replace("trainers.html");

}


function saveResume(username, skill, describe) {
    var newMessageRef = messagesRef.push();
    newMessageRef.set({
        username: username,
        skill: skill,
        description: describe

    });
}