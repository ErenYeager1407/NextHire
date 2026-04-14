import express from "express";
import { generateInterviewReport } from "../controllers/interview.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const aiRouter = express.Router();

aiRouter.route("/generate-interview-report/:id").post(isAuthenticated, generateInterviewReport);

export default aiRouter;



