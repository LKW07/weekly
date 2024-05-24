//Selector for your <video> element
const video = document.querySelector('#webcam');

//Core
window.navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        video.onloadedmetadata = (e) => {
            video.play();
        };
    })
    .catch( () => {
        alert('You have give browser the permission to run Webcam and mic ;( ');
    });