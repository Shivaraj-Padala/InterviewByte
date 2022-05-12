import { showNotification } from './notifier.js';

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (e)=>{
    const loginFormData = new FormData(loginForm);

    fetch('http://127.0.0.1:5000/adminLogin', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: loginFormData.get('email'),
            password: loginFormData.get('password')
        })
    }).then(resp =>{
        return resp.json();
    }).then(loginResp =>{
        if(loginResp.status == 'ok'){
            showNotification(loginResp.msg, '#398e3d');
            setTimeout(()=>{
                window.open('/manageInterview','_self');
            },1100)
        } else {
            showNotification(loginResp.msg, '#ee534f');
        }
    }).catch(err =>{
        console.log(err);
    })
    e.preventDefault();
})