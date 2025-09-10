import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import multer from "multer";
import connectDB from "./config/database.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(helmet());
const upload = multer({ dest: "uploads/" });

export const Bootstrap = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(("error", (err) => console.log("Server error", err)));
    process.exit(3);
  }
};
