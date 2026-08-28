import app from "./src/app.js";
import { configDotenv } from "dotenv";

const port = process.env.PORT 

app.listen(port,()=>{
    console.log(`Server is running on http://localhost${port} 😎`)
})