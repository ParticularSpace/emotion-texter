import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
import { Button, Box } from '@mui/material';

function SpeechInput({ setMessages }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);

  const handleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

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

  useEffect(() => {
    if (recordedBlob) {
      handleSend();
    }
  }, [recordedBlob]);

  const handleSend = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', recordedBlob);
      formData.append('mode', 'speech');

      const response = await axios.post('http://localhost:3005/api/ai', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const userMessage = response.data.transcript;
      const aiMessage = response.data.aiResponse.choices[0].message.content;

      setMessages(prevMessages => [
        ...prevMessages,
        { sender: 'User', content: userMessage },
        { sender: 'AI', content: aiMessage },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="10vh"
    >
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleRecording}
        startIcon={isRecording || isLoading ? <ClipLoader color="#ffffff" loading={true} size={15} /> : null}
      >
        {isRecording ? "Recording..." : isLoading ? "Loading..." : "Start"}
      </Button>
    </Box>
  );
}

export default SpeechInput;
