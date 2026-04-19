import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import { setUser } from "@/redux/authSlice";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import SavedJobTable from "./SavedJobTable";
import useGetSavedJobs from "@/hooks/useGetSavedJobs";
import useGetInterviewReports from "@/hooks/useGetInterviewReports";
import InterviewReportTable from "./InterviewReportTable";
import Footer from "./Footer";

const Profile = () => {
  useGetAppliedJobs();
  useGetSavedJobs();
  useGetInterviewReports();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const isResume = user?.profile?.resume;
  const skills = user?.profile?.skills || [];
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 mx-3 sm:mx-auto p-4 sm:p-8 overflow-hidden">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={
                  user?.profile?.profilePhoto || "https://github.com/shadcn.png"
                }
              />
            </Avatar>
            <div>
              <h1 className="font-bold text-xl">{user.fullname}</h1>
              <p className="text-sm text-gray-500">{user.profile.bio}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="text-right cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <Pen />
          </Button>
        </div>

        <div className="my-5">
          <div className="flex items-center gap-3 my-2 min-w-0">
            <Mail className="shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center gap-3 my-2 min-w-0">
            <Contact className="shrink-0" />
            <span className="truncate">{user.phoneNumber}</span>
          </div>
        </div>
        <div className="my-5">
          <h1 className="font-bold">Skills</h1>
          <div className="flex items-center gap-1 font-bold flex-wrap">
            {skills && skills.length > 0 ? (
              skills.map((item, index) => <Badge key={index}>{item}</Badge>)
            ) : (
              <span>NA</span>
            )}
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="text-md font-bold">Resume</Label>
          {isResume ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={user?.profile?.resume}
              className="text-blue-500 underline"
            >
              {user?.profile?.resumeOriginalName || "View Resume"}
            </a>
          ) : (
            <span>NA</span>
          )}
        </div>
      </div>

      {/* Interview Reports Section */}
      <div className="max-w-4xl mx-3 sm:mx-auto bg-white rounded-2xl overflow-hidden mb-5">
        <h1 className="font-bold text-lg my-4 mx-2">Interview Reports</h1>
        <InterviewReportTable />
      </div>

      <div className="max-w-4xl mx-3 sm:mx-auto bg-white rounded-2xl overflow-hidden">
        <h1 className="font-bold text-lg my-4 mx-2">Applied Jobs</h1>
        <AppliedJobTable />
      </div>
      <UpdateProfileDialog open={open} setOpen={setOpen} />
      <div className="max-w-4xl mx-3 sm:mx-auto bg-white rounded-2xl overflow-hidden">
        <h1 className="font-bold text-lg my-4 mx-5">Saved Jobs</h1>
        <div>
          <SavedJobTable />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
