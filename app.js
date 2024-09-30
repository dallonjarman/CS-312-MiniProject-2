const express = require('express');
const axios = require('axios');
const app = express();

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Home route to render input form
app.get('/', (req, res) => {
    res.render('index');
});

// Result route: fetch a joke and personalize it
app.get('/catJoke', async (req, res) => {
    const category = req.query.category || "Any";  
    const jokeApiUrl = `https://v2.jokeapi.dev/joke/${category}`; 

    try {
        // Fetch the joke from JokeAPI
        const jokeResponse = await axios.get(jokeApiUrl);

        var joke = '';

        if (jokeResponse.data.type === 'single') {
            joke = jokeResponse.data.joke;
        } else {
            joke = `${jokeResponse.data.setup} ${jokeResponse.data.delivery}`;
        }

        var jokeNew = joke

        if (joke.includes('?')) {
            jokeNew = joke.replace(/\?/g, ' ');
        }

        const catJoke = `https://cataas.com/cat/cute/says/${jokeNew}?fontSize=20&fontColor=red`

       

        const catRespone = await axios.get(catJoke);
        // Render the result page with the personalized joke and random fact
        res.render('catJoke', { joke, catPicture: catJoke });
    } catch (error) {
        console.error(error); // Log any errors that occur
        res.render('error', { message: 'Unable to retrieve a joke or fact. Please try again.' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});