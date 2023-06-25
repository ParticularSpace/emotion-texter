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

        let response;
        if (language) {
            // If a target language is specified, use the createCompletion endpoint for translation
            response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `Translate this English text to ${language}: ${prompt}`,
                temperature: 0.3,
                max_tokens: 60
            });
        } else {
            // If no target language is specified, use the createChatCompletion endpoint as before
            response = await openai.createChatCompletion({
                model: "gpt-4", 
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
