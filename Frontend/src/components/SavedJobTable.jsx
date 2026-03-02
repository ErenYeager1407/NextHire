import useGetSavedJobs from "@/hooks/useGetSavedJobs";
import React from "react";
import { useSelector } from "react-redux";
import LatestJobCards from "./LatestJobCards";

const SavedJobTable = () => {
  useGetSavedJobs();
  const { savedJobs } = useSelector((store) => store.job);

  if (!savedJobs || savedJobs.length === 0) {
    return <div>No Saved Jobs</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-4 mx-4">
      {savedJobs.map((job) => (
        <LatestJobCards key={job._id} job={job} />
      ))}
    </div>
  );
};

export default SavedJobTable;
