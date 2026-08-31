require('dotenv').config()
const app = require('./src/app')

const port = process.env.PORT
const connectDB = require('./src/DB/db')

async function startServer() {
    await connectDB()

    app.listen(port, () => {
        console.log(`Server is running on http://localhost${port} 😎`)
    })
}

startServer()