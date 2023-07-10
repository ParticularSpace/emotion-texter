const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Configuration, OpenAIApi } = require('openai');
const speech = require('@google-cloud/speech');

process.env['GOOGLE_APPLICATION_CREDENTIALS']='/Users/Sam/Documents/unified-coyote-392422-b52e5d16b216.json';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const upload = multer();

const openai = new OpenAIApi(configuration);

router.post('/', upload.single('audio'), async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const language = req.body.language; // Get the target language from the request body
        const mode = req.body.mode; // Get the mode from the request body


        let response;
        if (mode === 'translation') {
            // If the mode is 'translation', use the createCompletion endpoint for translation
            response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `Translate this English text to ${language}: ${prompt}`,
                temperature: 0.3,
                max_tokens: 60
            });
        } else if (mode === 'stocks') {
            // If the mode is 'stocks', use the createCompletion endpoint for stock analysis
            // You'll need to modify this to suit your needs
            response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `Analyze the stock: ${prompt}`,
                temperature: 0.3,
                max_tokens: 2000
            });
        } else if (mode === 'speech') {
            console.log('speech mode hit');
            // If the mode is 'speech', use the Google Speech-to-Text API to transcribe the audio
            // Then use the transcribed text as the prompt for the GPT-4 model
            const audioFile = req.file; // Get the audio data from 

            console.log(audioFile, 'audioFile');

            // Convert the buffer to a base64 string
            const audioBase64 = audioFile.buffer.toString('base64');

            // Create a new Speech-to-Text client
            const client = new speech.SpeechClient();

            // The audio data and its configuration
            const audio = {
                content: audioBase64,
            };
            const config = {
                encoding: 'OGG_OPUS',
                sampleRateHertz: 48000,
                languageCode: 'en-US',
            };
            

            // The transcription request
            const request = {
                audio: audio.content,
                config: config,
            };

            console.log('request', request);

            // Transcribe the audio
            const [transcription] = await client.recognize(request);
            console.log('Transcription: ', transcription.results);
            const transcript = transcription.results
                .map(result => result.alternatives[0].transcript)
                .join('\n');

            console.log(transcript, 'transcript');

            // Use the transcribed text as the prompt for the GPT-4 model
            response = await openai.createChatCompletion({
                model: "gpt-4", 
                temperature: 0.7,
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant."
                    },
                    {
                        role: "user",
                        content: transcript
                    }
                ],
            });
        } else {
            // If no specific mode is specified, use the createChatCompletion endpoint as before
            response = await openai.createChatCompletion({
                model: "gpt-4", 
                temperature: 0.7,
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
            });
        }

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

module.exports = router;
