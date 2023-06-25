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
        const chatCompletion = await openai.createChatCompletion({
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

        res.json(chatCompletion.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

module.exports = router;
