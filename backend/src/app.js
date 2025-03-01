import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//? common middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(urlencoded({ extended: true, limit: "16bk" }));
app.use(express.static("public"));


//? import routes
import userRouter from "./routes/user.routes.js";


//? routes
app.use("/api/v1/users", userRouter);


// Global error handler to catch errors
app.use((err, req, res, next) => {
  console.error(err); // Logs the error for debugging
  res.status(400).json({ message: err.message }); // Sends error response to client
  });
export { app };
