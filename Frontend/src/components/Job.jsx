import React, { useMemo } from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setSavedJobs } from "@/redux/jobSlice";
import { setUser } from "@/redux/authSlice";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { savedJobs } = useSelector((store) => store.job);

  const jobId = job?._id;

  /* ===== isSaved (derived state) ===== */
  const isSaved = useMemo(() => {
    return savedJobs?.some((j) =>
      typeof j === "string" ? j === jobId : j._id === jobId,
    );
  }, [savedJobs, jobId]);

  /* ===== TOGGLE SAVE ===== */
  const toggleSaveHandler = async () => {
    try {
      if (!isSaved) {
        // SAVE JOB
        const res = await axios.post(
          `${USER_API_END_POINT}/save-job`,
          { jobId },
          { withCredentials: true },
        );

        dispatch(setSavedJobs(res.data.user.saveJobs));
        dispatch(setUser(res.data.user));
        toast.success("Job saved successfully");
      } else {
        // REMOVE SAVED JOB
        const res = await axios.post(
          `${USER_API_END_POINT}/remove-saved-job`,
          { jobId },
          { withCredentials: true },
        );

        dispatch(setSavedJobs(res.data.savedJobs));
        dispatch(setUser({ ...user, saveJobs: res.data.savedJobs }));
        toast.success("Job removed successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  /* ===== Days ago ===== */
  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currTime = new Date();
    return Math.floor((currTime - createdAt) / (1000 * 60 * 60 * 24));
  };

  const days = daysAgoFunction(job?.createdAt);

return (
  <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100 
                  flex flex-col h-[320px]">

    {/* HEADER */}
    <div className="flex items-center justify-between h-6">
      <p className="text-sm text-gray-500">
        {days === 0 ? "Today" : `${days} days ago`}
      </p>

      <Button
        variant="outline"
        className={`rounded-full ${
          isSaved ? "text-green-600 border-green-600" : ""
        }`}
        size="icon"
        onClick={toggleSaveHandler}
      >
        <Bookmark fill={isSaved ? "currentColor" : "none"} />
      </Button>
    </div>

    {/* COMPANY */}
    <div className="flex items-center gap-2 mt-3 h-14">
      <Button className="p-6" variant="outline" size="icon">
        <Avatar>
          <AvatarImage src={job?.company?.logo} />
        </Avatar>
      </Button>
      <div>
        <h1 className="font-medium leading-tight">
          {job?.company?.name}
        </h1>
        <p className="text-sm text-gray-500">India</p>
      </div>
    </div>

    {/* CONTENT (ONLY FLEX-GROW AREA) */}
    <div className="flex-1 mt-3">
      <h1 className="font-bold text-lg leading-snug line-clamp-2">
        {job?.title}
      </h1>
      <p className="text-sm text-gray-600 leading-snug line-clamp-2 mt-1">
        {job?.description}
      </p>
    </div>

    {/* BADGES */}
    <div className="flex items-center gap-2 flex-wrap min-h-[32px]">
      <Badge className="text-blue-700 font-bold max-w-[120px] truncate" variant="ghost">
        {job?.position} positions
      </Badge>
      <Badge className="text-[#F83002] font-bold max-w-[120px] truncate" variant="ghost">
        {job?.jobType}
      </Badge>
      <Badge className="text-[#7209b7] font-bold max-w-[120px] truncate" variant="ghost">
        {job?.salary} LPA
      </Badge>
    </div>

    {/* ACTIONS */}
    <div className="flex items-center gap-2 mt-3 h-9">
      <Button
        onClick={() => navigate(`/description/${jobId}`)}
        variant="outline"
        className="h-9"
      >
        Details
      </Button>

      <Button
        onClick={toggleSaveHandler}
        className={`h-9 ${ isSaved ? "bg-[#7209b7]/10 text-[#7209b7] border border-[#7209b7]/40 hover:bg-[#7209b7]/20"
            : "bg-[#7209b7]"
        }`}
      >
        {isSaved ? "Saved" : "Save for later"}
      </Button>
    </div>
  </div>
);
};

export default Job;
