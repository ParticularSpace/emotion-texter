const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Configuration, OpenAIApi } = require('openai');
const speech = require('@google-cloud/speech');
const request = require('request');


process.env['GOOGLE_APPLICATION_CREDENTIALS'] = '/Users/Sam/Documents/unified-coyote-392422-b52e5d16b216.json';

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
        }
        
        else if (mode === 'stocks') {
            const stockSymbol = prompt; // Assuming prompt is the stock symbol
            const apiKey = process.env.ALPHA_VANTAGE_API_KEY; // Make sure to set this in your environment variables
        
            // Construct the URL for the Alpha Vantage API to get daily data
            const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${apiKey}`;
        
            response = await new Promise((resolve, reject) => {
                request.get({
                    url: url,
                    json: true,
                    headers: { 'User-Agent': 'request' }
                }, async (err, apiRes, data) => {
                    if (err || apiRes.statusCode !== 200) {
                        console.error('Error fetching stock data:', err || apiRes.statusCode);
                        reject(new Error('Failed to fetch stock data.'));
                    } else {
                        // Extract the time series data from the API response
                        const timeSeriesData = data["Time Series (Daily)"];
        
                        // Check if the data is available
                        if (!timeSeriesData) {
                            console.error('Time Series data is missing from the API response.');
                            reject(new Error('Failed to fetch stock data.'));
                            return;
                        }
        
                        // Convert the data into an array and take the last 7 entries
                        const lastWeekData = Object.entries(timeSeriesData).slice(0, 7);
        
                        // Check if there are enough entries
                        if (lastWeekData.length < 7) {
                            console.warn('Less than 7 days of data available.');
                        }
        
                        // Continue processing as before
                        const stockData = lastWeekData.map(([time, values]) => ({
                            time: new Date(time),
                            open: parseFloat(values["1. open"]),
                            high: parseFloat(values["2. high"]),
                            low: parseFloat(values["3. low"]),
                            close: parseFloat(values["4. close"]),
                            volume: parseInt(values["5. volume"], 10)
                        }));
                        // Calculate some basic statistics
                        const avgVolume = stockData.reduce((sum, data) => sum + data.volume, 0) / stockData.length;
                        const avgClose = stockData.reduce((sum, data) => sum + data.close, 0) / stockData.length;
                        const highestPrice = Math.max(...stockData.map(data => data.high));
                        const lowestPrice = Math.min(...stockData.map(data => data.low));
        
                        // Create a prompt for OpenAI
                        const stockPrompt = `Analyze the stock ${stockSymbol} for the past week with the following data:
                        - Average Volume: ${avgVolume}
                        - Average Closing Price: ${avgClose}
                        - Highest Price: ${highestPrice}
                        - Lowest Price: ${lowestPrice}`;
        
                        // Pass the prompt to OpenAI's model
                        const openAIResponse = await openai.createCompletion({
                            model: "text-davinci-003",
                            prompt: stockPrompt,
                            temperature: 0.3,
                            max_tokens: 200
                        });
        
                        resolve(openAIResponse.data.choices[0].text);
                    }
                });
            });
        
            // Send the response back to the client
            return res.json({ analysis: response });
        }
        
        

        else if (mode === 'speech') {

            // Get the audio file buffer from the response
            const audioBuffer = req.file.buffer;

            // Convert the buffer to a base64 string
            const audioBase64 = audioBuffer.toString('base64');


            // Create a new Speech-to-Text client
            const client = new speech.SpeechClient();

            // The audio data and its configuration
            const audio = {
                content: audioBase64,
            };
            const config = {
                encoding: 'WEBM_OPUS',
                sampleRateHertz: 48000,
                languageCode: 'en-US',
            };

            // The transcription request
            const request = {
                audio: audio,
                config: config,
            };

            // Transcribe the audio
            const [transcription] = await client.recognize(request);
            const transcript = transcription.results
                .map(result => result.alternatives[0].transcript)
                .join('\n');

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

            // Include the transcribed text in the response
            return res.json({ transcript: transcript, aiResponse: response.data });

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

        return res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

module.exports = router;
