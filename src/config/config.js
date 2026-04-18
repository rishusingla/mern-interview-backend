import dotenv from 'dotenv';
dotenv.config();

if (!process.env.MONGO_URI) {
    console.log("MONGO_URI is not present in env file");
}
if (!process.env.JWT_SECRET) {
    console.log("JWT_SECRET is not present in env file");
}
if (!process.env.GOOGLE_GENAI_API_KEY) {
    console.log("GOOGLE_GENAI_API_KEY is not present in env file")
}
const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_GENAI_API_KEY:process.env.GOOGLE_GENAI_API_KEY
}

export default config;