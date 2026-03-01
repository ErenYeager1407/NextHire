import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hydrabad", "Pune", "Mumbai"],
  },
  {
    filterType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"],
  },
  {
    filterType: "Salary",
    array: ["0-40k", "41k-1lakh", "1lakh-5lakh"],
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState(""); 
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue))
    
  }, [selectedValue])
  const changeHandler = (value) => {
    setSelectedValue(value)
  }
  return (
    <div className="w-full bg-white p-3 rounded-md">
      <h1 className="text-lg font-bold">Filter Jobs</h1>
      <hr className="mt-3" />
      <RadioGroup value={selectedValue} onValueChange={changeHandler}>
        {filterData.map((data, index) => (
          <div key={index}>
            <h1 className="font-bold text-lg ">{data.filterType}</h1>
            {data.array.map((item, idx) => {
              const itemId = `id${index}-r${idx}`
              return (
                <div className="flex items-center gap-2 my-2" key={idx}>
                  <RadioGroupItem value={item} className="cursor-pointer" id = {itemId}/>
                  <Label htmlFor={itemId}>{item}</Label>
                </div>
              );
            })}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
