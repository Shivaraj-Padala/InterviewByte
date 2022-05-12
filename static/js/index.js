import { showNotification } from './notifier.js';

const verificationCloseBtn = document.getElementById('verify-container-close'),
interviewVerifyForm = document.getElementById('interview-verify-container'),
interviewBtn = document.getElementById('interview-btn');

interviewBtn.addEventListener('click', ()=>{
    interviewVerifyForm.style.display = 'block';
})

verificationCloseBtn.addEventListener('click', ()=>{
    interviewVerifyForm.style.display = 'none';
})

interviewVerifyForm.addEventListener('submit', (e)=>{
    const interviewCodeForm = new FormData(interviewVerifyForm);
    fetch('http://127.0.0.1:5000/',{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            interviewCode: interviewCodeForm.get('interview-code')
        })
    }).then(resp =>{
        return resp.json();
    }).then(fullResp =>{
        if(fullResp.status == 'ok'){
            showNotification(fullResp.msg, '#398e3d');
            setTimeout(()=>{
                window.open(`/registerInterview/${interviewCodeForm.get('interview-code')}`,'_self');
            },1100)
        } else {
            showNotification(fullResp.msg, '#ee534f');
        }
    }).catch(err =>{
        console.log(err);
    })
    e.preventDefault();
})