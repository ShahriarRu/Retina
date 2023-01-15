// get the record button by id
const recordButton = document.getElementById("record-button");
// get the stop button by id
const stopButton = document.getElementById("stop-button");
// get the recorded audio element by id
const recordedAudio = document.getElementById("recorded-audio");

// check if the browser supports MediaRecorder API
if (!navigator.mediaDevices) {
  console.error("MediaRecorder is not supported by your browser");
}

// function to update the image
function updateImage() {
  // get the input element
  const input = document.getElementById("image-input");
  // get the image element
  const image = document.getElementById("image-display");
  // check if a file was selected
  if (input.files && input.files[0]) {
    // create a new FileReader object
    const reader = new FileReader();
    // set the onload event to update the image src
    reader.onload = function (e) {
      image.src = e.target.result;
    };
    // read the selected file
    reader.readAsDataURL(input.files[0]);
  }
}

// variables to store the media stream and the MediaRecorder object
let mediaStream, mediaRecorder;

// function to start recording
function startRecording() {
  // get the user's media stream
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then((stream) => {
      // store the media stream
      mediaStream = stream;
      // set the source of the recorded audio element to the media stream
      recordedAudio.srcObject = mediaStream;
      // create a new MediaRecorder object
      mediaRecorder = new MediaRecorder(stream);

      let chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = (event) => {
        const blob = new Blob(chunks, { type: "audio/wav; codecs=opus" });
        chunks = [];
        // create a URL for the audio
        const audioUrl = URL.createObjectURL(blob);
        const audioPlayer = document.getElementById("recorded-audio");
        audioPlayer.src = audioUrl;
        audioPlayer.controls = true;
        // create a download link
        const a = document.createElement("a");
        a.href = audioUrl;
        a.download = "recording.wav";
        a.innerHTML = "Download Recording";
        document.body.appendChild(a);
      };
      // start recording
      mediaRecorder.start();
      // update the record button to indicate that recording is in progress
      recordButton.innerHTML = "Recording...";
      // enable the stop button
      stopButton.disabled = false;
    })
    .catch((err) => {
      console.error("Error getting user media:", err);
    });
}

// function to stop recording
function stopRecording() {
  // stop the media recorder
  mediaRecorder.stop();
  // update the record button to indicate that recording has stopped
  recordButton.innerHTML = "Start Recording";
  // disable the stop button
  stopButton.disabled = true;
  // release the media stream
  mediaStream.getTracks().forEach((track) => track.stop());
}

// add event listeners to the buttons
recordButton.addEventListener("onclick", startRecording);
stopButton.addEventListener("onclick", stopRecording);
