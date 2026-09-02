const mongoose = require('mongoose')

async function connectToDb() {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('Server connected to DB 🥳');
        })
        .catch(error => {
            console.log('Got an error While connecting to DB 😅:', error)
            process.exit(1)
        })
}

module.exports = connectToDb