import { showNotification } from './notifier.js';

const interviewDeleteBtns = document.querySelectorAll('.bx-trash-alt'),
interviewCodes = document.querySelectorAll('.interview-code'),
editInterviewBtns = document.querySelectorAll('.bx-pencil');

editInterviewBtns.forEach((editInterviewBtn, index) =>{
    editInterviewBtn.addEventListener('click', ()=>{
        window.open(`/updateInterview/${interviewCodes[index - 1].textContent}`,'_self');
    })
})

interviewCodes.forEach((interviewCode, index) =>{
    interviewCode.addEventListener('click', ()=>{
        navigator.clipboard.writeText(interviewCodes[index].textContent.replace(" ",""));
        showNotification('Interview Code Copied to Clipboard', '#398e3d');
    })
})

interviewDeleteBtns.forEach((deleteBtn, index) =>{
    deleteBtn.addEventListener('click', () =>{
        fetch(`http://127.0.0.1:5000/deleteInterview/${interviewCodes[index].textContent}`, {
            method: 'DELETE',
        }).then(res => res.json())
        .then(fullresponse =>{
            if(fullresponse.status == 'ok'){
                showNotification(fullresponse.msg, '#398e3d');
                setTimeout(()=>{
                    window.open('/manageInterview','_self');
                },1100)
            } else {
                showNotification(fullresponse.msg, '#ee534f');
            }
        }).catch(err =>{
            console.log(err);
        })
    })
})