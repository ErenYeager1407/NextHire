import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { AI_API_END_POINT } from "@/utils/constant";
import { setInterviewReports } from "@/redux/interviewReportSlice";

const useGetInterviewReports = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`${AI_API_END_POINT}/interview-reports`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setInterviewReports(res.data.interviewReports));
        }
      } catch (error) {
        console.log("Failed to fetch interview reports:", error);
      }
    };
    fetchReports();
  }, [dispatch]);
};

export default useGetInterviewReports;
