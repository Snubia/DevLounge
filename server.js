const express = require('express');
const connectDB = require('./config/db');


const app = express(); // initialize our app

// connect database
connectDB();

// Init middleware
app.use(express.json({
    extended: false
}));

app.get('/', (req, res) => res.send('API Running'));


//Define and access routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000; // will help with the deployment to heroku

app.listen(PORT, () => console.log(`Server started on ${PORT}`)); //listen on the port above