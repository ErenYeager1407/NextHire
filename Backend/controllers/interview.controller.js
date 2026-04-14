import { log } from "console";
import interviewReportModel from "../models/interviewReport.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { extractTextFromPDF } from "../utils/pdfParser.js";
import { interviewReportFormAPI } from "./services/ai.services.js";

export const generateInterviewReport = async (req, res) => {
    try {
        const {id} = req.params;
        const job = await Job.findById(id);
        console.log(id)
        if(!job){
            return res.status(404).json({message: "Job not found"});
        }
        const user = await User.findById(req.id)
        console.log(req.id);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const resume = await extractTextFromPDF(user.profile.resume);
        const selfDescription = user.profile.bio + "\n" + user.profile.skills.join(", ");
        const jobDescription = job.description;

        const interviewReportByAi = await interviewReportFormAPI({resume, selfDescription, jobDescription});

        const interviewReport = await interviewReportModel.create({
            jobId: job._id,
            jobDescription: job.description,
            resume: user.profile.resume,
            selfDescription: user.profile.bio + "\n" + user.profile.skills.join(", "),
            overallFeedback: interviewReportByAi.overallFeedback,
            matchScore: interviewReportByAi.matchScore,
            technicalQuestions: interviewReportByAi.technicalQuestions,
            behavioralQuestions: interviewReportByAi.behavioralQuestions,
            skillGaps: interviewReportByAi.skillGaps,
            preparationPlan: interviewReportByAi.preparationPlan,
            userId: user._id,
            title: job.title
        });
        
        res.status(200).json({message: "Interview report generated successfully", interviewReport});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}
