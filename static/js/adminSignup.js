import { showNotification } from './notifier.js';

const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', (e)=>{
    const signupFormData = new FormData(signupForm);
    if(signupFormData.get('password').length > 5 && signupFormData.get('conf-password').length > 5){
        if(signupFormData.get('password') == signupFormData.get('conf-password')){
            fetch('http://127.0.0.1:5000/adminSignup', 
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        username: signupFormData.get('name'),
                        email: signupFormData.get('email'),
                        password: signupFormData.get('password')
                    }
                )
            }
            ).then(resp =>{
                return resp.json();
            }).then(signupResponse =>{
                if(signupResponse.status == 'ok'){
                    showNotification(signupResponse.msg, '#398e3d');
                    setTimeout(()=>{
                        window.open('/adminLogin','_self');
                    },1100)
                } else {
                    showNotification(signupResponse.msg, '#ee534f');
                }
            }).catch(err =>{
                console.log(err);
            })
        } else {
            showNotification("Passwords doesn't match", "#ee534f");
        }
    } else {
        showNotification("Password must be minimum 6 characters", "#ee534f");
    }
    e.preventDefault();
})