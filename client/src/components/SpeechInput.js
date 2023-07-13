import React, { useState } from 'react';
import axios from 'axios';

function SpeechInput({ setMessages }) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
        setMediaRecorder(mediaRecorder);
        mediaRecorder.start();
        setIsRecording(true);

        const audioChunks = [];
        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          setRecordedBlob(audioBlob);
        });
      });
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleSend = async () => {
    if (recordedBlob) {
      try {
        const formData = new FormData();
        formData.append('audio', recordedBlob);
        formData.append('mode', 'speech');

        const response = await axios.post('http://localhost:3005/api/ai', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log(response.data);

        // Update the AI response state
        const aiMessage = response.data.aiResponse.choices[0].message.content;
        setAiResponse(aiMessage);

        const transcript = response.data.transcript;
        setTranscript(transcript);

        // Update the messages state in the parent component
        setMessages(prevMessages => [
          ...prevMessages,
          { sender: 'User', content: transcript },
          { sender: 'AI', content: aiMessage },
        ]);
      } catch (error) {
        console.error(error);
      }
    }
  };


  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording} type="button">
        {isRecording ? "Recording..." : "Start"}
      </button>
      <button onClick={handleSend} type="button">Send</button>
    </div>
  );
}

export default SpeechInput;
