import { showNotification } from './notifier.js';

const createInterviewForm = document.getElementById('createInterviewForm'),
    addQuestionBtn = document.getElementById('addQuestion-btn'),
    deleteQuestionBtn = document.getElementById('deleteQuestion-btn'),
    interviewFormSubmitBtn = document.getElementById('interviewFormSubmitBtn');

let questionsCounter = 0;

interviewFormSubmitBtn.style.display = 'none';

addQuestionBtn.addEventListener('click', () => {
    const questionInput = document.createElement('input'),
        answerTextArea = document.createElement('textarea');

    questionsCounter += 1;
    interviewFormSubmitBtn.style.display = 'block';
    questionInput.required = true;
    answerTextArea.required = true;
    questionInput.setAttribute("type", "text");
    questionInput.placeholder = `Question ${questionsCounter}`;
    answerTextArea.placeholder = "Enter multiple answer keywords seperated by comma punctuation mark";
    answerTextArea.id = `answer${questionsCounter}`;
    answerTextArea.name = `answer${questionsCounter}`;
    questionInput.name = `question${questionsCounter}`;
    questionInput.id = `question${questionsCounter}`;
    createInterviewForm.insertBefore(questionInput, interviewFormSubmitBtn);
    createInterviewForm.insertBefore(answerTextArea, interviewFormSubmitBtn);

})

deleteQuestionBtn.addEventListener('click', () => {
    if (questionsCounter > 0) {
        const questionInput = document.getElementById(`question${questionsCounter}`),
            answerTextArea = document.getElementById(`answer${questionsCounter}`);
        questionInput.remove();
        answerTextArea.remove();
        questionsCounter -= 1;
    }
    if (questionsCounter == 0) {
        interviewFormSubmitBtn.style.display = 'none';
    }
})

createInterviewForm.addEventListener('submit', (e) => {
    const createInterviewFormData = new FormData(createInterviewForm);
    let timeDuration = parseInt(createInterviewFormData.get('questionTimeDuration'));
    if (isNaN(timeDuration)) {
        showNotification('Question duration must be in seconds', '#ee534f');
    } else {
        if (timeDuration < 0) {
            showNotification('Question duration must be greater then 0', '#ee534f');
        } else {
            let interviewData = [];
            for (let i = 1; i <= questionsCounter; i++) {
                let question = createInterviewFormData.get(`question${i}`),
                    answers = createInterviewFormData.get(`answer${i}`);
                interviewData.push(JSON.parse(`{ "${question}" : "${answers}" }`));
            }
            fetch('http://127.0.0.1:5000/createInterview', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    interviewName: createInterviewFormData.get('interviewName'),
                    interviewCode: createInterviewFormData.get('interviewcode'),
                    questionDuration: createInterviewFormData.get('questionTimeDuration'),
                    noOfQuestions: questionsCounter,
                    interviewQuestionsData: interviewData
                })
            }).then(resp => {
                return resp.json();
            }).then(fullResponse => {
                if (fullResponse.status == 'ok') {
                    showNotification(fullResponse.msg, '#398e3d');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1100)
                } else {
                    showNotification(fullResponse.msg, '#ee534f');
                }
            }).catch(err => {
                console.log(err);
                window.open('/adminLogin', '_self');
            })
        }
    }
    e.preventDefault();
})