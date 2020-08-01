const express = require('express');

const app = express(); // initialize our app

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000; // will help with the deployment to heroku

app.listen(PORT, () => console.log(`Server started on ${PORT}`)); //listen on the port above