const login = document.getElementById('login');
const email = document.getElementById('email');
const password = document.getElementById('password');


login.addEventListener('click',(e)=>{
    e.preventDefault();
    const email = email.value;
    const password=password.value;
    const pro=firebase.auth().signInWithEmailAndPassword(email,password);
    pro.catch(e => window.alert("Incorrect email or password"));
})

