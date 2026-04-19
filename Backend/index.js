  import cookieParser from "cookie-parser";
  import express from "express";
  import cors from "cors";
  import dotenv from "dotenv";
  import connectDB from "./utils/db.js";
  import userRoute from "./routes/user.route.js";
  import companyRoute from "./routes/company.route.js";
  import jobRoute from "./routes/job.route.js";
  import applicationRoute from "./routes/application.route.js";
  import aiRouter from "./routes/ai.route.js";

  const app = express();
  app.set("trust proxy", 1);
  dotenv.config({}); //reads .env and stores variables in process.env

  //middlewares
  app.use(express.json()); //read json
  app.use(express.urlencoded({ extended: true })); //read form data
  app.use(cookieParser()); //read cookies
  const corsOptions = {
    origin: ["http://localhost:5173", "https://next-hire-psi.vercel.app"],
    credentials: true, // allow browser to send credentials
  };
  app.use(cors(corsOptions)); //allow frontend and backend communiacations

  const PORT = process.env.PORT || 3000;

  //apis
  app.use("/api/v1/user", userRoute);
  app.use("/api/v1/company", companyRoute);
  app.use("/api/v1/job", jobRoute);
  app.use("/api/v1/application", applicationRoute);
  app.use("/api/v1/ai", aiRouter)

  app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
  });
