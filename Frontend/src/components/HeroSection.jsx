import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };
  return (
    <div className="text-center">
      <div className="flex flex-col gap-5 my-10">
        <span className="mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium">
          No. 1 Job Hunt Site
        </span>
        <h1 className="text-3xl md:text-5xl font-bold">
          Search, Apply, & <br /> Get your{" "}
          <span className="text-[#6A38C2]">Dream Job</span>
        </h1>
        <p>
          Search, Apply & Get Your Dream Job with NextHire
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // prevent page reload
            searchJobHandler();
          }}
          className="flex w-full sm:w-[70%] md:w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center mx-auto h-9"
        >
          <input
            type="text"
            placeholder="Find your dream job"
            className="outline-none border-none w-full"
            onChange={(e) => setQuery(e.target.value)}
          />

          <Button
            type="submit"
            className="rounded-r-full bg-[#6A38C2] h-full w-12 flex items-center justify-center"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default HeroSection;
