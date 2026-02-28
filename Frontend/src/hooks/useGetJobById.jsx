import axios from "axios";
import { JOB_API_END_POINT } from "../utils/constant";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setSingleJob } from "@/redux/jobSlice";

const useGetJobById = (id) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!id) return;

    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });
        dispatch(setSingleJob(res.data.job));
      } catch (error) {
        console.error("useGetJobById error:", error);
      }
    };

    fetchSingleJob();
  }, [dispatch, id]);
};


export default useGetJobById;
