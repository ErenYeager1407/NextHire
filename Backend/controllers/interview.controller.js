import interviewReportModel from "../models/interviewReport.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { extractTextFromPDF } from "../utils/pdfParser.js";
import { interviewReportFormAPI } from "./services/ai.services.js";

export const generateInterviewReport = async (req, res) => {
    try {
        const {id} = req.params;
        const job = await Job.findById(id);
        if(!job){
            return res.status(404).json({message: "Job not found", success: false});
        }
        const user = await User.findById(req.id);
        if(!user){
            return res.status(404).json({message: "User not found", success: false});
        }

        const selfDescription = user.profile.bio + "\n" + user.profile.skills.join(", ");
        const resumeUrl = user.profile.resume;

        // --- Duplicate check ---
        const existingReport = await interviewReportModel.findOne({
            jobId: job._id,
            userId: user._id,
            resume: resumeUrl,
            selfDescription: selfDescription,
        });

        if (existingReport) {
            return res.status(200).json({
                message: "Interview report already exists for this job with your current profile.",
                interviewReport: existingReport,
                duplicate: true,
                success: true,
            });
        }

        // --- Generate new report ---
        const resume = await extractTextFromPDF(resumeUrl);
        const jobDescription = job.description;

        const interviewReportByAi = await interviewReportFormAPI({resume, selfDescription, jobDescription});

        const interviewReport = await interviewReportModel.create({
            jobId: job._id,
            jobDescription: job.description,
            resume: resumeUrl,
            selfDescription: selfDescription,
            overallFeedback: interviewReportByAi.overallFeedback,
            matchScore: interviewReportByAi.matchScore,
            technicalQuestions: interviewReportByAi.technicalQuestions,
            behavioralQuestions: interviewReportByAi.behavioralQuestions,
            skillGaps: interviewReportByAi.skillGaps,
            preparationPlan: interviewReportByAi.preparationPlan,
            userId: user._id,
            title: job.title
        });

        user.interviewReports.push(interviewReport._id);
        await user.save();
        
        res.status(200).json({
            message: "Interview report generated successfully",
            interviewReport,
            duplicate: false,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error", success: false});
    }
}

export const getUserInterviewReports = async (req, res) => {
    try {
        const userId = req.id;
        const reports = await interviewReportModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .select("title matchScore jobId createdAt jobDescription");

        return res.status(200).json({
            success: true,
            interviewReports: reports,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const getInterviewReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await interviewReportModel.findById(id);

        if (!report) {
            return res.status(404).json({ message: "Report not found", success: false });
        }

        // Verify the report belongs to the requesting user
        if (report.userId.toString() !== req.id) {
            return res.status(403).json({ message: "Unauthorized", success: false });
        }

        return res.status(200).json({
            success: true,
            interviewReport: report,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};
