import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Navbar from "./shared/Navbar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  APPLICATION_API_END_POINT,
  JOB_API_END_POINT,
  USER_API_END_POINT,
} from "@/utils/constant";
import { toast } from "sonner";
import { setSingleJob, setSavedJobs, setLoadingJobs } from "@/redux/jobSlice";
import { setUser } from "@/redux/authSlice";
import useGetCompanyById from "@/hooks/useGetCompanyById";
import Spinner from "./shared/Spinner";
import Footer from "./Footer";

const JobDescription = () => {
  const dispatch = useDispatch();
  const { id: jobId } = useParams();

  const { singleJob, savedJobs, loadingJobs } = useSelector(
    (store) => store.job,
  );
  const { user } = useSelector((store) => store.auth);
  // dispatch(setLoadingJobs(true));

  /* ================= APPLY STATE ================= */
  const isApplied = useMemo(() => {
    return (
      singleJob?.applications?.some(
        (application) => application.applicant === user?._id,
      ) || false
    );
  }, [singleJob, user]);

  /* ================= SAVE STATE ================= */
  const isSaved = useMemo(() => {
    return savedJobs?.some((job) =>
      typeof job === "string" ? job === jobId : job._id === jobId,
    );
  }, [savedJobs, jobId]);

  /* ================= APPLY JOB ================= */
  const applyJobHandler = async () => {
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        {},
        { withCredentials: true },
      );

      if (res.data.success) {
        const updatedJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user._id }],
        };
        dispatch(setSingleJob(updatedJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply");
    }
  };

  /* ================= SAVE / REMOVE JOB ================= */
  const toggleSaveHandler = async () => {
    try {
      if (!isSaved) {
        const res = await axios.post(
          `${USER_API_END_POINT}/save-job`,
          { jobId },
          { withCredentials: true },
        );

        dispatch(setSavedJobs(res.data.user.saveJobs));
        dispatch(setUser(res.data.user));
        toast.success("Job saved successfully");
      } else {
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

  /* ================= FETCH JOB ================= */
  useEffect(() => {
    const fetchJob = async () => {
      try {
        dispatch(setLoadingJobs(true)); // ✅ START loading
        dispatch(setSingleJob(null));
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
        }
      } catch (error) {
        toast.error("Failed to fetch job");
      } finally {
        dispatch(setLoadingJobs(false));
      }
    };
    fetchJob();
  }, [jobId, dispatch]);

  /* ================= FETCH COMPANY ================= */
  useGetCompanyById(singleJob?.company);
  const { singleCompany } = useSelector((store) => store.company);

  if (loadingJobs || !singleJob) {
    return (
      <div>
        <Navbar/>
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto my-4 p-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-bold text-xl">{singleJob?.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <Badge className="text-blue-700 font-bold" variant="outline">
                {singleJob?.position} positions
              </Badge>
              <Badge className="text-[#F83002] font-bold" variant="outline">
                {singleJob?.jobType}
              </Badge>
              <Badge className="text-[#7209b7] font-bold" variant="outline">
                {singleJob?.salary} LPA
              </Badge>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-4 mt-6">
            <Button
              onClick={!isApplied ? applyJobHandler : undefined}
              disabled={isApplied}
              className={`rounded-lg ${
                isApplied
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#7209b7] hover:bg-[#5f32ad]"
              }`}
            >
              {isApplied ? "Already applied" : "Apply now"}
            </Button>

            <Button
              onClick={toggleSaveHandler}
              variant={isSaved ? "outline" : "default"}
              className={`rounded-lg px-6 cursor-pointer ${
                isSaved
                  ? "border-green-600 text-green-600 hover:bg-red-100 hover:text-black hover:border-red-600"
                  : "bg-white text-black border hover:bg-green-100 hover:text-black hover:border-green-600"
              }`}
            >
              {isSaved ? "Saved" : "Save"}
            </Button>
          </div>
        </div>

        {/* DESCRIPTION */}
        <h1 className="border-b-2 border-b-gray-300 font-medium py-4 mt-6">
          Job Description
        </h1>

        <div className="my-4 space-y-2">
          <p>
            <b>Role:</b> {singleJob?.title}
          </p>
          <p>
            <b>Company:</b> {singleCompany?.name}
          </p>
          <p>
            <b>Location:</b> {singleJob?.location}
          </p>
          <p>
            <b>Description:</b> {singleJob?.description}
          </p>
          <p>
            <b>Experience:</b> {singleJob?.expirenceLevel} yrs
          </p>
          <p>
            <b>Salary:</b> {singleJob?.salary} LPA
          </p>
          <p>
            <b>Total Applicants:</b> {singleJob?.applications?.length}
          </p>
          <p>
            <b>Posted Date:</b> {singleJob?.createdAt?.split("T")[0]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
