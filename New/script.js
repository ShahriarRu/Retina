let audioCtx;
let recorder;
let recording = false;
let recordedBlob;
const fileName = "Recording.mp3";

const recordButton = document.getElementById("record-button");
const playButton = document.getElementById("play-button");

recordButton.addEventListener("click", () => {
  if (recording) {
    recorder.stop();

    recordButton.textContent = "Start Recording";
    playButton.disabled = false;
    recording = false;
  } else {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      recorder = new MediaRecorder(stream);
      recorder.start();
      recordButton.textContent = "Stop Recording";
      recording = true;
      recorder.addEventListener("dataavailable", (e) => {
        recordedBlob = e.data;
      });
    });
  }
});

playButton.addEventListener("click", () => {
  const audioUrl = URL.createObjectURL(recordedBlob);
  const audio = new Audio(audioUrl);
  saveAs(recordedBlob, fileName, { autoBom: true });
  audio.play();
});
