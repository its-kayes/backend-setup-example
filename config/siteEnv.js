import dotenv from "dotenv";
dotenv.config();

const { PORT, MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN } = process.env;

export { PORT, MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN };
