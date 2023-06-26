const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

router.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const language = req.body.language; // Get the target language from the request body
        const mode = req.body.mode; // Get the mode from the request body
        const audio = req.body.audio; // Get the audio data from the request body

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
            console.log(req.body, 'req.body');
            // If the mode is 'speech', use the Whisper ASR API to transcribe the audio
            // Then use the transcribed text as the prompt for the GPT-4 model
            const audioFile = req.body.audio; // Get the audio data from the request body
            const transcription = await openai.Audio.transcribe("whisper-1", audioFile);
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
                        content: transcription.text
                    }
                ],
            });
        }
         else {
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
