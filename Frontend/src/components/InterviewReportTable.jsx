import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { FileText, ExternalLink } from "lucide-react";

const InterviewReportTable = () => {
  const navigate = useNavigate();
  const { interviewReports } = useSelector((store) => store.interviewReport);

  const getScoreColor = (score) => {
    if (score >= 80) return "bg-green-100 text-green-700 border-green-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableCaption>Your AI-generated interview preparation reports</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Match Score</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!interviewReports || interviewReports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-8 w-8 text-gray-300" />
                  <span>No interview reports generated yet.</span>
                  <span className="text-sm text-gray-400">
                    Visit a job description page to generate your first report.
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            interviewReports.map((report) => (
              <TableRow
                key={report._id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => navigate(`/interview-report/${report._id}`)}
              >
                <TableCell className="text-gray-600">
                  {report.createdAt?.split("T")[0]}
                </TableCell>
                <TableCell className="font-medium">{report.title}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`font-bold ${getScoreColor(report.matchScore)}`}
                  >
                    {report.matchScore}%
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex items-center gap-1 text-[#7209b7] text-sm font-medium hover:underline">
                    View <ExternalLink className="h-3 w-3" />
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InterviewReportTable;
