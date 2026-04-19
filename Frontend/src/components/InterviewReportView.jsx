import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { AI_API_END_POINT } from "@/utils/constant";
import Navbar from "./shared/Navbar";
import Spinner from "./shared/Spinner";
import { Button } from "./ui/button";
import { ArrowLeft, Briefcase, ExternalLink } from "lucide-react";
import Footer from "./Footer";

const InterviewReportView = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(
          `${AI_API_END_POINT}/interview-report/${reportId}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setData(res.data.interviewReport);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load interview report"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportId]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <Spinner />
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-gray-500 text-lg">
            Failed to load interview report.
          </p>
          <Button variant="outline" onClick={() => navigate("/profile")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header with navigation */}
          <div className="bg-white shadow-md rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Interview Report
                </h1>
                <p className="text-gray-500 mt-2">{data.title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Generated on {data.createdAt?.split("T")[0]}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate("/profile")}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Profile
                </Button>
                {data.jobId && (
                  <Button
                    onClick={() => navigate(`/description/${data.jobId}`)}
                    className="bg-[#7209b7] hover:bg-[#5f32ad] gap-2"
                  >
                    <Briefcase className="h-4 w-4" /> View Job Posting
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Score + Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-3">Match Score</h2>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50" cy="50" r="42"
                      fill="none" stroke="#e5e7eb" strokeWidth="8"
                    />
                    <circle
                      cx="50" cy="50" r="42"
                      fill="none"
                      stroke={data.matchScore >= 80 ? "#22c55e" : data.matchScore >= 60 ? "#eab308" : "#ef4444"}
                      strokeWidth="8"
                      strokeDasharray={`${(data.matchScore / 100) * 264} 264`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                    {data.matchScore}%
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {data.matchScore >= 80
                    ? "Excellent match! You're well-suited for this role."
                    : data.matchScore >= 60
                    ? "Good match. Some areas to improve."
                    : "Needs work. Focus on the skill gaps below."}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-3">Overall Feedback</h2>
              <p className="text-gray-600 leading-relaxed">{data.overallFeedback}</p>
            </div>
          </div>

          {/* Job + Profile */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-3">Job Description</h2>
              <p className="text-gray-600">{data.jobDescription}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-3">Your Profile</h2>
              <p className="text-gray-600 whitespace-pre-line">
                {data.selfDescription}
              </p>
            </div>
          </div>

          {/* Skill Gaps */}
          {data.skillGaps?.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-4">Skill Gaps</h2>
              <ul className="space-y-2">
                {data.skillGaps.map((gap, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <span className="text-gray-700 font-medium">{gap.skill}</span>
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        gap.severity === "high"
                          ? "bg-red-100 text-red-700"
                          : gap.severity === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {gap.severity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Preparation Plan */}
          {data.preparationPlan?.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-4">Preparation Plan</h2>
              <ul className="space-y-3">
                {data.preparationPlan.map((item, index) => (
                  <li key={index} className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                        Day {item.day}
                      </span>
                      <span className="font-semibold text-gray-800">
                        {item.focus}
                      </span>
                    </div>
                    <ul className="list-disc pl-6 space-y-1">
                      {item.tasks?.map((task, tIdx) => (
                        <li key={tIdx} className="text-gray-600 text-sm">
                          {task}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technical Questions */}
          {data.technicalQuestions?.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-4">
                Technical Questions
              </h2>
              <ul className="space-y-3">
                {data.technicalQuestions.map((q, index) => (
                  <li
                    key={index}
                    className="border p-4 rounded-lg space-y-2"
                  >
                    <p className="font-semibold text-gray-800">
                      {index + 1}. {q.question}
                    </p>
                    <p className="text-sm text-gray-500">
                      <b>Intention:</b> {q.intention}
                    </p>
                    <p className="text-sm text-gray-600">
                      <b>How to answer:</b> {q.answer}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Behavioral Questions */}
          {data.behavioralQuestions?.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-4">
                Behavioral Questions
              </h2>
              <ul className="space-y-3">
                {data.behavioralQuestions.map((q, index) => (
                  <li
                    key={index}
                    className="border p-4 rounded-lg space-y-2"
                  >
                    <p className="font-semibold text-gray-800">
                      {index + 1}. {q.question}
                    </p>
                    <p className="text-sm text-gray-500">
                      <b>Intention:</b> {q.intention}
                    </p>
                    <p className="text-sm text-gray-600">
                      <b>How to answer:</b> {q.answer}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Resume */}
          {data.resume && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-3">Resume</h2>
              <a
                href={data.resume}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-purple-600 underline hover:text-purple-800 transition-colors"
              >
                View Resume <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InterviewReportView;
