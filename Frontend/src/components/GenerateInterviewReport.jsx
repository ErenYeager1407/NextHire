import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { AI_API_END_POINT } from "@/utils/constant";
import Navbar from "./shared/Navbar";

const LOADING_MESSAGES = [
  "Analyzing your resume...",
  "Matching with job requirements...",
  "Identifying skill gaps...",
  "Crafting interview questions...",
  "Building preparation plan...",
  "Generating personalized report...",
  "Almost there, finalizing...",
];

const GenerateInterviewReport = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);

  // Cycle through loading messages
  useEffect(() => {
    if (loading) {
      intervalRef.current = setInterval(() => {
        setMessageIndex((prev) =>
          prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev
        );
      }, 4000);

      // Smooth progress bar (goes up to ~90% then waits)
      progressRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90;
          return prev + Math.random() * 3 + 0.5;
        });
      }, 500);
    }

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(progressRef.current);
    };
  }, [loading]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.post(
          `${AI_API_END_POINT}/generate-interview-report/${jobId}`,
          {},
          { withCredentials: true }
        );
        if (res.data.success) {
          setProgress(100);

          if (res.data.duplicate) {
            toast.info("Report already exists for this job with your current profile.");
          } else {
            toast.success("Interview report generated successfully!");
          }

          // Short delay so user sees 100% before redirect
          setTimeout(() => {
            navigate(`/interview-report/${res.data.interviewReport._id}`, {
              replace: true,
            });
          }, 500);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to generate interview report"
        );
        toast.error(
          err.response?.data?.message || "Failed to generate interview report"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [jobId, navigate]);

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg font-medium">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-[#7209b7] text-white rounded-lg hover:bg-[#5f32ad] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 px-4">
        {/* Animated AI Icon */}
        <div className="relative">
          {/* Outer pulsing ring */}
          <div className="absolute inset-0 rounded-full bg-purple-400 opacity-20 animate-ping" style={{ animationDuration: "2s" }} />
          <div className="absolute -inset-3 rounded-full bg-purple-300 opacity-10 animate-ping" style={{ animationDuration: "3s" }} />
          
          {/* Main icon container */}
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#7209b7] to-[#a855f7] flex items-center justify-center shadow-lg shadow-purple-300/50">
            <svg
              className="w-12 h-12 text-white animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
              />
            </svg>
          </div>
        </div>

        {/* Status Text */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">
            Generating Your Report
          </h2>
          <p
            className="text-gray-500 text-lg transition-all duration-500 ease-in-out min-h-[28px]"
            key={messageIndex}
            style={{
              animation: "fadeInUp 0.5s ease-out",
            }}
          >
            {LOADING_MESSAGES[messageIndex]}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: "linear-gradient(90deg, #7209b7, #a855f7, #7209b7)",
                backgroundSize: "200% 100%",
                animation: "shimmer 2s linear infinite",
              }}
            />
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            {Math.round(Math.min(progress, 100))}% complete
          </p>
        </div>

        {/* Tip */}
        <p className="text-sm text-gray-400 max-w-sm text-center">
          This usually takes 15–30 seconds. We're using AI to analyze your profile
          against the job requirements.
        </p>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default GenerateInterviewReport;
