import express from "express";
import { generateInterviewReport, getUserInterviewReports, getInterviewReportById } from "../controllers/interview.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const aiRouter = express.Router();

aiRouter.route("/generate-interview-report/:id").post(isAuthenticated, generateInterviewReport);
aiRouter.route("/interview-reports").get(isAuthenticated, getUserInterviewReports);
aiRouter.route("/interview-report/:id").get(isAuthenticated, getInterviewReportById);

export default aiRouter;
