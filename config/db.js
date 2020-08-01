const mongoose = require('mongoose');
const config = require('config'); //from package.json
const db = config.get('mongoURI');

const connectDB = async () => { // in case there is an error
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        // exit process with failure 
        process.exit(1); // application will fail
    }
}

module.exports = connectDB;