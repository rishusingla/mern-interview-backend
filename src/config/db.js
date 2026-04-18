import mongoose from "mongoose";
import config from "./config.js";
async function connectDB() {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("DB connected successfully!")
    }
    catch (err) {
        console.log("Couldn't connect to DB")
    }
}
export default connectDB;