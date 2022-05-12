const captureBtn = document.getElementById('capture-btn'),
cameraView = document.getElementById('camera'),
displayImage = document.getElementById('displayImage')

displayImage.style.display = 'none';

Webcam.set({
    width: 280,
    height: 220,
    image_format: 'jpeg',
    jpeg_quality: 100
});
Webcam.attach('#camera');

captureBtn.addEventListener('click', ()=>{
    Webcam.snap(function (data_uri) {
        cameraView.style.display = 'none';
        displayImage.style.display = 'block';
        displayImage.src = data_uri;
    });
    captureBtn.innerText = 'Retake'
})