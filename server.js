const app = require('./src/app')
const dotenv = require('dotenv')
dotenv.config()

const port = process.env.PORT

async function startServer() {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost${port} 😎`)
    })
}

startServer()