import app from "./src/app.js";
import { configDotenv } from "dotenv";

app.listen(process.env,()=>{
    console.log(`Server is running on http://${process.env.PORT}`)
})