import React, { useState } from 'react';
import { ReactMic } from 'react-mic';
import axios from 'axios';

function SpeechInput() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const onData = (recordedBlob) => {
    console.log('chunk of real-time data is: ', recordedBlob);
  };

  const onStop = (recordedBlob) => {
    console.log('recordedBlob is: ', recordedBlob);
    setRecordedBlob(recordedBlob);
  };

  const handleSend = async () => {
    if (recordedBlob) {
      try {
        // Convert the recorded audio to a file
        const audioFile = new File([recordedBlob.blob], 'audio.mp3', { type: 'audio/mp3' });


        // Create a FormData object and append the audio file
        const formData = new FormData();
        formData.append('audio', audioFile);

        // Send the audio file to your server
        const response = await axios.post('http://localhost:3005/api/ai', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <ReactMic
        record={isRecording}
        className="sound-wave"
        onStop={onStop}
        onData={onData}
        strokeColor="#000000"
        backgroundColor="#FF4081" />
      <button onClick={startRecording} type="button">Start</button>
      <button onClick={stopRecording} type="button">Stop</button>
      <button onClick={handleSend} type="button">Send</button>
      {recordedBlob && <a href={recordedBlob.blobURL} target="_blank" rel="noreferrer">Download</a>}

    </div>
  );
}

export default SpeechInput;
